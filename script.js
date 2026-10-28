const cards = [
  { category: "3D 打印灵感", icon: "⌂", kicker: "MAKE SOMETHING TINY", title: "给一只迷路的耳机做个小房子", body: "它可以长什么样？是太空舱、蘑菇屋，还是一只张着嘴的小怪兽？今天的设计任务：让它看起来像是自己选了这个家。", note: "小东西，也值得有自己的家。" },
  { category: "编程脑洞", icon: "⌘", kicker: "A TINY CODING QUEST", title: "给机器人三个新指令", body: "如果机器人只能听懂三个指令，你会用哪三个，让它从教室门口走到讲台？可以认真设计，也可以让它一路跳着过去。", note: "答案不止一种，最好玩的那种也算。" },
  { category: "喜剧脑洞", icon: "☻", kicker: "IMAGINE THE SCENE", title: "如果观众席里坐着一只猫", body: "它全程面无表情，只有某个包袱讲完后轻轻“喵”了一声。你觉得哪种笑点能让它终于破功？", note: "祝现场的猫观众笑出声。" },
  { category: "足球小选择", icon: "⚽", kicker: "ONE QUICK QUESTION", title: "只能重看一场经典比赛", body: "你会选一场内马尔的，还是一场 C 罗的？我大概会先挑一场 C 罗的关键战，再假装自己没有犹豫过。", note: "支持谁不重要，回忆最重要。" },
  { category: "随手一问", icon: "☼", kicker: "A LITTLE DAYDREAM", title: "如果周末突然多出一天", body: "没有待办、没有闹钟，也不用赶路。你会想把这一天花在一个地方、一件小事，还是完全交给临时起意？", note: "不用计划得很完美。" },
  { category: "3D 打印灵感", icon: "✿", kicker: "MAKE SOMETHING TINY", title: "设计一个会提醒人喝水的小物件", body: "不用电子屏幕，也不需要发出声音。它可以用什么可爱又不烦人的方式，告诉人：“嘿，喝一口水吧。”", note: "最好看一眼就会心情变好。" },
  { category: "编程脑洞", icon: "✦", kicker: "A TINY CODING QUEST", title: "给教室里的东西写个程序", body: "今天选一个普通物件：粉笔、书包、窗帘都可以。给它写一段程序，让它在一个意想不到的时刻做一件有用的事。", note: "程序员的脑洞不限于屏幕。" },
  { category: "喜剧脑洞", icon: "♫", kicker: "IMAGINE THE SCENE", title: "一场演出突然多了个旁白", body: "旁白只能说出大家心里没说出来的话，而且每次都要晚半拍。这个设定会让场面更好笑，还是更混乱？", note: "混乱也是一种喜剧节奏。" },
  { category: "足球小选择", icon: "⚡", kicker: "ONE QUICK QUESTION", title: "进球庆祝只能选一种", body: "是冲向角旗区、和队友抱成一团，还是做一个一眼就能认出的个人庆祝动作？你最喜欢哪种？", note: "这一题没有 VAR。" },
  { category: "随手一问", icon: "☁", kicker: "A LITTLE DAYDREAM", title: "最近有什么小事让你笑了一下？", body: "可以是路上看到的，也可以是别人说的一句话。很小也没关系，有些好心情本来就不需要很大的理由。", note: "把那一秒钟的开心留一下。" },
  { category: "3D 打印灵感", icon: "☕", kicker: "MAKE SOMETHING TINY", title: "做一个专门收纳“再也找不到”的东西", body: "钥匙、发圈、转接头，或者那个总在桌面上消失的小零件。给它设计一个专属停泊位，最好还带一点点幽默。", note: "归位成功率：值得期待。" },
  { category: "编程脑洞", icon: "↗", kicker: "A TINY CODING QUEST", title: "让一只小恐龙过马路", body: "它怕红绿灯、喜欢捡树叶，还总是走神。你会怎么设计规则，既让它安全到对面，又不让它错过沿途的乐趣？", note: "可以先画流程图，也可以先画恐龙。" },
  { category: "喜剧脑洞", icon: "☕", kicker: "IMAGINE THE SCENE", title: "把普通的道歉说得像颁奖感言", body: "比如：“感谢大家给我这个机会，为我忘记带伞这件事郑重道歉……”你觉得接下来还可以感谢谁？", note: "最佳配角：天气预报。" },
  { category: "足球小选择", icon: "✧", kicker: "ONE QUICK QUESTION", title: "如果能去球场边看一次训练", body: "你最想近距离看球员练哪一项？盘带、任意球、射门，还是训练结束后大家放松聊天的样子？", note: "场边视角，一定很不一样。" },
  { category: "随手一问", icon: "☾", kicker: "A LITTLE DAYDREAM", title: "给今天选一个背景音乐", body: "它不用很宏大，只要能配得上今天的节奏。你会选轻快一点、安静一点，还是那种听起来像片尾字幕的歌？", note: "脑内播放也算。" },
  { category: "3D 打印灵感", icon: "⌘", kicker: "MAKE SOMETHING TINY", title: "把“今天有点累”做成一个小摆件", body: "它是什么颜色、什么形状？是软趴趴的小云，还是躺平的土豆？给它起个名字，说不定会成为桌面上的最佳同事。", note: "今天先允许自己当一颗土豆。" },
  { category: "编程脑洞", icon: "⌁", kicker: "A TINY CODING QUEST", title: "设计一个“今天运气不错”按钮", body: "按下之后，屏幕上会出现什么？一个小烟花、一句鼓励，还是一只跳出来送贴纸的机器人？想象一下它最可爱的反馈。", note: "好运可以从一个像素开始。" },
  { category: "喜剧脑洞", icon: "♟", kicker: "IMAGINE THE SCENE", title: "两个路人误以为自己在同一部戏里", body: "一个以为自己在悬疑片，一个以为自己在美食纪录片。你猜他们第一次认真对话，会聊到什么？", note: "越一本正经，越好笑。" },
  { category: "足球小选择", icon: "◉", kicker: "ONE QUICK QUESTION", title: "给你的球迷生涯配一个奖项", body: "最佳熬夜观赛奖、最会认球衣奖、情绪随比分波动奖……你觉得自己最该拿哪一个？", note: "终身成就奖也可以提名。" },
  { category: "随手一问", icon: "⌂", kicker: "A LITTLE DAYDREAM", title: "最近想学会的一件小事", body: "不一定要很厉害：做一道新菜、修好一个小东西、记住几句外语，或者把某个游戏玩明白。你会选什么？", note: "小小的新技能也很棒。" },
  { category: "3D 打印灵感", icon: "♧", kicker: "MAKE SOMETHING TINY", title: "做一枚“临时好心情”徽章", body: "不用写大道理，只要一个看了会微笑的小图案。你会选什么：歪歪的太阳、举手投降的小猫，还是一颗戴安全帽的草莓？", note: "可以把它别在最普通的一天上。" },
  { category: "编程脑洞", icon: "⌘", kicker: "A TINY CODING QUEST", title: "给迷路的像素小人画张地图", body: "地图上有一条安全路线、一条特别绕但风景很好的路，还有一条通向零食区的捷径。你会让它走哪条？", note: "路线规划也可以有私心。" },
  { category: "喜剧脑洞", icon: "☻", kicker: "IMAGINE THE SCENE", title: "如果椅子会给坐它的人打分", body: "它只根据坐姿和起身时的表情评分。什么样的人会得到满分？什么样的人会被它默默记在小本本上？", note: "椅子评委，公平但有点严格。" },
  { category: "足球小选择", icon: "⚽", kicker: "ONE QUICK QUESTION", title: "你会给球场边的自己带什么？", body: "只许带一样：围巾、零食、相机，还是一件球衣。选完以后，才发现旁边的人带了望远镜。", note: "重要的是坐在现场。" },
  { category: "随手一问", icon: "✿", kicker: "A LITTLE DAYDREAM", title: "如果给这个月起个小标题", body: "可以像电影名、书名，也可以像朋友圈里会发的那种短句。你会怎么命名最近这段时间？", note: "副标题可以留到下个月再想。" },
  { category: "3D 打印灵感", icon: "⌁", kicker: "MAKE SOMETHING TINY", title: "给桌面做一个迷你“休息区”", body: "小摆件累了也要休息。可以有躺椅、小毯子，甚至一杯看起来喝不完的迷你奶茶。你会把它放在桌面的哪个角落？", note: "桌面小世界，暂停营业五分钟。" },
  { category: "编程脑洞", icon: "✦", kicker: "A TINY CODING QUEST", title: "想一个只在下雨天启动的程序", body: "它可以做什么，让下雨天多一点点乐趣？整理歌单、推荐窗边小活动，还是统计今天见到了几把彩色雨伞？", note: "天气是输入，心情可以是输出。" },
  { category: "喜剧脑洞", icon: "♫", kicker: "IMAGINE THE SCENE", title: "把“我马上到”变成一场舞台剧", body: "主角还在找钥匙，配角已经开始念旁白，手机导航则扮演一位不太可靠的预言家。第一幕的标题会是什么？", note: "真实事件改编，但可以不承认。" },
  { category: "足球小选择", icon: "⚡", kicker: "ONE QUICK QUESTION", title: "给球员设计一个新庆祝动作", body: "动作要简单到小朋友也能学会，又不能和现有的太像。你会让它像什么？一只飞鸟、一段舞步，还是一个迷你 3D 打印道具？", note: "创意庆祝，版权归你的想象力。" },
  { category: "随手一问", icon: "☼", kicker: "A LITTLE DAYDREAM", title: "给忙碌的一天留一个小小暂停", body: "三分钟也好：看看窗外、喝口水、听一首歌，或者什么都不做。你最喜欢哪一种短暂的重启方式？", note: "暂停不是偷懒，是给自己一点空间。" },
];

