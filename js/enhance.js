/* ============================================================
   UTSAVA Celebration — 2026 micro-interactions & enhancements
   Scroll progress · animated count-up · cursor-reactive 3D tilt
   + spotlight · staggered reveal · back-to-top.
   Progressive enhancement only — guarded for reduced motion.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  /* ---- scroll progress bar ---- */
  function scrollProgress() {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("hashchange", () => setTimeout(update, 60));
  }

  /* ---- animated count-up for hero stats ---- */
  function countUp() {
    if (reduced) return;
    const targets = $$("#heroStats strong");
    if (!targets.length) return;
    const run = (el) => {
      const raw = el.textContent.trim();
      const m = raw.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
      if (!m) return;
      const end = parseFloat(m[1].replace(/,/g, ""));
      const suffix = m[2] || "";
      const decimals = (m[1].split(".")[1] || "").length;
      const dur = 1400; const start = performance.now();
      const fmt = (n) => (decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-IN"));
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = m[1] + suffix;
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) { targets.forEach(run); return; }
    const obs = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); }
    }), { threshold: 0.6 });
    targets.forEach((t) => obs.observe(t));
  }

  /* ---- cursor-reactive 3D tilt + spotlight glow ---- */
  const TILT_SEL = ".event-card, .venue-card, .service-card, .why-card, .how-card, .video-card, .reco-card, .gallery-item";
  function tiltAndSpotlight() {
    if (reduced || !fine) return;
    const bind = (card) => {
      if (card.__tilt) return; card.__tilt = true;
      card.classList.add("tilt3d");
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
        card.style.transform = "perspective(900px) rotateY(" + ((px - 0.5) * 8).toFixed(2) + "deg) rotateX(" + ((0.5 - py) * 8).toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    };
    const scan = () => $$(TILT_SEL).forEach(bind);
    scan();
    // re-scan when views/cards re-render
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ---- staggered reveal delay ---- */
  function stagger() {
    const groups = $$(".grid, .gallery, .video-grid, .hero-stats");
    groups.forEach((g) => $$(".reveal", g).forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 60, 360) + "ms";
    }));
  }

  /* ---- back-to-top ---- */
  function backToTop() {
    const btn = document.createElement("button");
    btn.className = "to-top"; btn.setAttribute("aria-label", "Back to top"); btn.innerHTML = "↑";
    document.body.appendChild(btn);
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));
    window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 600), { passive: true });
  }

  function init() {
    scrollProgress();
    countUp();
    stagger();
    tiltAndSpotlight();
    backToTop();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else setTimeout(init, 0);
})();
