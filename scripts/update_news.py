"""Turn official RSS headlines into a small, dated, same-origin news feed."""
import hashlib
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import urlparse, urlunparse

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "news.json"
FEEDS = {
    "文化": "https://www.chinanews.com.cn/rss/culture.xml",
    "生活": "https://www.chinanews.com.cn/rss/life.xml",
    "体育": "https://www.chinanews.com.cn/rss/sports.xml",
}
MAX_AGE = timedelta(days=3)


def safe_link(value):
    parts = urlparse(value.strip())
    if parts.scheme not in {"http", "https"} or parts.hostname not in {"www.chinanews.com.cn", "www.chinanews.com"} or parts.username or parts.password:
        raise ValueError("Unexpected source URL")
    return urlunparse(parts._replace(scheme="https", fragment=""))


def parse_feed(payload, topic, now):
    # Reject entity declarations; RSS is treated only as data, never as instructions.
    if b"<!DOCTYPE" in payload.upper() or b"<!ENTITY" in payload.upper():
        raise ValueError("Unsupported XML declarations")
    root = ET.fromstring(payload)
    cards = []
    for item in root.findall("./channel/item"):
        try:
            title = re.sub(r"\s+", " ", item.findtext("title", "")).strip()
            if not title or len(title) > 70:
                continue
            if re.search(r"中新网评|评论|观点|锐评|社论", title):
                continue
            if topic == "生活" and re.search(r"真探|健康|血脂|关节|诱因|长胖|减肥|疾病|治疗|用药|饮品", title):
                continue
            published = parsedate_to_datetime(item.findtext("pubDate", ""))
            if published.tzinfo is None:
                raise ValueError("Missing publication timezone")
            published = published.astimezone(timezone.utc)
            if not timedelta(minutes=-5) <= now - published <= MAX_AGE:
                continue
            link = safe_link(item.findtext("link", ""))
            cards.append({
                "id": "news-" + hashlib.sha256(link.encode()).hexdigest()[:16],
                "type": "news", "category": f"新闻 · {topic}", "icon": "▤", "kicker": "A HEADLINE TO EXPLORE",
                "title": title,
                "body": "一条来自中国新闻网的新闻标题。感兴趣的话，可以打开原文，看看事情的来龙去脉。",
                "note": "标题来自新闻订阅，正文与后续进展以原报道为准。",
                "sourceName": "中国新闻网", "sourceUrl": link,
                "publishedAt": published.isoformat(),
            })
        except (TypeError, ValueError, OverflowError):
            continue
    return sorted(cards, key=lambda card: card["publishedAt"], reverse=True)[:6]


def fetch_feed(pair, now):
    topic, url = pair
    request = urllib.request.Request(url, headers={"User-Agent": "DailyFeeder/1.0 (+https://github.com/Vic-Song/daily-feeder)"})
    with urllib.request.urlopen(request, timeout=25) as response:
        payload = response.read(2_000_001)
        if len(payload) > 2_000_000:
            raise ValueError("Feed too large")
    return topic, parse_feed(payload, topic, now)


def main():
    now = datetime.now(timezone.utc)
    cards, failures, topics = [], [], []
    with ThreadPoolExecutor(max_workers=3) as pool:
        tasks = {topic: pool.submit(fetch_feed, (topic, url), now) for topic, url in FEEDS.items()}
        for topic, task in tasks.items():
            try:
                _, items = task.result()
                cards.extend(items)
                topics.append(topic)
            except Exception as error:
                failures.append(topic)
                print(f"{topic}: {type(error).__name__}", file=sys.stderr)
    if not cards:
        raise SystemExit("No recent headlines retrieved; keeping previous news file unchanged.")
    # Deduplicate by URL; never retain an old headline just to pad the result.
    cards = list({card["sourceUrl"]: card for card in cards}.values())
    cards.sort(key=lambda card: card["publishedAt"], reverse=True)
    result = {"version": 1, "generatedAt": now.isoformat(), "source": "中国新闻网官方 RSS", "topics": topics, "failedTopics": failures, "items": cards}
    OUTPUT.parent.mkdir(exist_ok=True)
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Saved {len(cards)} dated headlines ({len(topics)} feeds).")


if __name__ == "__main__":
    main()
