(function () {
  "use strict";
  function boot() {
    var toc = document.querySelector("#page-panel .toc-container");
    if (!toc) return;
    var config = window.DG_TOC_SETTINGS || {};
    function number(key, fallback, min, max) {
      var value = Number(config[key]);
      return Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
    }
    // Garden defaults live on body, so root variables would be shadowed.
    var root = document.body.style;
    root.setProperty("--dg-toc-buffer", number("buffer", 20, 0, 80) + "px");
    root.setProperty("--dg-toc-font-size", number("fontSize", 15, 10, 28) + "px");
    root.setProperty("--dg-toc-line-height", number("lineHeight", 1.5, 1, 2.5));
    root.setProperty("--dg-toc-item-padding", number("itemSpacing", 5, 0, 20) + "px 0");
    root.setProperty("--dg-toc-indent", number("indent", 14, 0, 40) + "px");
    root.setProperty("--dg-toc-max-height", number("maxHeight", 70, 20, 90) + "vh");
    var panel = document.getElementById("page-panel");
    panel.classList.add("dg-toc-configured");
    panel.classList.toggle("dg-toc-hide-title", config.showTitle === false);
    panel.classList.toggle("dg-toc-no-highlight", config.highlightActive === false);
    var depth = Math.round(number("maxHeadingLevel", 6, 1, 6));
    toc.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var id;
      try { id = decodeURIComponent(link.hash.slice(1)); } catch (_) { return; }
      var heading = document.getElementById(id);
      if (!heading || !/^H[1-6]$/.test(heading.tagName)) return;
      // Hide the link, not its list item: nested shallower headings stay reachable.
      link.hidden = Number(heading.tagName.slice(1)) > depth;
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
