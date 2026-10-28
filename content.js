// Short, paraphrased facts with primary sources, plus original fictional jokes.
(() => {
  const venus = ["NASA · 金星", "https://science.nasa.gov/venus/venus-facts/"];
  const moon = ["NASA · 月球", "https://science.nasa.gov/moon/facts/"];
  const octopus = ["伦敦自然历史博物馆", "https://www.nhm.ac.uk/discover/octopuses-keep-surprising-us-here-are-eight-examples-how.html"];
  const printing = ["NIST · 增材制造", "https://www.nist.gov/additive-manufacturing/what-additive-manufacturing"];
  const webb = ["NASA · 韦伯望远镜", "https://science.nasa.gov/mission/webb/faqs-full/"];
  const web = ["CERN · 万维网历史", "https://home.cern/science/computing/the-birth-of-the-web"];
  const fact = (title, body, source, icon = "✧") => ({ type: "knowledge", category: "小知识 · 冷知识", icon, kicker: "SOMETHING WORTH KNOWING", title, body, note: "换个角度，看一眼这个世界。", sourceName: source[0], sourceUrl: source[1] });
  const history = (eventDate, title, body, source) => ({ type: "history", category: "旧闻回看", icon: "◷", kicker: "A PAGE FROM THE PAST", title, body, eventDate, note: "这是过去发生的事，不是今天的新闻。", sourceName: source[0], sourceUrl: source[1] });
  const joke = (title, body) => ({ type: "joke", category: "冷笑话", icon: "☻", kicker: "A VERY SMALL JOKE", title, body, note: "本站原创虚构段子，冷到的话请加件外套。", sourceName: "本站原创 · 虚构段子" });
  window.FEED_CARDS = [
    fact("金星自转一圈，比绕太阳一圈还久", "金星自转一圈约需 243 个地球日，绕太阳一圈约需 225 个地球日。这里比的是自转周期，不是日出到下一次日出的时间。", venus, "☀"),
    fact("在金星上，太阳会从西边升起", "金星的自转方向与地球相反，因此从金星表面看，太阳会西升东落。熟悉的日出方向，也有别的版本。", venus, "↔"),
    fact("太阳系最热的行星，并不是离太阳最近的那颗", "金星比水星更热。它浓厚的大气产生强烈的温室效应，把热量留在表面。距离太阳近，并不是唯一因素。", venus, "☀"),
    fact("月球不是不转，而是转得刚刚好", "月球自转与绕地球公转的周期相同，这叫同步自转。所以从地球看过去，主要总是同一面朝着我们。", moon, "☾"),
    fact("月球背面，并不一直是黑夜", "“背面”指背向地球的一面，不是永远照不到太阳的一面。新月时，我们看见的一面较暗，背面反而正受阳光照亮。", moon, "◐"),
    fact("章鱼的三颗心，分工很明确", "两颗心脏把血液送到鳃，另一颗把血液输送到全身。不是为了装下三倍心事，而是为了完成不同的循环任务。", octopus, "♡"),
    fact("章鱼的血液为什么是蓝色的？", "它们运输氧气的血蓝蛋白含铜，而人类的血红蛋白含铁。氧合后的血蓝蛋白呈蓝色，背后是不同的化学方案。", octopus, "≈"),
    fact("Python 的名字，先来自喜剧", "Guido van Rossum 给语言取名时，正在读英国喜剧《Monty Python’s Flying Circus》的剧本。程序员和喜剧，原来早就有交集。", ["Python 官方 FAQ", "https://docs.python.org/3/faq/general.html#why-is-it-called-python"], "⌘"),
    fact("3D 打印为什么也叫增材制造？", "它通常按数字设计，把材料一层层加上去形成物体；与切掉多余材料的加工思路不同。“加出来”和“削出来”，都能做成立体。", printing, "▱"),
    fact("3D 打印的材料，不只有塑料", "增材制造也会使用金属和陶瓷等材料。不同工艺可以处理粉末、丝材等原料，并不是所有打印机都靠一卷塑料丝工作。", printing, "⌂"),
    fact("韦伯望远镜有一把网球场大小的“遮阳伞”", "它展开的遮阳板大约有一块网球场那么大。遮住太阳的热量，能帮助望远镜保持低温，完成红外观测。", webb, "☂"),
    fact("光年听起来像时间，其实是距离", "一光年是光在一年中走过的距离，约 9.46 万亿公里。看向很远的宇宙，也是在接收很久以前出发的光。", webb, "✦"),
    history("1989", "万维网最初，是为了让科学家更容易分享信息", "Tim Berners-Lee 在 CERN 工作时提出万维网。这个后来进入日常生活的工具，最早想解决的是研究人员之间的信息共享。", web),
    history("1993-04-30", "一次开放，让网页走得更远", "CERN 在这一天把万维网软件放入公有领域，之后又提供开放许可版本。网页能够普及，与这样的开放决定有关。", web),
    history("1978", "熟悉的 LEGO 小人，已经走过很多年", "LEGO 官方历史记载，LEGO minifigure 于 1978 年推出。今天看起来理所当然的小角色，也有自己的出场年份。", ["LEGO 官方历史", "https://www.lego.com/en-gb/history/articles/f-role-play"]),
    history("1930", "第一届世界杯，只有 13 支参赛队", "首届世界杯在乌拉圭举行，13 支球队参加。最终，东道主在决赛中以 4 比 2 战胜阿根廷夺冠。", ["FIFA · 1930 世界杯", "https://www.fifa.com/en/tournaments/mens/worldcup/articles/1930-world-cup-quiz"]),
    history("1969-07-20 · UTC", "第一次载人月面着陆的那个日期", "按 UTC 日期，阿波罗 11 号于 1969 年 7 月 20 日在月球着陆。换成北京时间，已经是 7 月 21 日；读历史也要留意时区。", ["NASA · 阿波罗 11 号", "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11info.html"]),
    history("1977", "旅行者号的长途旅程，从 1977 年开始", "旅行者 2 号于 8 月 20 日发射，旅行者 1 号则在 9 月 5 日发射。名字里的序号，并不等于发射先后。", ["NASA · 旅行者号发射回顾", "https://www.nasa.gov/news-release/pioneering-nasa-spacecraft-mark-thirty-years-of-flight/"]),
    history("1990-04-24", "哈勃望远镜启程的那一天", "哈勃空间望远镜于 1990 年 4 月 24 日发射。那些常见的宇宙照片背后，是一台被送到地球大气层外的观测设备。", ["NASA · 哈勃历史", "https://history.nasa.gov/wp-content/uploads/static/history/hubble.html"]),
    history("2021-12-25", "韦伯望远镜在圣诞节出发", "韦伯空间望远镜于 2021 年 12 月 25 日发射。此后，它还要展开、冷却和调试，发射成功只是漫长准备过程中的一步。", webb),
    joke("打印机有自己的作息", "我问 3D 打印机：“还要多久？”\n它说：“别急，我已经把‘马上就好’打印出来了。”"),
    joke("循环的课堂用途", "小朋友问：“循环有什么用？”\n我说：“比如一直问为什么。”\n他问：“为什么？”\n我说：“你已经会了。”"),
    joke("球迷的智能闹钟", "我给闹钟写了条规则：只在重要的比赛前响。\n结果它每天都响。\n我忘了定义什么叫“不重要”。"),
    joke("纸巾盒的岗位说明", "纸巾盒来面试，问自己负责什么。\n我说：“不需要发言，关键时刻递一下。”\n它说：“那我很适合开会。”"),
    joke("电脑的周末计划", "我问电脑周末想干什么。\n它说：“想睡觉。”\n我说：“你不是天天休眠吗？”\n它说：“那只是待命。”"),
    joke("一只非常讲逻辑的小猫", "我给猫设计了一个自动投喂程序。\n条件：猫饿了。\n猫看完，建议把条件删掉。"),
    joke("最听话的机器人", "我让机器人“随便做点什么”。\n它认真执行了三个小时。\n最后交来一份《随便的定义》需求文档。"),
    joke("云的打印任务", "云买了台打印机，只会打印雨点。\n客服问：“有什么问题？”\n云说：“我想要横向排版，它一直竖着下。”"),
    joke("键盘的小情绪", "空格键说自己最近压力很大。\n我问为什么。\n它说：“大家都让我留点空间，可我明明一直在留。”"),
    joke("一个很克制的导航", "我问导航：“能不能走一条不堵的路？”\n它思考片刻，把目的地改成了厨房。"),
    joke("书签的职业理想", "书签说自己想升职。\n我问：“升到哪里？”\n它说：“下一页。这里我已经待了三个月。”"),
    joke("给文件起名字", "我把文件命名为“最终版”。\n电脑没有反对。\n它只是默默给我留出了“最终版2”的位置。"),
  ].map((card, index) => ({ ...card, id: `${card.type}-${index + 1}`, checkedAt: "2026-10-28" }));
})();
