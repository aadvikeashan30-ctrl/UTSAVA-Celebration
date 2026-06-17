/* ============================================================
   UTSAVA Celebration — Domain Logic (pure functions)
   No DOM, no globals mutated. UMD: browser global + Node module.
   Centralises pricing, coupons and slot availability so the
   logic can be unit-tested independently of the UI.
   ============================================================ */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PRICING = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const round = (n) => Math.round(Number(n) || 0);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  /** Venue package cost = base + extra-guest charge. */
  function venueCost(venue, guests) {
    if (!venue) return 0;
    const g = Number(guests) || 0;
    const extra = Math.max(0, g - (venue.includesPeople || 0));
    return (venue.basePackage || 0) + extra * (venue.extraPerPerson || 0);
  }

  /**
   * Add-ons cost.
   * @param items array of { price, qty }
   */
  function addOnsCost(items) {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, it) => {
      const price = Number(it && it.price) || 0;
      const qty = Math.max(0, Number(it && it.qty) || 0);
      return sum + price * qty;
    }, 0);
  }

  /**
   * Coupon discount on a subtotal.
   * @param coupon { type:'flat'|'percent', value, min }
   * Returns 0 if coupon invalid or subtotal below minimum.
   */
  function couponDiscount(coupon, subtotal) {
    if (!coupon) return 0;
    const sub = Number(subtotal) || 0;
    if (sub < (coupon.min || 0)) return 0;
    if (coupon.type === "flat") return Math.min(round(coupon.value), sub);
    if (coupon.type === "percent") return round(sub * (coupon.value || 0) / 100);
    return 0;
  }

  function gst(amount, rate) {
    return round((Number(amount) || 0) * (Number(rate) || 0));
  }

  /**
   * Full price breakdown.
   * @param opts { venue, guests, addOnItems:[{price,qty}], coupon, gstRate, advancePercent }
   */
  function compute(opts) {
    opts = opts || {};
    const gstRate = opts.gstRate != null ? opts.gstRate : 0.18;
    const advancePercent = opts.advancePercent != null ? opts.advancePercent : 25;

    const vCost = venueCost(opts.venue, opts.guests);
    const aCost = addOnsCost(opts.addOnItems);
    const subtotal = vCost + aCost;
    const discount = couponDiscount(opts.coupon, subtotal);
    const taxable = Math.max(0, subtotal - discount);
    const tax = gst(taxable, gstRate);
    const total = taxable + tax;
    const advance = round(total * advancePercent / 100);
    const balance = Math.max(0, total - advance);

    return {
      venueCost: vCost,
      addOnsCost: aCost,
      subtotal,
      discount,
      taxable,
      gst: tax,
      total,
      advance,
      balance,
    };
  }

  /**
   * Returns slots that are still available for a venue on a date,
   * removing slots already taken by active bookings.
   * @param allSlots array of slot strings
   * @param venueId
   * @param date "YYYY-MM-DD"
   * @param bookings array of { venue, date, slot, status }
   */
  function availableSlots(allSlots, venueId, date, bookings) {
    const list = Array.isArray(allSlots) ? allSlots : [];
    const taken = new Set(
      (Array.isArray(bookings) ? bookings : [])
        .filter((b) => b && b.venue === venueId && b.date === date && b.status !== "cancelled")
        .map((b) => b.slot)
    );
    return list.map((slot) => ({ slot, available: !taken.has(slot) }));
  }

  function isSlotAvailable(venueId, date, slot, bookings) {
    return !(Array.isArray(bookings) ? bookings : []).some(
      (b) => b && b.venue === venueId && b.date === date && b.slot === slot && b.status !== "cancelled"
    );
  }

  /** Short unique booking reference. */
  function makeRef(now) {
    const t = (now || Date.now()).toString().slice(-6);
    return "UTS" + t;
  }

  /** Validate a 10-digit Indian mobile number. */
  function isValidPhone(phone) {
    return /^\d{10}$/.test(String(phone || "").trim());
  }

  /** Basic email check (optional field). */
  function isValidEmail(email) {
    const e = String(email || "").trim();
    if (!e) return true; // optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  return {
    round, clamp,
    venueCost, addOnsCost, couponDiscount, gst, compute,
    availableSlots, isSlotAvailable,
    makeRef, isValidPhone, isValidEmail,
  };
});
