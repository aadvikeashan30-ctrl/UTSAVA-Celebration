/* ============================================================
   UTSAVA Celebration — App (router + views + booking wizard)
   Depends on globals: UTSAVA (data), PRICING (logic), STORE.
   ============================================================ */
(function () {
  "use strict";

  const D = window.UTSAVA;
  const P = window.PRICING;
  const S = window.STORE;

  /* ---------- DOM helpers ---------- */
  const $  = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const rupee = (n) => "₹" + Number(Math.round(n)).toLocaleString("en-IN");
  const stars = (n) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Icons ---------- */
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
  const icon = (k) => ICONS[k] || "";

  /* ---------- lookups ---------- */
  const venueById = (id) => D.venues.find((v) => v.id === id);
  const eventById = (id) => D.events.find((e) => e.id === id);
  const addOnById = (id) => D.addOns.find((a) => a.id === id);

  /* ============================================================
     STATIC RENDERERS
     ============================================================ */
  function renderOffers() {
    const bar = $("#offersBar");
    bar.innerHTML = `<div class="offers-track">${D.offers.concat(D.offers).map((o) => `<span>${esc(o)}</span>`).join("")}</div>`;
  }

  function renderStats() {
    $("#heroStats").innerHTML = D.stats.map((s) =>
      `<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join("");
  }

  function eventCardHTML(e) {
    return `<div class="event-card reveal" data-event="${e.id}" role="button" tabindex="0">
      <div class="event-emoji">${e.emoji}</div>
      <h3>${esc(e.name)}</h3>
      <p>${esc(e.blurb)}</p>
      <span class="mini-book">Book →</span>
    </div>`;
  }
  function wireEventCards(scope) {
    $$(".event-card", scope).forEach((card) => {
      const go = () => openBooking(card.dataset.event);
      card.addEventListener("click", go);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }
  function renderEvents() {
    $("#eventsGridHome").innerHTML = D.events.slice(0, 6).map(eventCardHTML).join("");
    $("#eventsGridAll").innerHTML = D.events.map(eventCardHTML).join("");
    wireEventCards($("#eventsGridHome"));
    wireEventCards($("#eventsGridAll"));
  }

  function renderHow() {
    $("#howGrid").innerHTML = D.howItWorks.map((h, i) => `
      <div class="how-card reveal">
        <div class="how-num">${i + 1}</div>
        <div class="how-ic">${icon(h.icon)}</div>
        <h3>${esc(h.title)}</h3>
        <p>${esc(h.text)}</p>
      </div>`).join("");
  }

  function venueCardHTML(v, detailed) {
    const fav = S.isFavourite(v.id);
    return `<div class="venue-card reveal ${detailed ? "is-detailed" : ""}">
      <div class="venue-visual ${v.theme}">
        <span class="vv-emoji">${v.id === "hall" ? "🏛️" : "🎭"}</span>
        <button class="fav-btn ${fav ? "on" : ""}" data-fav="${v.id}" aria-label="Save venue">♥</button>
      </div>
      <div class="venue-body">
        <div class="venue-top">
          <h3>${esc(v.name)}</h3>
          <span class="rating-badge">★ ${v.rating}</span>
        </div>
        <div class="venue-cap">${esc(v.capacity)} · ${esc(v.size)}</div>
        <p>${esc(v.desc)}</p>
        ${detailed ? `<div class="amenities">${v.amenities.map((a) => `<span class="amenity">✓ ${esc(a)}</span>`).join("")}</div>` : ""}
        <div class="venue-tags">${v.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <div class="venue-foot">
          <span class="rate">from <b>${rupee(v.basePackage)}</b><small> /${v.includesPeople} ppl</small></span>
          <button class="btn btn-gold btn-sm" data-venue="${v.id}">Book</button>
        </div>
      </div>
    </div>`;
  }
  function wireVenueCards(scope) {
    $$("[data-venue]", scope).forEach((b) => b.addEventListener("click", () => openBooking(null, b.dataset.venue)));
    $$("[data-fav]", scope).forEach((b) => b.addEventListener("click", () => {
      const on = S.toggleFavourite(b.dataset.fav);
      b.classList.toggle("on", on);
      toast(on ? "Saved to favourites ♥" : "Removed from favourites");
    }));
  }
  function renderVenues() {
    $("#venuesGridHome").innerHTML = D.venues.map((v) => venueCardHTML(v, false)).join("");
    $("#venuesGridAll").innerHTML = D.venues.map((v) => venueCardHTML(v, true)).join("");
    wireVenueCards($("#venuesGridHome"));
    wireVenueCards($("#venuesGridAll"));
  }

  function renderServices() {
    $("#servicesGrid").innerHTML = D.services.map((s) => `
      <div class="service-card reveal">
        <div class="svc-ic">${icon(s.icon)}</div>
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.desc)}</p>
      </div>`).join("");
  }

  function renderAddons() {
    $("#addonsGrid").innerHTML = D.addOns.map((a) => `
      <div class="addon-card reveal">
        <div class="addon-ic">${icon(a.icon)}</div>
        <div>
          <h3>${esc(a.name)}</h3>
          <p>${esc(a.desc)}</p>
        </div>
        <div class="addon-price">${rupee(a.price)}<small>${esc(a.unit)}</small></div>
      </div>`).join("");
  }

  function galleryItemHTML(g) {
    return `<div class="gallery-item ${g.theme} reveal" data-tag="${g.tag}"><span>${esc(g.title)}</span></div>`;
  }
  function renderGallery() {
    $("#galleryGridHome").innerHTML = D.gallery.slice(0, 6).map(galleryItemHTML).join("");
    $("#galleryGridAll").innerHTML = D.gallery.map(galleryItemHTML).join("");
    $("#galleryFilters").innerHTML = D.galleryFilters.map((f, i) =>
      `<button class="filter-chip ${i === 0 ? "active" : ""}" data-filter="${f.id}">${esc(f.label)}</button>`).join("");
    $$("#galleryFilters .filter-chip").forEach((chip) => chip.addEventListener("click", () => {
      $$("#galleryFilters .filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.filter;
      $$("#galleryGridAll .gallery-item").forEach((it) => {
        it.style.display = (f === "all" || it.dataset.tag === f) ? "" : "none";
      });
    }));
  }

  function renderPackages() {
    $("#packagesGrid").innerHTML = D.packages.map((p) => `
      <div class="pkg-card reveal">
        <h3>${esc(p.name)}</h3>
        <div class="pkg-window">${esc(p.window)}</div>
        <span class="pkg-slot">${esc(p.slot)}</span>
        <p class="pkg-note">${esc(p.note)}</p>
      </div>`).join("");
  }

  function renderReviews() {
    const avg = (D.reviews.reduce((s, r) => s + r.rating, 0) / D.reviews.length).toFixed(1);
    $("#reviewsSummary").textContent = `Rated ${avg} / 5 across thousands of celebrations.`;
    $("#reviewsRow").innerHTML = D.reviews.map((r) => `
      <div class="review-card reveal">
        <div class="review-stars">${stars(r.rating)}</div>
        <p class="review-text">“${esc(r.text)}”</p>
        <div class="review-foot">
          <span class="review-avatar">${esc(r.name.charAt(0))}</span>
          <div><strong>${esc(r.name)}</strong><small>${esc(r.tag)}</small></div>
        </div>
      </div>`).join("");
  }

  function renderWhy() {
    $("#whyGrid").innerHTML = D.highlights.map((h) => `
      <div class="why-card reveal">
        <div class="why-ic">${icon(h.icon)}</div>
        <h3>${esc(h.title)}</h3>
        <p>${esc(h.text)}</p>
      </div>`).join("");
  }

  function renderFaq() {
    $("#faqList").innerHTML = D.faq.map((f) => `
      <details class="faq-item reveal">
        <summary>${esc(f.q)}<span class="faq-plus">+</span></summary>
        <p>${esc(f.a)}</p>
      </details>`).join("");
  }

  function renderContact() {
    const b = D.brand;
    $("#contactCards").innerHTML = `
      <a class="contact-card" href="tel:${b.phone}"><span class="cc-ic">📞</span><div><div class="lbl">Call us</div><div class="val">${b.phoneDisplay}</div></div></a>
      <a class="contact-card" href="https://wa.me/${b.whatsapp}" target="_blank" rel="noopener"><span class="cc-ic">💬</span><div><div class="lbl">WhatsApp</div><div class="val">${b.phoneDisplay}</div></div></a>
      <a class="contact-card" href="mailto:${b.email}"><span class="cc-ic">✉️</span><div><div class="lbl">Email</div><div class="val">${esc(b.email)}</div></div></a>
      <div class="contact-card"><span class="cc-ic">📍</span><div><div class="lbl">Visit</div><div class="val">${esc(b.location)}</div></div></div>`;
    $("#fabWhatsapp").href = `https://wa.me/${b.whatsapp}`;
  }

  /* ============================================================
     OCCASION SEARCH
     ============================================================ */
  function initOccasionSearch() {
    const input = $("#occSearch");
    if (!input) return;
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      $$("#eventsGridAll .event-card").forEach((card) => {
        const e = eventById(card.dataset.event);
        const hit = !q || e.name.toLowerCase().includes(q) || e.blurb.toLowerCase().includes(q);
        card.style.display = hit ? "" : "none";
      });
    });
  }

  /* ============================================================
     MY BOOKINGS
     ============================================================ */
  const STATUS_LABEL = { requested: "Requested", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" };

  function renderBookings() {
    const list = S.getBookings();
    const wrap = $("#bookingsList");
    if (!list.length) {
      wrap.innerHTML = `<div class="empty">
        <div class="empty-emoji">🗓️</div>
        <h3>No bookings yet</h3>
        <p>Your celebrations will appear here once you book.</p>
        <button class="btn btn-gold" id="emptyBookBtn">Book your first celebration</button>
      </div>`;
      const eb = $("#emptyBookBtn");
      if (eb) eb.addEventListener("click", () => openBooking());
      return;
    }
    wrap.innerHTML = list.map((b) => {
      const ev = eventById(b.occasion);
      const vn = venueById(b.venue);
      const addNames = (b.addOns || []).map((a) => { const ad = addOnById(a.id); return ad ? ad.name + (a.qty > 1 ? ` ×${a.qty}` : "") : ""; }).filter(Boolean);
      const canCancel = b.status === "requested" || b.status === "confirmed";
      return `<div class="booking-card">
        <div class="bc-head">
          <div><span class="bc-emoji">${ev ? ev.emoji : "🎉"}</span><strong>${ev ? esc(ev.name) : "Celebration"}</strong></div>
          <span class="status status-${b.status}">${STATUS_LABEL[b.status] || b.status}</span>
        </div>
        <div class="bc-meta">
          <span>🏛️ ${vn ? esc(vn.name) : "—"}</span>
          <span>👥 ${b.guests || "—"}</span>
          <span>📅 ${esc(b.date)}</span>
          <span>⏰ ${esc(b.slot)}</span>
        </div>
        ${addNames.length ? `<div class="bc-addons">✨ ${addNames.map(esc).join(", ")}</div>` : ""}
        <div class="bc-foot">
          <div class="bc-price">
            <span>Ref #${esc(b.ref)}</span>
            <strong>${rupee(b.pricing ? b.pricing.total : 0)}</strong>
          </div>
          <div class="bc-actions">
            <button class="btn btn-ghost dark btn-sm" data-share="${b.ref}">Share</button>
            <button class="btn btn-ghost dark btn-sm" data-rebook="${b.occasion}|${b.venue}">Re-book</button>
            ${canCancel ? `<button class="btn btn-danger btn-sm" data-cancel="${b.ref}">Cancel</button>` : ""}
          </div>
        </div>
      </div>`;
    }).join("");

    $$("[data-cancel]", wrap).forEach((b) => b.addEventListener("click", () => {
      S.updateBookingStatus(b.dataset.cancel, "cancelled");
      toast("Booking cancelled");
      renderBookings();
    }));
    $$("[data-rebook]", wrap).forEach((b) => b.addEventListener("click", () => {
      const [occ, ven] = b.dataset.rebook.split("|");
      openBooking(occ, ven);
    }));
    $$("[data-share]", wrap).forEach((b) => b.addEventListener("click", () => shareBooking(b.dataset.share)));
  }

  function shareBooking(ref) {
    const b = S.getBookings().find((x) => x.ref === ref);
    if (!b) return;
    const ev = eventById(b.occasion);
    const vn = venueById(b.venue);
    const text = `My ${ev ? ev.name : "celebration"} at UTSAVA (${vn ? vn.name : ""}) on ${b.date}, ${b.slot}. Ref #${b.ref}`;
    if (navigator.share) {
      navigator.share({ title: "UTSAVA Booking", text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => toast("Booking details copied")).catch(() => toast(text));
    } else { toast("Ref #" + b.ref); }
  }

  /* ============================================================
     BOOKING WIZARD
     ============================================================ */
  const booking = newBooking();
  function newBooking() {
    const prof = (window.STORE ? S.getProfile() : {}) || {};
    return {
      step: 1, eventId: null, venueId: null, guests: 0,
      date: "", slot: "", addOns: {}, coupon: null,
      name: prof.name || "", phone: prof.phone || "", email: prof.email || "", notes: "",
    };
  }

  const modal = $("#bookingModal");

  function openBooking(eventId, venueId) {
    const fresh = newBooking();
    fresh.eventId = eventId || null;
    fresh.venueId = venueId || null;
    const v = venueById(venueId);
    fresh.guests = v ? v.includesPeople : 0;
    Object.assign(booking, fresh);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#bkSteps").style.visibility = "visible";
    restoreFoot();
    renderStep();
  }

  function closeBooking() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function selectedAddOnItems() {
    return Object.keys(booking.addOns).map((id) => {
      const a = addOnById(id);
      return { id, price: a ? a.price : 0, qty: booking.addOns[id] };
    });
  }
  function priceBreakdown() {
    return P.compute({
      venue: venueById(booking.venueId),
      guests: booking.guests,
      addOnItems: selectedAddOnItems(),
      coupon: booking.coupon ? D.coupons.find((c) => c.code === booking.coupon) : null,
      gstRate: D.brand.gstRate,
      advancePercent: D.brand.advancePercent,
    });
  }
  function updateTotal() {
    const el = $("#bkTotal");
    if (el) el.textContent = rupee(priceBreakdown().total);
  }

  function applyCoupon(codeRaw) {
    const code = String(codeRaw || "").trim().toUpperCase();
    const msg = $("#couponMsg");
    if (!code) { booking.coupon = null; if (msg) { msg.textContent = ""; msg.className = "coupon-msg"; } updateTotal(); return; }
    const c = D.coupons.find((x) => x.code === code);
    const sub = priceBreakdown().subtotal;
    if (!c) { booking.coupon = null; if (msg) { msg.textContent = "Invalid coupon code"; msg.className = "coupon-msg err"; } }
    else if (sub < c.min) { booking.coupon = null; if (msg) { msg.textContent = `Add ${rupee(c.min)}+ to use ${code}`; msg.className = "coupon-msg err"; } }
    else {
      booking.coupon = code;
      const saved = priceBreakdown().discount;
      if (msg) { msg.textContent = `🎉 ${code} applied — you saved ${rupee(saved)}`; msg.className = "coupon-msg ok"; }
    }
    updateTotal();
  }

  function renderStep() {
    $$("#bkSteps .dot").forEach((d) => d.classList.toggle("active", Number(d.dataset.step) <= booking.step));
    const body = $("#bkBody");
    const back = $("#bkBack");
    const next = $("#bkNext");
    if (back) back.style.visibility = booking.step === 1 ? "hidden" : "visible";

    if (booking.step === 1) {
      if (next) next.textContent = "Next";
      body.innerHTML = `<div class="bk-step">
        <h4>What are we celebrating?</h4>
        <p class="hint">Choose your occasion.</p>
        <div class="opt-grid">
          ${D.events.map((e) => `<div class="opt-tile ${booking.eventId === e.id ? "selected" : ""}" data-pick="event" data-id="${e.id}">
            <span class="ot-emoji">${e.emoji}</span><span class="ot-name">${esc(e.name)}</span></div>`).join("")}
        </div></div>`;
    }

    else if (booking.step === 2) {
      if (next) next.textContent = "Next";
      const v = venueById(booking.venueId);
      body.innerHTML = `<div class="bk-step">
        <h4>Pick a venue</h4>
        <p class="hint">Where would you like to celebrate?</p>
        <div class="opt-list">
          ${D.venues.map((vn) => `<div class="opt ${booking.venueId === vn.id ? "selected" : ""}" data-pick="venue" data-id="${vn.id}">
            <span class="o-emoji">${vn.id === "hall" ? "🏛️" : "🎭"}</span>
            <div class="o-main"><div class="o-title">${esc(vn.name)}</div><div class="o-sub">${esc(vn.capacity)} · ${vn.decorationIncluded ? "decor included" : "decor add-on"}</div></div>
            <span class="o-price">${rupee(vn.basePackage)}<small>/${vn.includesPeople}</small></span></div>`).join("")}
        </div>
        <div id="guestWrap" style="${v ? "" : "display:none"}">
          <h4 style="margin-top:20px">Number of guests</h4>
          <p class="hint" id="guestHint">${v ? `${v.includesPeople} included, then ${rupee(v.extraPerPerson)}/extra guest (max ${v.maxPeople}).` : ""}</p>
          <div class="stepper"><button type="button" id="gMinus" aria-label="Fewer guests">−</button><span id="gCount">${booking.guests}</span><button type="button" id="gPlus" aria-label="More guests">+</button></div>
        </div>
        <h4 style="margin-top:20px">Add-ons (optional)</h4>
        <p class="hint">Tap to add. Use − / + to set quantity.</p>
        <div class="opt-list">
          ${D.addOns.map((a) => addOnRowHTML(a)).join("")}
        </div></div>`;
      wireGuestStepper();
      wireAddOnRows();
    }

    else if (booking.step === 3) {
      if (next) next.textContent = "Review";
      const today = new Date().toISOString().split("T")[0];
      body.innerHTML = `<div class="bk-step">
        <h4>Date & time</h4>
        <p class="hint">Open 9 AM–11 PM, all 7 days. Booked slots are disabled.</p>
        <div class="field"><label for="bkDate">Event date</label><input type="date" id="bkDate" min="${today}" value="${booking.date}"></div>
        <div class="field"><label>Choose a slot</label><div class="chip-row" id="slotRow"><p class="hint" style="width:100%">Pick a date to see available slots.</p></div></div>
        <div class="field"><label for="bkName">Your name</label><input type="text" id="bkName" placeholder="Full name" value="${esc(booking.name)}"></div>
        <div class="field"><label for="bkPhone">Phone number</label><input type="tel" id="bkPhone" placeholder="10-digit mobile" value="${esc(booking.phone)}"></div>
        <div class="field"><label for="bkEmail">Email (optional)</label><input type="email" id="bkEmail" placeholder="you@example.com" value="${esc(booking.email)}"></div>
        <div class="field"><label for="bkNotes">Special requests (optional)</label><textarea id="bkNotes" rows="2" placeholder="Theme, colours, surprises…">${esc(booking.notes)}</textarea></div>
        <div class="field"><label for="bkCoupon">Coupon code</label>
          <div class="coupon-row"><input type="text" id="bkCoupon" placeholder="e.g. FLAT500" value="${esc(booking.coupon || "")}"><button type="button" class="btn btn-ghost dark btn-sm" id="bkApply">Apply</button></div>
          <div class="coupon-msg ${booking.coupon ? "ok" : ""}" id="couponMsg">${booking.coupon ? `🎉 ${esc(booking.coupon)} applied` : ""}</div>
          <div class="coupon-hints">${D.coupons.map((c) => `<button type="button" class="coupon-chip" data-coupon="${c.code}" title="${esc(c.label)}">${c.code}</button>`).join("")}</div>
        </div></div>`;
      $("#bkDate").addEventListener("change", (e) => { booking.date = e.target.value; booking.slot = ""; renderSlots(); });
      $("#bkName").addEventListener("input", (e) => booking.name = e.target.value);
      $("#bkPhone").addEventListener("input", (e) => booking.phone = e.target.value);
      $("#bkEmail").addEventListener("input", (e) => booking.email = e.target.value);
      $("#bkNotes").addEventListener("input", (e) => booking.notes = e.target.value);
      $("#bkApply").addEventListener("click", () => applyCoupon($("#bkCoupon").value));
      $$("[data-coupon]").forEach((b) => b.addEventListener("click", () => { $("#bkCoupon").value = b.dataset.coupon; applyCoupon(b.dataset.coupon); }));
      renderSlots();
    }

    else if (booking.step === 4) {
      if (next) next.textContent = "Confirm 🎉";
      const ev = eventById(booking.eventId);
      const vn = venueById(booking.venueId);
      const pr = priceBreakdown();
      const addList = selectedAddOnItems().map((it) => { const a = addOnById(it.id); return a ? `${a.name}${it.qty > 1 ? " ×" + it.qty : ""}` : ""; }).filter(Boolean);
      body.innerHTML = `<div class="bk-step">
        <h4>Review & pay</h4>
        <p class="hint">Confirm details below. Pay a small advance to lock your slot.</p>
        <div class="summary">
          <div class="summary-row"><span>Occasion</span><strong>${ev ? ev.emoji + " " + esc(ev.name) : "—"}</strong></div>
          <div class="summary-row"><span>Venue</span><strong>${vn ? esc(vn.name) : "—"}</strong></div>
          <div class="summary-row"><span>Guests</span><strong>${booking.guests || "—"}</strong></div>
          <div class="summary-row"><span>Date</span><strong>${esc(booking.date) || "—"}</strong></div>
          <div class="summary-row"><span>Slot</span><strong>${esc(booking.slot) || "—"}</strong></div>
          <div class="summary-row"><span>Add-ons</span><strong>${addList.length ? esc(addList.join(", ")) : "None"}</strong></div>
          <div class="summary-row"><span>Contact</span><strong>${esc(booking.name)} · ${esc(booking.phone)}</strong></div>
        </div>
        <div class="summary" style="margin-top:14px">
          <div class="summary-row"><span>Venue package</span><strong>${rupee(pr.venueCost)}</strong></div>
          <div class="summary-row"><span>Add-ons</span><strong>${rupee(pr.addOnsCost)}</strong></div>
          ${pr.discount ? `<div class="summary-row disc"><span>Coupon ${esc(booking.coupon)}</span><strong>− ${rupee(pr.discount)}</strong></div>` : ""}
          <div class="summary-row"><span>GST (${Math.round(D.brand.gstRate * 100)}%)</span><strong>${rupee(pr.gst)}</strong></div>
          <div class="summary-row summary-total"><span>Total</span><strong>${rupee(pr.total)}</strong></div>
          <div class="summary-row pay-row"><span>Pay now (advance ${D.brand.advancePercent}%)</span><strong>${rupee(pr.advance)}</strong></div>
          <div class="summary-row"><span>Balance at venue</span><strong>${rupee(pr.balance)}</strong></div>
        </div>
        <p class="hint" style="margin-top:14px">This is an estimate. Our team will call you on ${D.brand.phoneDisplay} to finalise.</p>
      </div>`;
    }

    // wire pickers
    $$("[data-pick]").forEach((opt) => opt.addEventListener("click", () => {
      const pick = opt.dataset.pick, id = opt.dataset.id;
      if (pick === "event") {
        booking.eventId = id;
        $$('[data-pick="event"]').forEach((o) => o.classList.toggle("selected", o.dataset.id === id));
      }
      if (pick === "venue") {
        booking.venueId = id;
        const v = venueById(id);
        booking.guests = v ? v.includesPeople : 0;
        $$('[data-pick="venue"]').forEach((o) => o.classList.toggle("selected", o.dataset.id === id));
        const gw = $("#guestWrap");
        if (gw && v) { gw.style.display = ""; $("#gCount").textContent = booking.guests; $("#guestHint").textContent = `${v.includesPeople} included, then ${rupee(v.extraPerPerson)}/extra guest (max ${v.maxPeople}).`; }
        updateTotal();
      }
    }));

    updateTotal();
  }

  function addOnRowHTML(a) {
    const qty = booking.addOns[a.id] || 0;
    const selected = qty > 0;
    return `<div class="opt addon-opt ${selected ? "selected" : ""}" data-addon="${a.id}">
      <span class="o-emoji"><span class="o-ic">${icon(a.icon)}</span></span>
      <div class="o-main"><div class="o-title">${esc(a.name)}</div><div class="o-sub">${esc(a.desc)} · ${rupee(a.price)} ${esc(a.unit)}</div></div>
      ${a.hasQty
        ? `<div class="qty ${selected ? "" : "hide"}" data-qty="${a.id}"><button type="button" data-qm="${a.id}">−</button><span id="q-${a.id}">${qty || 1}</span><button type="button" data-qp="${a.id}">+</button></div>`
        : ""}
      <span class="o-check">✓</span>
    </div>`;
  }
  function wireAddOnRows() {
    $$("[data-addon]").forEach((row) => {
      const id = row.dataset.addon;
      const a = addOnById(id);
      row.addEventListener("click", (e) => {
        if (e.target.closest("[data-qty]")) return; // don't toggle when using stepper
        const cur = booking.addOns[id] || 0;
        if (cur > 0) { delete booking.addOns[id]; }
        else { booking.addOns[id] = 1; }
        row.classList.toggle("selected", !!booking.addOns[id]);
        const q = row.querySelector("[data-qty]");
        if (q) q.classList.toggle("hide", !booking.addOns[id]);
        updateTotal();
      });
      if (a && a.hasQty) {
        const minus = row.querySelector(`[data-qm="${id}"]`);
        const plus = row.querySelector(`[data-qp="${id}"]`);
        const span = row.querySelector(`#q-${id}`);
        if (minus) minus.addEventListener("click", (e) => { e.stopPropagation(); const n = Math.max(1, (booking.addOns[id] || 1) - 1); booking.addOns[id] = n; span.textContent = n; updateTotal(); });
        if (plus) plus.addEventListener("click", (e) => { e.stopPropagation(); const n = Math.min(a.max || 10, (booking.addOns[id] || 1) + 1); booking.addOns[id] = n; span.textContent = n; if (!row.classList.contains("selected")) { row.classList.add("selected"); row.querySelector("[data-qty]").classList.remove("hide"); } updateTotal(); });
      }
    });
  }

  function wireGuestStepper() {
    const minus = $("#gMinus"), plus = $("#gPlus"), count = $("#gCount");
    if (!minus) return;
    minus.addEventListener("click", () => { const v = venueById(booking.venueId); if (!v) return; booking.guests = Math.max(1, booking.guests - 1); count.textContent = booking.guests; updateTotal(); });
    plus.addEventListener("click", () => { const v = venueById(booking.venueId); if (!v) return; booking.guests = Math.min(v.maxPeople, booking.guests + 1); count.textContent = booking.guests; updateTotal(); });
  }

  function renderSlots() {
    const row = $("#slotRow");
    if (!row) return;
    if (!booking.date) { row.innerHTML = `<p class="hint" style="width:100%">Pick a date to see available slots.</p>`; return; }
    const bookings = S.getBookings();
    const morning = P.availableSlots(D.slots.morning, booking.venueId, booking.date, bookings);
    const evening = P.availableSlots(D.slots.evening, booking.venueId, booking.date, bookings);
    const chip = (o) => `<button type="button" class="chip ${booking.slot === o.slot ? "selected" : ""} ${o.available ? "" : "disabled"}" data-slot="${o.slot}" ${o.available ? "" : "disabled"}>${o.slot}${o.available ? "" : " · booked"}</button>`;
    row.innerHTML =
      `<strong class="chip-label">Morning · 2 hr</strong>${morning.map(chip).join("")}` +
      `<strong class="chip-label">Evening · 1½ hr</strong>${evening.map(chip).join("")}`;
    $$("[data-slot]", row).forEach((c) => {
      if (c.disabled) return;
      c.addEventListener("click", () => { booking.slot = c.dataset.slot; $$("[data-slot]", row).forEach((x) => x.classList.toggle("selected", x.dataset.slot === booking.slot)); });
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
      if (!booking.slot) return toast("Please choose an available slot");
      if (!booking.name.trim()) return toast("Please enter your name");
      if (!P.isValidPhone(booking.phone)) return toast("Enter a valid 10-digit phone");
      if (!P.isValidEmail(booking.email)) return toast("Enter a valid email or leave it blank");
      // guard against double-booking
      if (!P.isSlotAvailable(booking.venueId, booking.date, booking.slot, S.getBookings())) {
        toast("Sorry, that slot was just taken. Pick another.");
        renderSlots();
        return;
      }
    }
    if (booking.step === 4) return confirmBooking();
    booking.step++;
    renderStep();
  }
  function prevStep() { if (booking.step > 1) { booking.step--; renderStep(); } }

  function confirmBooking() {
    const pr = priceBreakdown();
    const record = {
      ref: P.makeRef(Date.now()),
      occasion: booking.eventId, venue: booking.venueId, guests: booking.guests,
      date: booking.date, slot: booking.slot,
      addOns: Object.keys(booking.addOns).map((id) => ({ id, qty: booking.addOns[id] })),
      coupon: booking.coupon, pricing: pr,
      name: booking.name.trim(), phone: booking.phone.trim(), email: booking.email.trim(), notes: booking.notes.trim(),
      status: "requested", createdAt: new Date().toISOString(),
    };
    S.saveBooking(record);
    S.saveProfile({ name: record.name, phone: record.phone, email: record.email });

    $("#bkBody").innerHTML = `<div class="confirm-banner">
      <div class="big">🎉</div>
      <h4>Booking requested!</h4>
      <p>Reference <strong>#${esc(record.ref)}</strong></p>
      <p>Pay advance <strong>${rupee(pr.advance)}</strong> to confirm. Thank you, ${esc(record.name.split(" ")[0] || "there")}! Our team will call you shortly.</p>
    </div>`;
    $("#bkSteps").style.visibility = "hidden";
    $("#bkFoot").innerHTML = `<button class="btn btn-gold btn-lg" style="width:100%" id="bkDone">View My Bookings</button>`;
    $("#bkDone").addEventListener("click", () => { closeBooking(); restoreFoot(); navigate("bookings"); });
    launchConfetti(true);
    toast("Booking saved successfully 🎊");
    renderBookings();
  }

  function restoreFoot() {
    const foot = $("#bkFoot");
    foot.innerHTML = `<div class="estimate"><span>Estimated</span><strong id="bkTotal">₹0</strong></div>
      <div class="foot-btns"><button class="btn btn-ghost btn-sm" id="bkBack">Back</button><button class="btn btn-gold btn-sm" id="bkNext">Next</button></div>`;
    $("#bkBack").addEventListener("click", prevStep);
    $("#bkNext").addEventListener("click", nextStep);
  }

  /* ============================================================
     ENQUIRY FORM
     ============================================================ */
  function initEnquiry() {
    const form = $("#enquiryForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#enqName").value.trim();
      const phone = $("#enqPhone").value.trim();
      if (!name) return toast("Please enter your name");
      if (!P.isValidPhone(phone)) return toast("Enter a valid 10-digit phone");
      toast("Thanks " + name.split(" ")[0] + "! We'll call you soon 📞");
      form.reset();
    });
  }

  /* ============================================================
     ROUTER
     ============================================================ */
  const VIEWS = ["home", "occasions", "venues", "gallery", "bookings"];
  function navigate(route) { if (location.hash !== "#/" + route) location.hash = "#/" + route; else applyRoute(); }
  function applyRoute() {
    let route = (location.hash || "#/home").replace("#/", "");
    if (VIEWS.indexOf(route) === -1) route = "home";
    VIEWS.forEach((v) => { const el = $("#view-" + v); if (el) el.hidden = v !== route; });
    $$("[data-route]").forEach((a) => a.classList.toggle("active", a.dataset.route === route));
    if (route === "bookings") renderBookings();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ============================================================
     UI EFFECTS
     ============================================================ */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  const CONFETTI = ["#f4b740", "#d6336c", "#ff7aa2", "#69db7c", "#91a7ff", "#ffd87a"];
  function launchConfetti(burst) {
    const wrap = $(".hero-confetti");
    const host = burst ? document.body : wrap;
    if (!host) return;
    const count = burst ? 60 : 24;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "%";
      p.style.background = CONFETTI[i % CONFETTI.length];
      p.style.animationDuration = (3 + Math.random() * 3) + "s";
      p.style.animationDelay = (Math.random() * (burst ? 0.5 : 4)) + "s";
      p.style.width = (6 + Math.random() * 8) + "px";
      p.style.height = (10 + Math.random() * 8) + "px";
      host.appendChild(p);
      if (burst) setTimeout(() => p.remove(), 6000);
    }
  }

  function initReveal() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((el) => el.classList.add("in")); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$(".reveal").forEach((el) => obs.observe(el));
  }
  function initAppbar() {
    const bar = $("#appbar");
    window.addEventListener("scroll", () => bar.classList.toggle("scrolled", window.scrollY > 10));
  }

  /* ============================================================
     PWA
     ============================================================ */
  function initPWA() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      });
    }
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    renderOffers();
    renderStats();
    renderEvents();
    renderHow();
    renderVenues();
    renderServices();
    renderAddons();
    renderGallery();
    renderPackages();
    renderReviews();
    renderWhy();
    renderFaq();
    renderContact();
    initOccasionSearch();
    initEnquiry();
    $("#year").textContent = new Date().getFullYear();

    ["navBookBtn", "heroBookBtn", "bottomBookBtn"].forEach((id) => {
      const el = $("#" + id);
      if (el) el.addEventListener("click", () => openBooking());
    });
    restoreFoot();
    $$("[data-close]").forEach((el) => el.addEventListener("click", closeBooking));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBooking(); });

    window.addEventListener("hashchange", applyRoute);
    applyRoute();

    initReveal();
    initAppbar();
    launchConfetti(false);
    initPWA();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // expose for debugging / tests
  window.UTSAVA_APP = {
    openBooking, navigate, priceBreakdown,
    _booking: booking,
    _next: nextStep, _prev: prevStep, _render: renderStep,
    _confirm: confirmBooking, _applyRoute: applyRoute,
    _renderBookings: renderBookings,
  };
})();