const dateEl = document.querySelector("#today-date");
const dayEl = document.querySelector("#card-number");
const cardEl = document.querySelector("#daily-card");
let currentIndex = -1;
let activeDate = "";
let drawing = false;
const notePapers = ["#fff1b8", "#e5edd5", "#f8e0d7", "#e1edf1", "#f5e9cd"];

// A stable shuffled deck gives every card a turn before the daily cycle repeats.
const dailyDeck = cards.map((_, index) => index);
let shuffleSeed = 20261028;
for (let index = dailyDeck.length - 1; index > 0; index -= 1) {
  shuffleSeed = (Math.imul(shuffleSeed, 1664525) + 1013904223) >>> 0;
  const swapIndex = shuffleSeed % (index + 1);
  [dailyDeck[index], dailyDeck[swapIndex]] = [dailyDeck[swapIndex], dailyDeck[index]];
}

function dateStamp(date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type).value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function dailyIndex(date) {
  const [year, month, day] = dateStamp(date).split("-").map(Number);
  const localDay = Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  return dailyDeck[((localDay % dailyDeck.length) + dailyDeck.length) % dailyDeck.length];
}

function renderCard(index) {
  const card = cards[index];
  currentIndex = index;
  document.querySelector("#card-category").textContent = card.category;
  document.querySelector("#card-icon").textContent = card.icon;
  document.querySelector("#card-kicker").textContent = card.kicker;
  document.querySelector("#card-title").textContent = card.title;
  document.querySelector("#card-body").textContent = card.body;
  document.querySelector("#card-footnote").textContent = card.note;
  dayEl.textContent = `NO. ${String(index + 1).padStart(2, "0")}`;
  cardEl.style.setProperty("--note-paper", notePapers[index % notePapers.length]);
}

