/* ============================================================
   UTSAVA Celebration — App Logic
   Rendering + interactive booking flow with people-based
   packages, add-ons, coupons and advance payment.
   ============================================================ */

/* ---------- Inline SVG icon set (stroke-based) ---------- */
const ICONS = {
  hall:   '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/></svg>',
  decor:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 21v-4M3 12h4M21 12h-4"/><circle cx="12" cy="12" r="3.5"/></svg>',
  flower: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.5"/><path d="M12 9.5c0-3 4-3 4 0s-4 0-4 0zM12 14.5c0 3-4 3-4 0s4 0 4 0zM9.5 12c-3 0-3-4 0-4s0 4 0 4zM14.5 12c3 0 3 4 0 4s0-4 0-4z"/></svg>',
  balloon:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14c3 0 5-2.5 5-6s-2-5-5-5-5 1.5-5 5 2 6 5 6zM12 14v2M11 18c0 1 2 1 2 2"/></svg>',
  light:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 2a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 2z"/></svg>',
  sound:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5zM16 9a4 4 0 0 1 0 6M18.5 7a7 7 0 0 1 0 10"/></svg>',
  catering:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h16a8 8 0 0 0-16 0zM2 18h20M12 6V4"/></svg>',
  cake:   '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16v-7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v7zM4 16h16M12 7V4M12 4l-1.5 1.5M12 4l1.5 1.5"/></svg>',
  cam:    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/></svg>',
  spark:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>',
  star:   '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.9 6 6.1.9-4.5 4.3 1.1 6.1L12 17.8 6.4 20.3l1.1-6.1L3 9.9 9.1 9 12 3z"/></svg>',
  heart:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.3-9.3-8.4C1 8.5 2.6 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.4 0 5 3.5 3.3 6.6C19 15.7 12 20 12 20z"/></svg>',
};

const $  = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const rupee = (n) => "₹" + Number(Math.round(n)).toLocaleString("en-IN");
const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

/* ============================================================
   RENDER STATIC SECTIONS
   ============================================================ */
function renderStats() {
  $("#heroStats").innerHTML = UTSAVA.stats.map(s =>
    `<div><strong>${s.value}</strong><span>${s.label}</span></div>`).join("");
}

function renderServices() {
  $("#servicesGrid").innerHTML = UTSAVA.services.map(s => `
    <div class="service-card reveal">
      <div class="svc-ic">${ICONS[s.icon] || ""}</div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
    </div>`).join("");
}

function renderEvents() {
  $("#eventsGrid").innerHTML = UTSAVA.events.map(e => `
    <div class="event-card reveal" data-event="${e.id}">
      <div class="event-emoji">${e.emoji}</div>
      <h3>${e.name}</h3>
      <p>${e.blurb}</p>
      <span class="mini-book">Book →</span>
    </div>`).join("");

  $$(".event-card").forEach(card =>
    card.addEventListener("click", () => openBooking(card.dataset.event))
  );
}

function renderHow() {
  $("#howGrid").innerHTML = UTSAVA.howItWorks.map((h, i) => `
    <div class="how-card reveal">
      <div class="how-num">${i + 1}</div>
      <div class="how-ic">${ICONS[h.icon] || ""}</div>
      <h3>${h.title}</h3>
      <p>${h.text}</p>
    </div>`).join("");
}

function renderVenues() {
  $("#venuesGrid").innerHTML = UTSAVA.venues.map(v => `
    <div class="venue-card reveal">
      <div class="venue-visual">${v.id === "hall" ? "🏛️" : "🎭"}</div>
      <div class="venue-body">
        <h3>${v.name}</h3>
        <div class="venue-cap">${v.capacity} · ${v.size}</div>
        <p>${v.desc}</p>
        <div class="venue-tags">${v.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
        <div class="venue-foot">
          <span class="rate">from <b>${rupee(v.basePackage)}</b><small> /${v.includesPeople} ppl</small></span>
          <button class="btn btn-ghost dark btn-sm" data-venue="${v.id}">Book</button>
        </div>
      </div>
    </div>`).join("");

  $$("[data-venue]").forEach(b =>
    b.addEventListener("click", () => openBooking(null, b.dataset.venue))
  );
}

