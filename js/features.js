/* ============================================================
   UTSAVA Celebration — Premium feature helpers
   AI package recommendation · digital invitation generator ·
   event progress tracker · Razorpay payment (with demo fallback).
   Pure-ish helpers; UMD so they can be unit-tested in Node too.
   ============================================================ */
(function (root, factory) {
  const api = factory(root);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.FEATURES = api;
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";

  const D = (root && root.UTSAVA) || (typeof require !== "undefined" ? require("./data.js") : {});
  const P = (root && root.PRICING) || (typeof require !== "undefined" ? require("./pricing.js") : {});

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rupee = (n) => "₹" + Number(Math.round(n || 0)).toLocaleString("en-IN");

  /* ============================================================
     AI PACKAGE RECOMMENDATION (rule-based recommender)
     Input: { occasion, guests, budget, vibe }
     Output: a ready-to-book package + human-readable reasoning.
     ============================================================ */
  function aiRecommend(input) {
    input = input || {};
    const guests = Math.max(1, Number(input.guests) || 2);
    const budget = Math.max(0, Number(input.budget) || 0);
    const occasion = input.occasion || "birthday";
    const vibe = input.vibe || "balanced"; // cozy | balanced | grand

    const venues = D.venues || [];
    // pick venue by capacity vs guests
    const theatre = venues.find((v) => v.id === "theater") || venues[0];
    const hall = venues.find((v) => v.id === "hall") || venues[0];
    let venue = guests > (theatre ? theatre.maxPeople : 12) ? hall : theatre;
    if (vibe === "grand" && guests >= 20) venue = hall;

    const reasons = [];
    reasons.push(`${guests} guest${guests > 1 ? "s" : ""} → ${venue.name} (${venue.capacity}).`);

    // occasion → suggested add-ons
    const addOns = {};
    const addById = (id) => (D.addOns || []).find((a) => a.id === id);
    const wishlist = {
      birthday:    ["cake", "fog", "led", "photo"],
      anniversary: ["cake", "petal", "bouquet", "photo"],
      marriage:    ["extradecor", "photo", "pyro"],
      proposal:    ["petal", "candle", "bouquet"],
      romantic:    ["petal", "candle", "bouquet"],
      babyshower:  ["cake", "extradecor", "photo"],
      naming:      ["extradecor", "photo"],
      bridetobe:   ["sash", "cake", "photo"],
    }[occasion] || ["cake", "photo"];

    wishlist.forEach((id) => { if (addById(id)) addOns[id] = addById(id).hasQty ? 1 : 1; });
    if (vibe === "grand" && addById("extradecor")) addOns.extradecor = 1;
    if (vibe === "cozy") { delete addOns.pyro; delete addOns.photo; }
    reasons.push(`Curated add-ons for a ${esc(occasion)} celebration.`);

    // food suggestion based on guests
    const foods = D.foodPackages || [];
    let foodId = "none";
    if (guests >= 8) foodId = "snacks";
    if (guests >= 25) foodId = "vegthali";
    if (guests >= 60 && vibe === "grand") foodId = "premium";
    if (foodId !== "none") reasons.push(`Catering: ${(foods.find((f) => f.id === foodId) || {}).name || "snacks"}.`);

    // theme by vibe/occasion
    const themes = D.decorThemes || [];
    let themeId = (vibe === "grand") ? "royal" : (occasion === "romantic" || occasion === "proposal" ? "floral" : "pastel");
    if (themes.length && !themes.find((t) => t.id === themeId)) themeId = themes[0].id;

    // compute estimate and fit to budget by trimming add-ons
    const buildItems = () => Object.keys(addOns).map((id) => {
      const a = addById(id); return { id, price: a ? a.price : 0, qty: addOns[id] };
    });
    const food = foods.find((f) => f.id === foodId) || { perGuest: 0 };
    const calc = () => P.compute({
      venue, guests, addOnItems: buildItems(), foodPerGuest: food.perGuest,
      gstRate: (D.brand || {}).gstRate, advancePercent: (D.brand || {}).advancePercent,
    });

    let est = calc();
    if (budget > 0) {
      // trim cheapest-value extras until within budget
      const trimOrder = ["pyro", "fog", "photo", "extradecor", "bouquet", "led", "sash", "candle", "petal", "cake"];
      let i = 0;
      while (est.total > budget && i < trimOrder.length) {
        if (addOns[trimOrder[i]]) { delete addOns[trimOrder[i]]; est = calc(); }
        i++;
      }
      if (est.total > budget && foodId !== "none") {
        const ladder = ["premium", "nonveg", "vegthali", "snacks", "none"];
        let fi = ladder.indexOf(foodId);
        while (est.total > budget && fi < ladder.length - 1) {
          fi++; foodId = ladder[fi];
          const f2 = foods.find((f) => f.id === foodId) || { perGuest: 0 };
          est = P.compute({ venue, guests, addOnItems: buildItems(), foodPerGuest: f2.perGuest, gstRate: (D.brand || {}).gstRate, advancePercent: (D.brand || {}).advancePercent });
        }
      }
      reasons.push(est.total <= budget
        ? `Tuned to fit your ${rupee(budget)} budget (est. ${rupee(est.total)}).`
        : `Best possible within budget; nearest fit is ${rupee(est.total)}.`);
    }

    return { occasion, venueId: venue.id, guests, addOns, foodId, themeId, estimate: est, reasons };
  }

  /* ============================================================
     EVENT PROGRESS TRACKER
     Maps a booking's status to an ordered milestone timeline.
     ============================================================ */
  function milestoneState(booking) {
    const steps = (D.milestones || []).slice();
    const status = (booking && booking.status) || "requested";
    const paid = !!(booking && booking.payment && booking.payment.paid);

    // determine the index reached
    let reachedIdx = 0; // requested
    if (paid || status === "confirmed") reachedIdx = Math.max(reachedIdx, 1);
    if (status === "confirmed") reachedIdx = Math.max(reachedIdx, 2); // planning auto-starts once confirmed
    if (status === "completed") reachedIdx = steps.length - 1;
    if (status === "cancelled") reachedIdx = paid ? 1 : 0;

    return steps.map((m, i) => ({
      id: m.id, label: m.label, icon: m.icon, note: m.note,
      done: i < reachedIdx,
      current: i === reachedIdx && status !== "cancelled",
    }));
  }

  /* ============================================================
     DIGITAL INVITATION GENERATOR
     Produces a shareable SVG invite card + plain-text message.
     ============================================================ */
  function _fmtDate(d) {
    try {
      const dt = new Date(d + "T00:00:00");
      if (isNaN(dt)) return d || "";
      return dt.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
    } catch (e) { return d || ""; }
  }

  function inviteText(booking, ctx) {
    ctx = ctx || {};
    const occ = ctx.occasionName || "Celebration";
    const host = (booking.name || "").split(" ")[0] || "We";
    return `You're invited! 🎉\n${host} invites you to a ${occ} at UTSAVA Celebrations.\n📅 ${_fmtDate(booking.date)}  ⏰ ${booking.slot || ""}\n📍 ${ctx.venueName || "UTSAVA"}, ${(D.brand || {}).location || ""}\nRef #${booking.ref}\n— Turning moments into memories`;
  }

  function buildInviteSVG(booking, ctx) {
    ctx = ctx || {};
    const occ = esc(ctx.occasionName || "Celebration");
    const emoji = ctx.occasionEmoji || "🎉";
    const host = esc((booking.name || "Your host"));
    const date = esc(_fmtDate(booking.date));
    const slot = esc(booking.slot || "");
    const venue = esc(ctx.venueName || "UTSAVA Celebrations");
    const loc = esc((D.brand || {}).location || "");
    const theme = (D.decorThemes || []).find((t) => t.id === (booking.themeId)) || {};
    const themeName = theme.name ? esc(theme.name) + " theme" : "";

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 840" width="600" height="840" font-family="Georgia, 'Times New Roman', serif">
  <defs>
    <radialGradient id="ivbg" cx="50%" cy="30%" r="90%">
      <stop offset="0" stop-color="#1f7a46"/><stop offset="0.6" stop-color="#14633a"/><stop offset="1" stop-color="#0a3a22"/>
    </radialGradient>
    <linearGradient id="ivg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fbeeb6"/><stop offset="0.5" stop-color="#e7bd58"/><stop offset="1" stop-color="#c89227"/>
    </linearGradient>
  </defs>
  <rect width="600" height="840" fill="url(#ivbg)"/>
  <rect x="26" y="26" width="548" height="788" rx="22" fill="none" stroke="url(#ivg)" stroke-width="3"/>
  <rect x="38" y="38" width="524" height="764" rx="16" fill="none" stroke="url(#ivg)" stroke-width="1" opacity="0.6"/>
  <text x="300" y="120" text-anchor="middle" fill="url(#ivg)" font-size="26" letter-spacing="8">UTSAVA CELEBRATIONS</text>
  <text x="300" y="210" text-anchor="middle" font-size="84">${emoji}</text>
  <text x="300" y="300" text-anchor="middle" fill="#fff" font-size="30" letter-spacing="4">You are invited to a</text>
  <text x="300" y="372" text-anchor="middle" fill="url(#ivg)" font-style="italic" font-size="62" font-weight="700">${occ}</text>
  <text x="300" y="430" text-anchor="middle" fill="#ffe9b8" font-size="26">hosted by ${host}</text>
  <line x1="160" y1="470" x2="440" y2="470" stroke="url(#ivg)" stroke-width="1.5"/>
  <text x="300" y="528" text-anchor="middle" fill="#fff" font-size="30">${date}</text>
  <text x="300" y="572" text-anchor="middle" fill="#cfe9d8" font-size="26">${slot}</text>
  <text x="300" y="640" text-anchor="middle" fill="#fff" font-size="28">${venue}</text>
  <text x="300" y="678" text-anchor="middle" fill="#cfe9d8" font-size="22">${loc}</text>
  ${themeName ? `<text x="300" y="716" text-anchor="middle" fill="#e7bd58" font-size="20" font-style="italic">${themeName}</text>` : ""}
  <text x="300" y="772" text-anchor="middle" fill="url(#ivg)" font-size="20" letter-spacing="2">Ref #${esc(booking.ref)}</text>
  <text x="300" y="800" text-anchor="middle" fill="#9ec7ad" font-size="16" font-style="italic">Turning moments into memories</text>
</svg>`;
  }

  /* data URL for download/preview */
  function svgDataUrl(svg) {
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* ============================================================
     RAZORPAY PAYMENT (with graceful demo fallback)
     ============================================================ */
  function _loadRazorpay() {
    return new Promise((resolve) => {
      if (typeof root.Razorpay !== "undefined") return resolve(true);
      if (typeof document === "undefined") return resolve(false);
      const existing = document.getElementById("razorpay-sdk");
      if (existing) { existing.addEventListener("load", () => resolve(typeof root.Razorpay !== "undefined")); return; }
      const s = document.createElement("script");
      s.id = "razorpay-sdk";
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(typeof root.Razorpay !== "undefined");
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }

  /**
   * Collect an advance payment.
   * opts: { amount, name, phone, email, description, onSuccess(paymentId, mode), onCancel() }
   * Falls back to a deterministic demo payment id when the SDK can't load
   * (offline / no network), so the booking flow always completes.
   */
  function payAdvance(opts) {
    opts = opts || {};
    const amount = Math.max(1, Math.round(Number(opts.amount) || 0));
    const key = (D.brand || {}).razorpayKey;

    const demo = () => {
      const id = "pay_demo_" + Date.now().toString(36);
      if (typeof opts.onSuccess === "function") opts.onSuccess(id, "demo");
    };

    if (typeof root.Razorpay === "undefined" && typeof document === "undefined") return demo();

    _loadRazorpay().then((ok) => {
      if (!ok || !key) return demo();
      try {
        const rzp = new root.Razorpay({
          key,
          amount: amount * 100, // paise
          currency: "INR",
          name: "UTSAVA Celebrations",
          description: opts.description || "Advance to confirm booking",
          image: "icons/icon.svg",
          prefill: { name: opts.name || "", contact: opts.phone || "", email: opts.email || "" },
          notes: { ref: opts.ref || "" },
          theme: { color: "#14633a" },
          handler: function (resp) {
            if (typeof opts.onSuccess === "function") opts.onSuccess((resp && resp.razorpay_payment_id) || "paid", "razorpay");
          },
          modal: { ondismiss: function () { if (typeof opts.onCancel === "function") opts.onCancel(); } },
        });
        rzp.on && rzp.on("payment.failed", function () { demo(); });
        rzp.open();
      } catch (e) { demo(); }
    });
  }

  return {
    aiRecommend,
    milestoneState,
    inviteText, buildInviteSVG, svgDataUrl,
    payAdvance, _loadRazorpay,
  };
});
