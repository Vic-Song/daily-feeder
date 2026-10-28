(() => {
  "use strict";
  const KEY = "daily-feeder-journal-v1";
  const LIMIT = 5000;
  const PAGE_SIZE = 5;
  const $ = (id) => document.getElementById(id);
  const input = $("note-text");
  const formatter = new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  let editing = null;
  let original = "";
  let showTrash = false;
  let visible = PAGE_SIZE;

  function status(message) { $("note-status").textContent = message; }
  function validate(data) {
    if (data?.version !== 1 || !Array.isArray(data.entries) || data.entries.length > 10000) throw new Error("Invalid backup");
    const ids = new Set();
    for (const entry of data.entries) {
      if (!entry || typeof entry.id !== "string" || !entry.id || ids.has(entry.id)
        || typeof entry.text !== "string" || !entry.text.trim() || entry.text.length > LIMIT
        || typeof entry.createdAt !== "string" || typeof entry.updatedAt !== "string"
        || !Number.isFinite(Date.parse(entry.createdAt)) || !Number.isFinite(Date.parse(entry.updatedAt))
        || (entry.deletedAt !== null && (typeof entry.deletedAt !== "string" || !Number.isFinite(Date.parse(entry.deletedAt))))) throw new Error("Invalid entry");
      ids.add(entry.id);
    }
    return data;
  }
  function read() {
    const raw = localStorage.getItem(KEY);
    return raw === null ? { version: 1, entries: [] } : validate(JSON.parse(raw));
  }
  function write(store) {
    validate(store);
    localStorage.setItem(KEY, JSON.stringify(store));
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function resetEditor() {
    editing = null;
    original = "";
    input.value = "";
    $("note-save").textContent = "保存记录";
    $("note-label").textContent = "写给自己的一小段话";
    $("note-cancel").hidden = true;
    counter();
  }
  function counter() { $("note-counter").textContent = `${input.value.length} / ${LIMIT}`; }
  function action(label, handler) {
    const button = element("button", "note-secondary", label);
    button.type = "button";
    button.addEventListener("click", handler);
    return button;
  }
  function mutate(id, update) {
    try {
      const store = read();
      const entry = store.entries.find((item) => item.id === id);
      if (!entry) { status("这条记录已经不在当前浏览器中了。"); return; }
      update(entry);
      entry.updatedAt = new Date().toISOString();
      write(store);
      render();
      return true;
    } catch { status("没能保存更改，原记录仍然保留。请检查浏览器存储空间或先导出备份。"); }
    return false;
  }
  function edit(entry) {
    if (input.value.trim() && input.value !== original) {
      status("输入框里还有没保存的内容，请先保存，再编辑历史记录。");
      input.focus();
      return;
    }
    editing = entry.id;
    original = entry.text;
    input.value = entry.text;
    $("note-label").textContent = `正在修改 ${formatter.format(new Date(entry.createdAt))} 的记录`;
    $("note-save").textContent = "保存修改";
    $("note-cancel").hidden = false;
    counter();
    status("修改后点“保存修改”，原来的记录时间会保留。");
    input.focus();
  }
  function render() {
    try {
      const store = read();
      const query = $("note-search").value.trim().toLocaleLowerCase();
      const active = store.entries.filter((entry) => !entry.deletedAt);
      $("note-count").textContent = `${active.length} 条`;
      const entries = store.entries.filter((entry) => Boolean(entry.deletedAt) === showTrash && entry.text.toLocaleLowerCase().includes(query))
        .sort((a, b) => Date.parse(showTrash ? b.deletedAt : b.createdAt) - Date.parse(showTrash ? a.deletedAt : a.createdAt));
      const list = $("note-list");
      list.replaceChildren();
      if (!entries.length) list.append(element("p", "note-empty", query ? "暂时没找到这段内容，换个词试试。" : showTrash ? "这里还没有删除的记录。" : "还没有记录，今天就从一句话开始吧。"));
      for (const entry of entries.slice(0, visible)) {
        const card = element("article", "note-entry");
        const time = element("time", "note-entry-date", formatter.format(new Date(entry.createdAt)));
        time.dateTime = entry.createdAt;
        card.append(time, element("p", "note-entry-text", entry.text));
        const footer = element("div", "note-entry-footer");
        footer.append(element("span", "note-edited", entry.deletedAt ? "已移到最近删除，可随时恢复" : entry.updatedAt !== entry.createdAt ? "已编辑" : "留给自己的一小段时光"));
        const actions = element("div", "note-entry-actions");
        if (showTrash) actions.append(action("恢复记录", () => { if (mutate(entry.id, (item) => { item.deletedAt = null; })) status("已恢复，可以在“我的记录”里找到它。"); }));
        else {
          actions.append(action("编辑", () => edit(entry)), action("删除", () => {
            if (mutate(entry.id, (item) => { item.deletedAt = new Date().toISOString(); })) {
              if (editing === entry.id) { editing = null; original = ""; $("note-save").textContent = "保存记录"; $("note-cancel").hidden = true; $("note-label").textContent = "写给自己的一小段话"; }
              status("已移到“最近删除”，需要时可以恢复。");
            }
          }));
        }
        footer.append(actions);
        card.append(footer);
        list.append(card);
      }
      $("note-more").hidden = entries.length <= visible;
      $("notes-active").setAttribute("aria-pressed", String(!showTrash));
      $("notes-trash").setAttribute("aria-pressed", String(showTrash));
      $("note-export").disabled = false;
      $("note-save").disabled = false;
    } catch {
      $("note-list").replaceChildren(element("p", "note-empty", "暂时无法读取记录。为保护已有内容，请先导出备份，再检查浏览器存储设置。"));
      $("note-save").disabled = true;
      $("note-more").hidden = true;
      status("记录存储暂时不可用，输入的文字还没有保存。");
    }
  }

  $("note-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text || text.length > LIMIT) { status("写一点内容再保存吧，最多 5000 字。"); return; }
    try {
      const store = read();
      const now = new Date().toISOString();
      if (editing) {
        const entry = store.entries.find((item) => item.id === editing && !item.deletedAt);
        if (!entry || entry.text !== original) { status("这条记录在其他页面发生了变化。请先复制当前文字，再重新打开该记录。"); return; }
        entry.text = text;
        entry.updatedAt = now;
      } else store.entries.push({ id: crypto.randomUUID(), text, createdAt: now, updatedAt: now, deletedAt: null });
      write(store);
      resetEditor();
      showTrash = false;
      visible = PAGE_SIZE;
      $("note-search").value = "";
      $("note-history").open = true;
      render();
      status("已保存在当前浏览器里，可以在下面翻看。");
    } catch { status("这次没能保存，文字还在输入框里。请检查浏览器存储空间，或先复制文字留底。"); }
  });
  input.addEventListener("input", counter);
  $("note-cancel").addEventListener("click", () => { resetEditor(); status("已退出编辑，保存过的记录没有改变。"); });
  $("note-search").addEventListener("input", () => { visible = PAGE_SIZE; render(); });
  $("note-more").addEventListener("click", () => { visible += PAGE_SIZE; render(); });
  $("notes-active").addEventListener("click", () => { showTrash = false; visible = PAGE_SIZE; render(); });
  $("notes-trash").addEventListener("click", () => { showTrash = true; visible = PAGE_SIZE; render(); });
  $("note-export").addEventListener("click", () => {
    try {
      // Preserve the original bytes even if storage is corrupt, so no content is silently discarded.
      const raw = localStorage.getItem(KEY) ?? JSON.stringify({version:1,entries:[]});
      const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      const parts = formatter.formatToParts(new Date());
      const part = (type) => parts.find((item) => item.type === type).value.padStart(2, "0");
      link.download = `小小投喂-记录备份-${part("year")}-${part("month")}-${part("day")}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status("已生成备份文件，包含我的记录和最近删除。记得妥善保存下载的文件。");
    } catch { status("暂时无法导出，请先复制重要记录留底。"); }
  });
  $("note-import").addEventListener("click", () => $("note-file").click());
  $("note-file").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("Large file");
      const incoming = validate(JSON.parse(await file.text()));
      const store = read();
      const merged = new Map(store.entries.map((entry) => [entry.id, entry]));
      for (const entry of incoming.entries) {
        const existing = merged.get(entry.id);
        if (!existing || Date.parse(entry.updatedAt) > Date.parse(existing.updatedAt)) merged.set(entry.id, entry);
      }
      write({version:1,entries:[...merged.values()]});
      render();
      status("备份已合并，同一条记录保留更新时间较新的版本。");
    } catch { status("没能导入。请选择本站导出的 JSON 备份（不超过 5 MB），并确认浏览器存储可用；现有记录没有改变。"); }
    event.target.value = "";
  });
  window.addEventListener("storage", (event) => { if (event.key === KEY || event.key === null) render(); });
  window.addEventListener("beforeunload", (event) => {
    if (input.value.trim() && input.value !== original) { event.preventDefault(); event.returnValue = ""; }
  });
  render();
})();