function renderAddons() {
  $("#addonsGrid").innerHTML = UTSAVA.addOns.map(a => `
    <div class="addon-card reveal">
      <div class="addon-ic">${ICONS[a.icon] || ""}</div>
      <div>
        <h3>${a.name}</h3>
        <p>${a.desc}</p>
      </div>
      <div class="addon-price">${rupee(a.price)}</div>
    </div>`).join("");
}

function renderGallery() {
  $("#galleryGrid").innerHTML = UTSAVA.gallery.map(g => `
    <div class="gallery-item ${g.theme} reveal"><span>${g.title}</span></div>`).join("");
}

function renderPackages() {
  $("#packagesGrid").innerHTML = UTSAVA.packages.map(p => `
    <div class="pkg-card reveal">
      <h3>${p.name}</h3>
      <div class="pkg-window">${p.window}</div>
      <span class="pkg-slot">${p.slot}</span>
      <p class="pkg-note">${p.note}</p>
    </div>`).join("");
}

function renderReviews() {
  const avg = (UTSAVA.reviews.reduce((s, r) => s + r.rating, 0) / UTSAVA.reviews.length).toFixed(1);
  $("#reviewsSummary").textContent = `Rated ${avg} / 5 across thousands of celebrations.`;
  $("#reviewsRow").innerHTML = UTSAVA.reviews.map(r => `
    <div class="review-card reveal">
      <div class="review-stars">${stars(r.rating)}</div>
      <p class="review-text">“${r.text}”</p>
      <div class="review-foot">
        <span class="review-avatar">${r.name.charAt(0)}</span>
        <div><strong>${r.name}</strong><small>${r.tag}</small></div>
      </div>
    </div>`).join("");
}

function renderWhy() {
  $("#whyGrid").innerHTML = UTSAVA.highlights.map(h => `
    <div class="why-card reveal">
      <div class="why-ic">${ICONS[h.icon] || ""}</div>
      <h3>${h.title}</h3>
      <p>${h.text}</p>
    </div>`).join("");
}

function renderFaq() {
  $("#faqList").innerHTML = UTSAVA.faq.map(f => `
    <details class="faq-item reveal">
      <summary>${f.q}<span class="faq-plus">+</span></summary>
      <p>${f.a}</p>
    </details>`).join("");
}

function renderContact() {
  const b = UTSAVA.brand;
  $("#contactCards").innerHTML = `
    <a class="contact-card" href="tel:${b.phone}">
      <span class="cc-ic">📞</span>
      <div><div class="lbl">Call us</div><div class="val">${b.phoneDisplay}</div></div>
    </a>
    <a class="contact-card" href="https://wa.me/${b.whatsapp}" target="_blank" rel="noopener">
      <span class="cc-ic">💬</span>
      <div><div class="lbl">WhatsApp</div><div class="val">${b.phoneDisplay}</div></div>
    </a>
    <a class="contact-card" href="mailto:${b.email}">
      <span class="cc-ic">✉️</span>
      <div><div class="lbl">Email</div><div class="val">${b.email}</div></div>
    </a>
    <div class="contact-card">
      <span class="cc-ic">📍</span>
      <div><div class="lbl">Visit</div><div class="val">${b.location}</div></div>
    </div>`;
}

/* ============================================================
   BOOKING FLOW (4 steps)
   ============================================================ */
const booking = {
  step: 1,
  eventId: null,
  venueId: null,
  guests: 0,
  date: "",
  slot: "",
  addOns: new Set(),
  coupon: null,        // {code, discount}
  name: "",
  phone: "",
};

const modal = $("#bookingModal");

function openBooking(eventId = null, venueId = null) {
  Object.assign(booking, {
    step: 1, eventId, venueId, guests: 0, date: "", slot: "",
    addOns: new Set(), coupon: null, name: booking.name, phone: booking.phone,
  });
  const v = UTSAVA.venues.find(x => x.id === venueId);
  booking.guests = v ? v.includesPeople : 0;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if ($("#bkSteps")) $("#bkSteps").style.visibility = "visible";
  renderStep();
}

