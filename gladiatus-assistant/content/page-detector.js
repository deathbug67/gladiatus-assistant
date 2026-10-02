(() => {
  const title = document.title.toLowerCase();
  const text = document.body?.innerText?.toLowerCase() || "";

  function detectActivity() {
    if (/circus|turma/.test(title + " " + text)) return "circus";
    if (/dungeon/.test(title + " " + text)) return "dungeon";
    if (/expedition/.test(title + " " + text)) return "expedition";
    if (/arena/.test(title + " " + text)) return "arena";
    return "unknown";
  }

  window.postMessage({
    source: "gladiatus-assistant",
    type: "PAGE_ACTIVITY",
    activity: detectActivity(),
    url: location.href,
    title: document.title
  }, "*");
})();