function refreshDailyCard() {
  const today = new Date();
  const stamp = dateStamp(today);
  if (stamp === activeDate) return;
  activeDate = stamp;
  dateEl.dateTime = stamp;
  dateEl.textContent = new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", month: "long", day: "numeric", weekday: "short" }).format(today);
  renderCard(dailyIndex(today));
}

refreshDailyCard();
window.addEventListener("pageshow", refreshDailyCard);
setInterval(refreshDailyCard, 60000);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) refreshDailyCard();
});

document.querySelector("#draw-again").addEventListener("click", async (event) => {
  if (drawing) return;
  drawing = true;
  let nextIndex = Math.floor(Math.random() * (cards.length - 1));
  if (nextIndex >= currentIndex) nextIndex += 1;
  const button = event.currentTarget;
  button.disabled = true;
  cardEl.setAttribute("aria-busy", "true");
  button.classList.remove("is-spinning");
  void button.offsetWidth;
  button.classList.add("is-spinning");
  let exit;
  let enter;
  let changed = false;
  try {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && typeof cardEl.animate === "function") {
      exit = cardEl.animate([
        { transform: "rotateX(0deg) rotateZ(0deg) translateY(0)", opacity: 1 },
        { transform: "rotateX(18deg) rotateZ(-6deg) translateY(-38px)", opacity: 0 },
      ], { duration: 210, easing: "cubic-bezier(.45,0,.8,.6)", fill: "forwards" });
      await exit.finished;
      renderCard(nextIndex);
      changed = true;
      enter = cardEl.animate([
        { transform: "rotateX(-14deg) rotateZ(4deg) translateY(24px)", opacity: 0 },
        { transform: "rotateX(0deg) rotateZ(-.6deg) translateY(-3px)", opacity: 1, offset: .8 },
        { transform: "rotateX(0deg) rotateZ(0deg) translateY(0)", opacity: 1 },
      ], { duration: 360, easing: "cubic-bezier(.2,.7,.3,1)" });
      exit.cancel();
      await enter.finished;
    } else { renderCard(nextIndex); changed = true; }
  } catch {
    // A cancelled animation must still leave a usable, newly drawn card.
    if (!changed) renderCard(nextIndex);
  } finally {
    exit?.cancel();
    enter?.cancel();
    cardEl.setAttribute("aria-busy", "false");
    button.disabled = false;
    button.classList.remove("is-spinning");
    drawing = false;
  }
});