function closeBooking() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ---- pricing ---- */
function venueCost() {
  const v = UTSAVA.venues.find(x => x.id === booking.venueId);
  if (!v) return 0;
  const extra = Math.max(0, booking.guests - v.includesPeople);
  return v.basePackage + extra * v.extraPerPerson;
}
function addOnsCost() {
  let t = 0;
  booking.addOns.forEach(id => { const a = UTSAVA.addOns.find(x => x.id === id); if (a) t += a.price; });
  return t;
}
function subtotal() { return venueCost() + addOnsCost(); }
function discountAmount() {
  if (!booking.coupon) return 0;
  const c = UTSAVA.coupons.find(x => x.code === booking.coupon);
  if (!c) return 0;
  const sub = subtotal();
  if (sub < c.min) return 0;
  return c.type === "flat" ? Math.min(c.value, sub) : Math.round(sub * c.value / 100);
}
function grandTotal() { return Math.max(0, subtotal() - discountAmount()); }
function advanceAmount() { return Math.round(grandTotal() * UTSAVA.advancePercent / 100); }

function updateTotal() { $("#bkTotal").textContent = rupee(grandTotal()); }

function applyCoupon(codeRaw) {
  const code = (codeRaw || "").trim().toUpperCase();
  const msg = $("#couponMsg");
  if (!code) { booking.coupon = null; if (msg) msg.textContent = ""; updateTotal(); return; }
  const c = UTSAVA.coupons.find(x => x.code === code);
  if (!c) { booking.coupon = null; if (msg) { msg.textContent = "Invalid coupon code"; msg.className = "coupon-msg err"; } }
  else if (subtotal() < c.min) { booking.coupon = null; if (msg) { msg.textContent = `Add ${rupee(c.min)}+ to use ${code}`; msg.className = "coupon-msg err"; } }
  else { booking.coupon = code; if (msg) { msg.textContent = `🎉 ${code} applied — you saved ${rupee(discountAmount())}`; msg.className = "coupon-msg ok"; } }
  updateTotal();
}

