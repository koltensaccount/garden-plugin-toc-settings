(function () {
  "use strict";
  function boot() {
    var toc = document.querySelector("#page-panel .toc-container");
    if (!toc) return;
    var config = window.DG_TOC_SETTINGS || {};
    var presets = {
      fontSize: { key: "textSize", values: { Small: 13, Medium: 15, Large: 18 } },
      buffer: { key: "noteSpacing", values: { Narrow: 10, Comfortable: 20, Wide: 36 } },
      itemSpacing: { key: "headingSpacing", values: { Compact: 2, Comfortable: 5, Spacious: 8 } },
      maxHeight: { key: "listHeight", values: { Short: 45, Medium: 70, Tall: 85 } }
    };
    Object.keys(presets).forEach(function (key) {
      var preset = presets[key];
      var value = preset.values[config[preset.key]];
      if (value !== undefined) config[key] = value;
    });
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
    var headings = [];
    toc.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var id;
      try { id = decodeURIComponent(link.hash.slice(1)); } catch (_) { return; }
      var heading = document.getElementById(id);
      if (!heading || !/^H[1-6]$/.test(heading.tagName)) return;
      headings.push({ link: link, level: Number(heading.tagName.slice(1)), target: heading });
    });
    var firstLevel = headings.length ? Math.min.apply(null, headings.map(function (heading) { return heading.level; })) : 1;
    var depth = config.detail === "Main headings" ? firstLevel : config.detail === "Main + subheadings" ? firstLevel + 1 : 6;
    headings.forEach(function (heading) {
      heading.link.hidden = heading.level > depth;
    });
    var visible = headings.filter(function (heading) { return !heading.link.hidden; });
    var queued = false;
    function updateActive() {
      queued = false;
      if (config.highlightActive === false || !visible.length) return;
      var current = visible[0];
      visible.forEach(function (heading) {
        if (heading.target.getBoundingClientRect().top <= 100) current = heading;
      });
      headings.forEach(function (heading) { heading.link.classList.toggle("toc-active", heading === current); });
    }
    function scheduleActive() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(updateActive);
    }
    window.addEventListener("scroll", scheduleActive, { passive: true });
    window.addEventListener("resize", scheduleActive, { passive: true });
    scheduleActive();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
