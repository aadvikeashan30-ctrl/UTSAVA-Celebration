/* ============================================================
   UTSAVA Celebration — Persistence (localStorage wrapper)
   Safe read/write with try/catch fallbacks so the app keeps
   working even if storage is unavailable (private mode, etc.).
   ============================================================ */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.STORE = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const KEYS = {
    bookings: "utsava_bookings",
    favourites: "utsava_favourites",
    profile: "utsava_profile",
    leads: "utsava_leads",
    vendors: "utsava_vendors",
  };

  const mem = {}; // in-memory fallback

  function ls() {
    try { return typeof localStorage !== "undefined" ? localStorage : null; }
    catch (e) { return null; }
  }

  function read(key, fallback) {
    const store = ls();
    try {
      const raw = store ? store.getItem(key) : mem[key];
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  function write(key, value) {
    const store = ls();
    const raw = JSON.stringify(value);
    try { if (store) store.setItem(key, raw); else mem[key] = raw; }
    catch (e) { mem[key] = raw; }
    return value;
  }

  /* ---- Bookings ---- */
  function getBookings() { return read(KEYS.bookings, []); }
  function saveBooking(booking) {
    const all = getBookings();
    all.unshift(booking);
    return write(KEYS.bookings, all);
  }
  function updateBookingStatus(ref, status) {
    const all = getBookings().map((b) => (b.ref === ref ? Object.assign({}, b, { status }) : b));
    return write(KEYS.bookings, all);
  }
  /** Patch arbitrary fields on a booking (e.g. payment, milestone). */
  function patchBooking(ref, patch) {
    const all = getBookings().map((b) => (b.ref === ref ? Object.assign({}, b, patch || {}) : b));
    return write(KEYS.bookings, all);
  }

  /* ---- Leads / CRM ---- */
  function getLeads() { return read(KEYS.leads, null); }
  function seedLeadsIfEmpty(seed) {
    if (getLeads() == null) write(KEYS.leads, Array.isArray(seed) ? seed.slice() : []);
    return getLeads() || [];
  }
  function addLead(lead) {
    const all = getLeads() || [];
    all.unshift(lead);
    return write(KEYS.leads, all);
  }
  function updateLeadStage(id, stage) {
    const all = (getLeads() || []).map((l) => (l.id === id ? Object.assign({}, l, { stage }) : l));
    return write(KEYS.leads, all);
  }

  /* ---- Vendors ---- */
  function getVendors() { return read(KEYS.vendors, null); }
  function seedVendorsIfEmpty(seed) {
    if (getVendors() == null) write(KEYS.vendors, Array.isArray(seed) ? seed.slice() : []);
    return getVendors() || [];
  }
  function toggleVendorStatus(id) {
    const all = (getVendors() || []).map((v) =>
      v.id === id ? Object.assign({}, v, { status: v.status === "active" ? "onleave" : "active" }) : v);
    return write(KEYS.vendors, all);
  }

  /* ---- Favourites (venue ids) ---- */
  function getFavourites() { return read(KEYS.favourites, []); }
  function isFavourite(id) { return getFavourites().indexOf(id) !== -1; }
  function toggleFavourite(id) {
    const favs = getFavourites();
    const i = favs.indexOf(id);
    if (i === -1) favs.push(id); else favs.splice(i, 1);
    write(KEYS.favourites, favs);
    return favs.indexOf(id) !== -1;
  }

  /* ---- Profile (remember name/phone/email) ---- */
  function getProfile() { return read(KEYS.profile, { name: "", phone: "", email: "" }); }
  function saveProfile(p) { return write(KEYS.profile, p); }

  return {
    KEYS,
    getBookings, saveBooking, updateBookingStatus, patchBooking,
    getFavourites, isFavourite, toggleFavourite,
    getProfile, saveProfile,
    getLeads, seedLeadsIfEmpty, addLead, updateLeadStage,
    getVendors, seedVendorsIfEmpty, toggleVendorStatus,
  };
});