function renderStep() {
  $$("#bkSteps .dot").forEach(d => d.classList.toggle("active", Number(d.dataset.step) <= booking.step));
  const body = $("#bkBody");
  const back = $("#bkBack");
  const next = $("#bkNext");
  back.style.visibility = booking.step === 1 ? "hidden" : "visible";

  /* ---- Step 1: occasion ---- */
  if (booking.step === 1) {
    next.textContent = "Next";
    body.innerHTML = `
      <div class="bk-step">
        <h4>What are we celebrating?</h4>
        <p class="hint">Choose your occasion.</p>
        <div class="opt-grid">
          ${UTSAVA.events.map(e => `
            <div class="opt-tile ${booking.eventId === e.id ? "selected" : ""}" data-pick="event" data-id="${e.id}">
              <span class="ot-emoji">${e.emoji}</span>
              <span class="ot-name">${e.name}</span>
            </div>`).join("")}
        </div>
      </div>`;
  }

  /* ---- Step 2: venue + guests + add-ons ---- */
  else if (booking.step === 2) {
    next.textContent = "Next";
    const v = UTSAVA.venues.find(x => x.id === booking.venueId);
    body.innerHTML = `
      <div class="bk-step">
        <h4>Pick a venue</h4>
        <p class="hint">Where would you like to celebrate?</p>
        <div class="opt-list">
          ${UTSAVA.venues.map(vn => `
            <div class="opt ${booking.venueId === vn.id ? "selected" : ""}" data-pick="venue" data-id="${vn.id}">
              <span class="o-emoji">${vn.id === "hall" ? "🏛️" : "🎭"}</span>
              <div class="o-main">
                <div class="o-title">${vn.name}</div>
                <div class="o-sub">${vn.capacity} · ${vn.decorationIncluded ? "decor included" : "decor add-on"}</div>
              </div>
              <span class="o-price">${rupee(vn.basePackage)}<small>/${vn.includesPeople}</small></span>
            </div>`).join("")}
        </div>

        <div id="guestWrap" style="${v ? "" : "display:none"}">
          <h4 style="margin-top:20px">Number of guests</h4>
          <p class="hint">${v ? `${v.includesPeople} included, then ${rupee(v.extraPerPerson)}/extra guest (max ${v.maxPeople}).` : ""}</p>
          <div class="stepper">
            <button type="button" id="gMinus">−</button>
            <span id="gCount">${booking.guests}</span>
            <button type="button" id="gPlus">+</button>
          </div>
        </div>

        <h4 style="margin-top:20px">Add-ons (optional)</h4>
        <p class="hint">Make it extra special.</p>
        <div class="opt-list">
          ${UTSAVA.addOns.map(a => `
            <div class="opt ${booking.addOns.has(a.id) ? "selected" : ""}" data-pick="addon" data-id="${a.id}">
              <span class="o-emoji">${ICONS[a.icon] ? `<span class="o-ic">${ICONS[a.icon]}</span>` : ""}</span>
              <div class="o-main">
                <div class="o-title">${a.name}</div>
                <div class="o-sub">${a.desc}</div>
              </div>
              <span class="o-price">${rupee(a.price)}</span>
              <span class="o-check">✓</span>
            </div>`).join("")}
        </div>
      </div>`;
    wireGuestStepper();
  }

  /* ---- Step 3: date / slot / details ---- */
  else if (booking.step === 3) {
    next.textContent = "Review";
    const today = new Date().toISOString().split("T")[0];
    body.innerHTML = `
      <div class="bk-step">
        <h4>Date & time</h4>
        <p class="hint">Open 9 AM–11 PM, all 7 days.</p>
        <div class="field">
          <label>Event date</label>
          <input type="date" id="bkDate" min="${today}" value="${booking.date}">
        </div>
        <div class="field">
          <label>Choose a slot</label>
          <div class="chip-row">
            <strong class="chip-label">Morning · 2 hr</strong>
            ${UTSAVA.slots.morning.map(s => `<button type="button" class="chip ${booking.slot === s ? "selected" : ""}" data-slot="${s}">${s}</button>`).join("")}
            <strong class="chip-label">Evening · 1½ hr</strong>
            ${UTSAVA.slots.evening.map(s => `<button type="button" class="chip ${booking.slot === s ? "selected" : ""}" data-slot="${s}">${s}</button>`).join("")}
          </div>
        </div>
        <div class="field">
          <label>Your name</label>
          <input type="text" id="bkName" placeholder="Full name" value="${booking.name}">
        </div>
        <div class="field">
          <label>Phone number</label>
          <input type="tel" id="bkPhone" placeholder="10-digit mobile" value="${booking.phone}">
        </div>
        <div class="field">
          <label>Coupon code</label>
          <div class="coupon-row">
            <input type="text" id="bkCoupon" placeholder="e.g. FLAT500" value="${booking.coupon || ""}">
            <button type="button" class="btn btn-ghost dark btn-sm" id="bkApply">Apply</button>
          </div>
          <div class="coupon-msg ${booking.coupon ? "ok" : ""}" id="couponMsg">${booking.coupon ? `🎉 ${booking.coupon} applied` : ""}</div>
          <div class="coupon-hints">${UTSAVA.coupons.map(c => `<button type="button" class="coupon-chip" data-coupon="${c.code}">${c.code}</button>`).join("")}</div>
        </div>
      </div>`;

    $("#bkDate").addEventListener("change", e => booking.date = e.target.value);
    $("#bkName").addEventListener("input", e => booking.name = e.target.value);
    $("#bkPhone").addEventListener("input", e => booking.phone = e.target.value);
    $$("[data-slot]").forEach(c => c.addEventListener("click", () => {
      booking.slot = c.dataset.slot;
      $$("[data-slot]").forEach(x => x.classList.toggle("selected", x.dataset.slot === booking.slot));
    }));
    $("#bkApply").addEventListener("click", () => applyCoupon($("#bkCoupon").value));
    $$("[data-coupon]").forEach(b => b.addEventListener("click", () => { $("#bkCoupon").value = b.dataset.coupon; applyCoupon(b.dataset.coupon); }));
  }

  /* ---- Step 4: review + payment ---- */
  else if (booking.step === 4) {
    next.textContent = "Confirm 🎉";
    const ev = UTSAVA.events.find(e => e.id === booking.eventId);
    const vn = UTSAVA.venues.find(v => v.id === booking.venueId);
    const addList = [...booking.addOns].map(id => UTSAVA.addOns.find(a => a.id === id));
    const disc = discountAmount();
    body.innerHTML = `
      <div class="bk-step">
        <h4>Review your booking</h4>
        <p class="hint">Please confirm the details below.</p>
        <div class="summary">
          <div class="summary-row"><span>Occasion</span><strong>${ev ? ev.emoji + " " + ev.name : "—"}</strong></div>
          <div class="summary-row"><span>Venue</span><strong>${vn ? vn.name : "—"}</strong></div>
          <div class="summary-row"><span>Guests</span><strong>${booking.guests || "—"}</strong></div>
          <div class="summary-row"><span>Date</span><strong>${booking.date || "—"}</strong></div>
          <div class="summary-row"><span>Slot</span><strong>${booking.slot || "—"}</strong></div>
          <div class="summary-row"><span>Add-ons</span><strong>${addList.length ? addList.map(a => a.name).join(", ") : "None"}</strong></div>
        </div>
        <div class="summary" style="margin-top:14px">
          <div class="summary-row"><span>Venue package</span><strong>${rupee(venueCost())}</strong></div>
          <div class="summary-row"><span>Add-ons</span><strong>${rupee(addOnsCost())}</strong></div>
          ${disc ? `<div class="summary-row disc"><span>Coupon ${booking.coupon}</span><strong>− ${rupee(disc)}</strong></div>` : ""}
          <div class="summary-row summary-total"><span>Total</span><strong>${rupee(grandTotal())}</strong></div>
          <div class="summary-row pay-row"><span>Pay now (advance ${UTSAVA.advancePercent}%)</span><strong>${rupee(advanceAmount())}</strong></div>
          <div class="summary-row"><span>Balance at venue</span><strong>${rupee(grandTotal() - advanceAmount())}</strong></div>
        </div>
        <p class="hint" style="margin-top:14px">This is an estimate. Our team will call you on ${UTSAVA.brand.phoneDisplay} to finalise.</p>
      </div>`;
  }

  // wire option pickers (event / venue / addon tiles)
  $$("[data-pick]").forEach(opt => opt.addEventListener("click", () => {
    const { pick, id } = opt.dataset;
    if (pick === "event") {
      booking.eventId = id;
      $$('[data-pick="event"]').forEach(o => o.classList.toggle("selected", o.dataset.id === id));
    }
    if (pick === "venue") {
      booking.venueId = id;
      const v = UTSAVA.venues.find(x => x.id === id);
      booking.guests = v ? v.includesPeople : 0;
      $$('[data-pick="venue"]').forEach(o => o.classList.toggle("selected", o.dataset.id === id));
      const gw = $("#guestWrap");
      if (gw) { gw.style.display = ""; $("#gCount").textContent = booking.guests;
        gw.querySelector(".hint").textContent = `${v.includesPeople} included, then ${rupee(v.extraPerPerson)}/extra guest (max ${v.maxPeople}).`; }
    }
    if (pick === "addon") {
      booking.addOns.has(id) ? booking.addOns.delete(id) : booking.addOns.add(id);
      opt.classList.toggle("selected");
    }
    updateTotal();
  }));

  updateTotal();
}

