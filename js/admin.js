/* ============================================================
   UTSAVA Celebration — Admin Dashboard
   Bookings ops · revenue & booking analytics · lead CRM ·
   vendor / staff management. PIN-gated (demo).
   Depends on globals: UTSAVA (data), STORE, PRICING.
   ============================================================ */
(function () {
  "use strict";

  const D = window.UTSAVA;
  const S = window.STORE;

  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rupee = (n) => "₹" + Number(Math.round(n || 0)).toLocaleString("en-IN");

  const eventById = (id) => (D.events || []).find((e) => e.id === id);
  const venueById = (id) => (D.venues || []).find((v) => v.id === id);

  const STATUS = ["requested", "confirmed", "completed", "cancelled"];
  const STATUS_LABEL = { requested: "Requested", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" };

  let host = null;
  const state = { authed: false, tab: "overview" };

  function isAuthed() {
    if (state.authed) return true;
    try { if (sessionStorage.getItem("utsava_admin") === "1") { state.authed = true; return true; } } catch (e) {}
    return false;
  }
  function setAuthed(v) {
    state.authed = v;
    try { v ? sessionStorage.setItem("utsava_admin", "1") : sessionStorage.removeItem("utsava_admin"); } catch (e) {}
  }

  /* ---------------- analytics ---------------- */
  function analytics() {
    const bookings = S.getBookings();
    const active = bookings.filter((b) => b.status !== "cancelled");
    const revenue = active.reduce((s, b) => s + ((b.pricing && b.pricing.total) || 0), 0);
    const collected = bookings.reduce((s, b) => s + ((b.payment && b.payment.paid ? (b.payment.amount || (b.pricing && b.pricing.advance) || 0) : 0)), 0);
    const pending = active.reduce((s, b) => {
      const total = (b.pricing && b.pricing.total) || 0;
      const paid = (b.payment && b.payment.paid) ? (b.payment.amount || (b.pricing && b.pricing.advance) || 0) : 0;
      return s + Math.max(0, total - paid);
    }, 0);

    const byOccasion = {};
    active.forEach((b) => { const k = (eventById(b.occasion) || {}).name || b.occasion || "Other"; byOccasion[k] = (byOccasion[k] || 0) + 1; });

    const byMonth = {};
    active.forEach((b) => {
      const d = b.date || (b.createdAt || "").slice(0, 10);
      const m = (d || "").slice(0, 7) || "—";
      byMonth[m] = (byMonth[m] || 0) + ((b.pricing && b.pricing.total) || 0);
    });

    const leads = S.getLeads() || [];
    const won = leads.filter((l) => l.stage === "won").length;
    const conv = leads.length ? Math.round((won / leads.length) * 100) : 0;

    const todayStr = new Date().toISOString().slice(0, 10);
    const upcoming = active.filter((b) => (b.date || "") >= todayStr).length;

    return { bookings, active, revenue, collected, pending, byOccasion, byMonth, leads, conv, won, upcoming };
  }

  /* ---------------- views ---------------- */
  function loginHTML() {
    return `<div class="admin-login">
      <div class="admin-login-card">
        <img src="icons/logo.svg" alt="" width="72" height="72" />
        <h3>Admin Access</h3>
        <p class="hint">Enter the staff PIN to open the dashboard.</p>
        <input type="password" id="adminPin" inputmode="numeric" placeholder="• • • •" maxlength="8" autocomplete="off" />
        <button class="btn btn-gold" id="adminLoginBtn">Unlock dashboard</button>
        <p class="hint" style="margin-top:10px">Demo PIN: <strong>${esc(D.brand.adminPin)}</strong></p>
      </div>
    </div>`;
  }

  function bar(map, fmt) {
    const entries = Object.entries(map);
    if (!entries.length) return `<p class="hint">No data yet.</p>`;
    const max = Math.max.apply(null, entries.map((e) => e[1])) || 1;
    return `<div class="adm-bars">${entries.map(([k, v]) => `
      <div class="adm-bar-row">
        <span class="adm-bar-lbl">${esc(k)}</span>
        <span class="adm-bar-track"><span class="adm-bar-fill" style="width:${Math.max(6, (v / max) * 100)}%"></span></span>
        <span class="adm-bar-val">${fmt ? fmt(v) : v}</span>
      </div>`).join("")}</div>`;
  }

  function overviewHTML() {
    const a = analytics();
    const cards = [
      { label: "Revenue (active)", value: rupee(a.revenue), ic: "📈" },
      { label: "Advance collected", value: rupee(a.collected), ic: "💰" },
      { label: "Balance pending", value: rupee(a.pending), ic: "⏳" },
      { label: "Bookings", value: a.active.length, ic: "🧾" },
      { label: "Upcoming events", value: a.upcoming, ic: "📅" },
      { label: "Lead conversion", value: a.conv + "%", ic: "🎯" },
    ];
    return `<div class="adm-kpis">${cards.map((c) => `
      <div class="adm-kpi"><span class="adm-kpi-ic">${c.ic}</span><div><strong>${c.value}</strong><span>${esc(c.label)}</span></div></div>`).join("")}</div>
      <div class="adm-grid2">
        <div class="adm-panel"><h4>Bookings by occasion</h4>${bar(a.byOccasion)}</div>
        <div class="adm-panel"><h4>Revenue by month</h4>${bar(a.byMonth, rupee)}</div>
      </div>`;
  }

  function bookingsHTML() {
    const list = S.getBookings();
    if (!list.length) return `<div class="adm-panel"><p class="hint">No bookings yet.</p></div>`;
    return `<div class="adm-panel adm-tablewrap"><table class="adm-table">
      <thead><tr><th>Ref</th><th>Occasion</th><th>Venue</th><th>Date / Slot</th><th>Guest</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
      <tbody>${list.map((b) => {
        const ev = eventById(b.occasion), vn = venueById(b.venue);
        const paid = b.payment && b.payment.paid;
        return `<tr>
          <td>#${esc(b.ref)}</td>
          <td>${ev ? ev.emoji + " " + esc(ev.name) : "—"}</td>
          <td>${vn ? esc(vn.name) : "—"}</td>
          <td>${esc(b.date || "—")}<br><small>${esc(b.slot || "")}</small></td>
          <td>${esc(b.name || "—")}<br><small>${esc(b.phone || "")}</small></td>
          <td>${rupee(b.pricing ? b.pricing.total : 0)}</td>
          <td>${paid ? `<span class="adm-pill ok">Paid ${rupee(b.payment.amount || 0)}</span>` : `<span class="adm-pill">Unpaid</span>`}</td>
          <td><select class="adm-select" data-status="${esc(b.ref)}">${STATUS.map((s) => `<option value="${s}" ${b.status === s ? "selected" : ""}>${STATUS_LABEL[s]}</option>`).join("")}</select></td>
        </tr>`;
      }).join("")}</tbody>
    </table></div>`;
  }

  function leadsHTML() {
    const leads = S.getLeads() || [];
    const stages = D.leadStages || [];
    if (!leads.length) return `<div class="adm-panel"><p class="hint">No leads yet.</p></div>`;
    return `<div class="adm-leadgrid">${leads.map((l) => `
      <div class="adm-lead">
        <div class="adm-lead-top"><strong>${esc(l.name)}</strong><span class="adm-stage adm-stage-${esc(l.stage)}">${esc((stages.find((s) => s.id === l.stage) || {}).label || l.stage)}</span></div>
        <div class="adm-lead-meta">📞 ${esc(l.phone)} ${l.occasion ? "· 🎉 " + esc(l.occasion) : ""}</div>
        <p class="adm-lead-msg">${esc(l.message || "")}</p>
        <div class="adm-lead-foot">
          <a class="btn btn-ghost dark btn-sm" href="tel:${esc(l.phone)}">Call</a>
          <a class="btn btn-ghost dark btn-sm" href="https://wa.me/91${esc(l.phone)}" target="_blank" rel="noopener">WhatsApp</a>
          <select class="adm-select" data-lead="${esc(l.id)}">${stages.map((s) => `<option value="${s.id}" ${l.stage === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}</select>
        </div>
      </div>`).join("")}</div>`;
  }

  function vendorsHTML() {
    const vendors = S.getVendors() || [];
    if (!vendors.length) return `<div class="adm-panel"><p class="hint">No vendors yet.</p></div>`;
    return `<div class="adm-vendgrid">${vendors.map((v) => `
      <div class="adm-vendor ${v.status === "active" ? "" : "off"}">
        <div class="adm-vend-top"><strong>${esc(v.name)}</strong><span class="adm-pill ${v.status === "active" ? "ok" : ""}">${v.status === "active" ? "Active" : "On leave"}</span></div>
        <div class="adm-lead-meta">${esc(v.role)} · ★ ${esc(v.rating)} · ${esc(v.jobs)} jobs</div>
        <div class="adm-lead-foot">
          <a class="btn btn-ghost dark btn-sm" href="tel:${esc(v.phone)}">Call</a>
          <button class="btn btn-ghost dark btn-sm" data-vendor="${esc(v.id)}">${v.status === "active" ? "Set on leave" : "Set active"}</button>
        </div>
      </div>`).join("")}</div>`;
  }

  function dashboardHTML() {
    const tabs = [
      { id: "overview", label: "Overview" },
      { id: "bookings", label: "Bookings" },
      { id: "leads", label: "Lead CRM" },
      { id: "vendors", label: "Vendors" },
    ];
    let body = "";
    if (state.tab === "overview") body = overviewHTML();
    else if (state.tab === "bookings") body = bookingsHTML();
    else if (state.tab === "leads") body = leadsHTML();
    else if (state.tab === "vendors") body = vendorsHTML();
    return `<div class="admin-head">
        <div><span class="kicker">Control centre</span><h2>Admin Dashboard</h2></div>
        <button class="btn btn-ghost dark btn-sm" id="adminLogout">Lock</button>
      </div>
      <div class="adm-tabs">${tabs.map((t) => `<button class="adm-tab ${state.tab === t.id ? "active" : ""}" data-tab="${t.id}">${t.label}</button>`).join("")}</div>
      <div class="adm-body">${body}</div>`;
  }

  function wire() {
    if (!host) return;
    if (!isAuthed()) {
      const btn = $("#adminLoginBtn", host);
      const pin = $("#adminPin", host);
      const tryLogin = () => {
        if (pin && pin.value.trim() === String(D.brand.adminPin)) { setAuthed(true); render(host); }
        else { window.UTSAVA_APP && window.UTSAVA_APP.toast ? window.UTSAVA_APP.toast("Incorrect PIN") : alert("Incorrect PIN"); }
      };
      if (btn) btn.addEventListener("click", tryLogin);
      if (pin) pin.addEventListener("keydown", (e) => { if (e.key === "Enter") tryLogin(); });
      return;
    }
    const logout = $("#adminLogout", host);
    if (logout) logout.addEventListener("click", () => { setAuthed(false); render(host); });
    $$(".adm-tab", host).forEach((t) => t.addEventListener("click", () => { state.tab = t.dataset.tab; render(host); }));
    $$("[data-status]", host).forEach((sel) => sel.addEventListener("change", () => {
      S.updateBookingStatus(sel.dataset.status, sel.value);
      window.UTSAVA_APP && window.UTSAVA_APP.toast && window.UTSAVA_APP.toast("Booking " + sel.value);
      render(host);
    }));
    $$("[data-lead]", host).forEach((sel) => sel.addEventListener("change", () => {
      S.updateLeadStage(sel.dataset.lead, sel.value); render(host);
    }));
    $$("[data-vendor]", host).forEach((btn) => btn.addEventListener("click", () => {
      S.toggleVendorStatus(btn.dataset.vendor); render(host);
    }));
  }

  function render(container) {
    host = container || host || $("#adminRoot");
    if (!host) return;
    // seed CRM + vendors on first open
    S.seedLeadsIfEmpty(D.seedLeads || []);
    S.seedVendorsIfEmpty(D.vendors || []);
    host.innerHTML = isAuthed() ? dashboardHTML() : loginHTML();
    wire();
  }

  window.ADMIN = { render };
})();
