(() => {
  "use strict";

  const TIME_ZONE = "Asia/Shanghai";
  const CACHE_KEY = "daily-feeder-langfang-weather-v1";
  const REFRESH_MS = 30 * 60 * 1000;
  const MAX_AGE_MS = 3 * 60 * 60 * 1000;
  const params = new URLSearchParams({
    latitude: "39.52079",
    longitude: "116.71471",
    current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,wind_speed_10m_max",
    timezone: TIME_ZONE,
    forecast_days: "1",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
  });
  const API_URL = `https://api.open-meteo.com/v1/forecast?${params}`;
  const $ = (id) => document.getElementById(id);
  const refreshButton = $("weather-refresh");
  const clockFormatter = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  const dateFormatter = new Intl.DateTimeFormat("zh-CN", { timeZone: TIME_ZONE, year: "numeric", month: "long", day: "numeric", weekday: "long" });
  const dateKeyFormatter = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
  let weatherRecord = null;
  let busy = false;

  function beijingDate(date = new Date()) {
    const parts = dateKeyFormatter.formatToParts(date);
    const value = (type) => parts.find((part) => part.type === type).value;
    return `${value("year")}-${value("month")}-${value("day")}`;
  }

  function updateClock() {
    const now = new Date();
    const [hours, minutes, seconds] = clockFormatter.format(now).split(":");
    $("full-date").textContent = dateFormatter.format(now);
    const clock = $("live-clock");
    // Separate seconds visually without announcing every tick to screen readers.
    if (!clock.firstChild || clock.firstChild.nodeType !== 3) {
      clock.replaceChildren(document.createTextNode(""), document.createElement("span"));
    }
    clock.firstChild.textContent = `${hours}:${minutes}`;
    clock.lastChild.textContent = `:${seconds}`;
    clock.dateTime = now.toISOString();
    clock.setAttribute("aria-label", `北京时间 ${hours}点${minutes}分`);
  }

  const weatherLabels = {
    0: "晴", 1: "晴间少云", 2: "多云", 3: "阴", 45: "雾", 48: "雾凇",
    51: "小毛毛雨", 53: "毛毛雨", 55: "较强毛毛雨", 56: "冻毛毛雨", 57: "较强冻毛毛雨",
    61: "小雨", 63: "中雨", 65: "大雨", 66: "冻雨", 67: "较强冻雨",
    71: "小雪", 73: "中雪", 75: "大雪", 77: "米雪", 80: "小阵雨", 81: "阵雨", 82: "强阵雨",
    85: "阵雪", 86: "较强阵雪", 95: "雷雨", 96: "雷雨伴冰雹", 97: "强雷雨", 99: "强雷雨伴冰雹",
  };
  const snowCodes = new Set([71, 73, 75, 77, 85, 86]);
  const rainCodes = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 97, 99]);
  const number = (value) => typeof value === "number" && Number.isFinite(value);

  function weatherIcon(code, isDay) {
    if (snowCodes.has(code)) return "❄";
    if (code >= 95) return "ϟ";
    if (rainCodes.has(code)) return "☂";
    if (code === 45 || code === 48) return "≋";
    if (code === 0 || code === 1) return isDay === 0 ? "☾" : "☀";
    return "☁";
  }

  function clothingAdvice(current, daily) {
    const felt = number(current.apparent_temperature) ? current.apparent_temperature : current.temperature_2m;
    let clothes;
    if (felt <= 0) clothes = "体感偏冷，穿厚羽绒服或保暖棉服，配上围巾和保暖内搭。";
    else if (felt <= 8) clothes = "穿厚外套搭配针织衫或卫衣，长裤和包脚的鞋会更舒服。";
    else if (felt <= 16) clothes = "毛衣或卫衣外搭一件外套，出门穿长裤会比较合适。";
    else if (felt <= 23) clothes = "长袖搭配薄外套刚刚好，进室内热了也方便脱下来。";
    else if (felt < 28) clothes = "可以选轻薄长袖或短袖，怕空调冷的话带件薄开衫。";
    else clothes = "选透气轻薄的短袖和宽松下装，户外可以戴顶遮阳帽。";

    const low = daily.temperature_2m_min[0];
    const high = daily.temperature_2m_max[0];
    if (high - low >= 8) clothes += "早晚温差比较大，分层穿更方便。";
    else if (low < 8 && felt > 8) clothes += "早晚会更凉，晚归记得多带一件。";

    const dayCode = daily.weather_code?.[0];
    if (snowCodes.has(current.weather_code) || snowCodes.has(dayCode)) clothes += "有雨雪时选防滑的鞋，外层尽量防水。";
    else if (rainCodes.has(current.weather_code) || rainCodes.has(dayCode) || daily.precipitation_probability_max?.[0] >= 50) clothes += "今天记得带把伞，鞋子尽量选不怕湿的。";

    const winds = [current.wind_speed_10m, daily.wind_speed_10m_max?.[0]].filter(number);
    if (winds.length && Math.max(...winds) >= 25) clothes += "风比较大，外层可以选防风款。";
    return clothes;
  }

  function validWeather(data) {
    const current = data?.current;
    const daily = data?.daily;
    const stamp = current?.time;
    if (typeof stamp !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(stamp)) return false;
    const weatherTime = Date.parse(`${stamp}+08:00`);
    const age = Date.now() - weatherTime;
    return number(current.temperature_2m) && number(current.weather_code)
      && daily?.time?.[0] === beijingDate() && stamp.slice(0, 10) === beijingDate()
      && number(daily.temperature_2m_min?.[0]) && number(daily.temperature_2m_max?.[0])
      && daily.temperature_2m_min[0] <= daily.temperature_2m_max[0]
      && Number.isFinite(weatherTime) && age >= -30 * 60 * 1000 && age <= MAX_AGE_MS;
  }

  function usableRecord(record) {
    return record && number(record.savedAt) && Date.now() >= record.savedAt
      && Date.now() - record.savedAt <= MAX_AGE_MS && validWeather(record.data);
  }

  function renderWeather(record, note = "预报估算") {
    const { current, daily } = record.data;
    $("weather-symbol").textContent = weatherIcon(current.weather_code, current.is_day);
    $("weather-temp").textContent = `${Math.round(current.temperature_2m)}°`;
    const apparent = number(current.apparent_temperature) ? ` · 体感 ${Math.round(current.apparent_temperature)}°` : "";
    $("weather-summary").textContent = `${weatherLabels[current.weather_code] || "天气信息"}${apparent}`;
    const details = [`今日 ${Math.round(daily.temperature_2m_min[0])}–${Math.round(daily.temperature_2m_max[0])}°C`];
    if (number(daily.precipitation_probability_max?.[0])) details.push(`降水 ${Math.round(daily.precipitation_probability_max[0])}%`);
    $("weather-details").textContent = details.join(" · ");
    $("outfit-advice").textContent = clothingAdvice(current, daily);
    $("weather-status").textContent = `天气时间 ${current.time.slice(11, 16)} · ${note}`;
  }

  function renderUnavailable() {
    $("weather-symbol").textContent = "☁";
    $("weather-temp").textContent = "--°";
    $("weather-summary").textContent = "天气暂时没连上";
    $("weather-details").textContent = "可以稍后点一下刷新";
    $("outfit-advice").textContent = "暂时没拿到天气，出门前记得再看一眼预报。";
    $("weather-status").textContent = "天气获取失败，抽卡照常进行";
  }

  async function loadWeather(force = false) {
    if (busy) return;
    if (!force && usableRecord(weatherRecord) && Date.now() - weatherRecord.savedAt < REFRESH_MS) return;
    busy = true;
    refreshButton.disabled = true;
    if (!usableRecord(weatherRecord)) {
      $("weather-symbol").textContent = "☁";
      $("weather-temp").textContent = "--°";
      $("weather-summary").textContent = "正在看看廊坊的天空…";
      $("weather-details").textContent = "天气加载中";
      $("outfit-advice").textContent = "等天气到了，再帮你看看今天适合怎么穿。";
    }
    $("weather-status").textContent = "正在更新天气…";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(API_URL, { signal: controller.signal, credentials: "omit", cache: "no-store" });
      if (!response.ok) throw new Error(`Weather response ${response.status}`);
      const data = await response.json();
      if (!validWeather(data)) throw new Error("Weather data is incomplete or outdated");
      weatherRecord = { savedAt: Date.now(), data };
      renderWeather(weatherRecord);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(weatherRecord)); } catch { /* Storage is optional. */ }
    } catch {
      if (usableRecord(weatherRecord)) renderWeather(weatherRecord, "上次数据，刷新未成功");
      else renderUnavailable();
    } finally {
      clearTimeout(timeout);
      refreshButton.disabled = false;
      busy = false;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (usableRecord(cached)) {
      weatherRecord = cached;
      renderWeather(cached, "本地缓存");
    }
  } catch { /* Corrupt or unavailable storage must not interrupt the page. */ }
  loadWeather();
  refreshButton.addEventListener("click", () => loadWeather(true));
  setInterval(() => loadWeather(), REFRESH_MS);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) { updateClock(); loadWeather(); }
  });
  window.addEventListener("pageshow", () => { updateClock(); loadWeather(); });
})();