function wireGuestStepper() {
  const minus = $("#gMinus"), plus = $("#gPlus"), count = $("#gCount");
  if (!minus) return;
  const v = () => UTSAVA.venues.find(x => x.id === booking.venueId);
  minus.addEventListener("click", () => {
    const vn = v(); if (!vn) return;
    booking.guests = Math.max(1, booking.guests - 1);
    count.textContent = booking.guests; updateTotal();
  });
  plus.addEventListener("click", () => {
    const vn = v(); if (!vn) return;
    booking.guests = Math.min(vn.maxPeople, booking.guests + 1);
    count.textContent = booking.guests; updateTotal();
  });
}

function nextStep() {
  if (booking.step === 1 && !booking.eventId) return toast("Please select an occasion");
  if (booking.step === 2) {
    if (!booking.venueId) return toast("Please pick a venue");
    if (booking.guests < 1) return toast("Please set number of guests");
  }
  if (booking.step === 3) {
    if (!booking.date) return toast("Please choose a date");
    if (!booking.slot) return toast("Please choose a slot");
    if (!booking.name.trim()) return toast("Please enter your name");
    if (!/^\d{10}$/.test(booking.phone.trim())) return toast("Enter a valid 10-digit phone");
  }
  if (booking.step === 4) return confirmBooking();
  booking.step++;
  renderStep();
}

function prevStep() { if (booking.step > 1) { booking.step--; renderStep(); } }

function confirmBooking() {
  const record = {
    ref: "UTS" + Date.now().toString().slice(-6),
    event: booking.eventId, venue: booking.venueId, guests: booking.guests,
    date: booking.date, slot: booking.slot, addOns: [...booking.addOns],
    coupon: booking.coupon, total: grandTotal(), advance: advanceAmount(),
    name: booking.name, phone: booking.phone, createdAt: new Date().toISOString(),
  };
  try {
    const all = JSON.parse(localStorage.getItem("utsava_bookings") || "[]");
    all.push(record);
    localStorage.setItem("utsava_bookings", JSON.stringify(all));
  } catch (e) { /* storage may be unavailable */ }

  $("#bkBody").innerHTML = `
    <div class="confirm-banner">
      <div class="big">🎉</div>
      <h4>Booking requested!</h4>
      <p>Reference <strong>#${record.ref}</strong></p>
      <p>Pay advance <strong>${rupee(record.advance)}</strong> to confirm. Thank you, ${record.name.split(" ")[0] || "there"}! Our team will call you shortly.</p>
    </div>`;
  $("#bkSteps").style.visibility = "hidden";
  $(".modal-foot").innerHTML = `<button class="btn btn-gold btn-lg" style="width:100%" id="bkDone">Done</button>`;
  $("#bkDone").addEventListener("click", () => { closeBooking(); $("#bkSteps").style.visibility = "visible"; restoreFoot(); });
  launchConfetti(true);
  toast("Booking saved successfully 🎊");
}

function restoreFoot() {
  $(".modal-foot").innerHTML = `
    <div class="estimate"><span>Estimated</span><strong id="bkTotal">₹0</strong></div>
    <div class="foot-btns">
      <button class="btn btn-ghost btn-sm" id="bkBack">Back</button>
      <button class="btn btn-gold btn-sm" id="bkNext">Next</button>
    </div>`;
  $("#bkBack").addEventListener("click", prevStep);
  $("#bkNext").addEventListener("click", nextStep);
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ============================================================
   CONFETTI
   ============================================================ */
const CONFETTI_COLORS = ["#f4b740", "#d6336c", "#ff7aa2", "#69db7c", "#91a7ff", "#ffd87a"];
function launchConfetti(burst = false) {
  const wrap = $(".hero-confetti");
  if (!wrap) return;
  const count = burst ? 60 : 26;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "confetti-piece";
    p.style.left = Math.random() * 100 + "%";
    p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    p.style.animationDuration = (3 + Math.random() * 3) + "s";
    p.style.animationDelay = (Math.random() * (burst ? 0.5 : 4)) + "s";
    p.style.width = (6 + Math.random() * 8) + "px";
    p.style.height = (10 + Math.random() * 8) + "px";
    (burst ? document.body : wrap).appendChild(p);
    if (burst) setTimeout(() => p.remove(), 6000);
  }
}

/* ============================================================
   SCROLL REVEAL + APPBAR
   ============================================================ */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => obs.observe(el));
}

function initAppbar() {
  const bar = $("#appbar");
  window.addEventListener("scroll", () => bar.classList.toggle("scrolled", window.scrollY > 10));
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  renderStats();
  renderServices();
  renderEvents();
  renderHow();
  renderVenues();
  renderAddons();
  renderGallery();
  renderPackages();
  renderReviews();
  renderWhy();
  renderFaq();
  renderContact();
  $("#year").textContent = new Date().getFullYear();

  ["navBookBtn", "heroBookBtn", "bottomBookBtn", "contactBookBtn"].forEach(id => {
    const el = $("#" + id);
    if (el) el.addEventListener("click", () => openBooking());
  });
  $("#bkNext").addEventListener("click", nextStep);
  $("#bkBack").addEventListener("click", prevStep);
  $$("[data-close]").forEach(el => el.addEventListener("click", closeBooking));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeBooking(); });

  initReveal();
  initAppbar();
  launchConfetti(false);
}

document.addEventListener("DOMContentLoaded", init);
