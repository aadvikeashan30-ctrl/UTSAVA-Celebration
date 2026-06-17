/* ============================================================
   UTSAVA Celebration — Test Suite
   Run: node tests/pricing.test.js
   Uses Node's built-in assert (no external dependencies).
   ============================================================ */
"use strict";
const assert = require("assert");
const path = require("path");

const D = require(path.join(__dirname, "..", "js", "data.js"));
const P = require(path.join(__dirname, "..", "js", "pricing.js"));
const S = require(path.join(__dirname, "..", "js", "store.js"));

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  \u2713 " + name); }
  catch (e) { failed++; console.error("  \u2717 " + name + "\n      " + e.message); }
}
function section(t) { console.log("\n" + t); }

const theatre = D.venues.find((v) => v.id === "theater");
const hall = D.venues.find((v) => v.id === "hall");

/* ---------------- venueCost ---------------- */
section("venueCost");
test("base package for included guests", () => {
  assert.strictEqual(P.venueCost(theatre, 4), 1499);
  assert.strictEqual(P.venueCost(theatre, 1), 1499); // below included still base
});
test("adds per-extra-guest charge", () => {
  assert.strictEqual(P.venueCost(theatre, 6), 1499 + 2 * 200); // 1899
  assert.strictEqual(P.venueCost(hall, 60), 12000 + 10 * 150); // 13500
});
test("null venue -> 0", () => assert.strictEqual(P.venueCost(null, 5), 0));

/* ---------------- addOnsCost ---------------- */
section("addOnsCost");
test("sums price * qty", () => {
  assert.strictEqual(P.addOnsCost([{ price: 600, qty: 2 }, { price: 500, qty: 1 }]), 1700);
});
test("ignores invalid / zero qty", () => {
  assert.strictEqual(P.addOnsCost([{ price: 600, qty: 0 }, { price: 500 }]), 0);
  assert.strictEqual(P.addOnsCost(null), 0);
});

/* ---------------- couponDiscount ---------------- */
section("couponDiscount");
test("flat coupon", () => {
  const c = D.coupons.find((x) => x.code === "FLAT500");
  assert.strictEqual(P.couponDiscount(c, 2500), 500);
});
test("flat coupon gated by minimum", () => {
  const c = D.coupons.find((x) => x.code === "FLAT500");
  assert.strictEqual(P.couponDiscount(c, 1500), 0);
});
test("flat coupon capped at subtotal", () => {
  assert.strictEqual(P.couponDiscount({ type: "flat", value: 500, min: 0 }, 300), 300);
});
test("percent coupon", () => {
  const c = D.coupons.find((x) => x.code === "UTSAVA10");
  assert.strictEqual(P.couponDiscount(c, 2000), 200);
});
test("no coupon -> 0", () => assert.strictEqual(P.couponDiscount(null, 5000), 0));

/* ---------------- gst ---------------- */
section("gst");
test("18% rounded", () => {
  assert.strictEqual(P.gst(1000, 0.18), 180);
  assert.strictEqual(P.gst(1899, 0.18), 342); // 341.82 -> 342
});

/* ---------------- compute ---------------- */
section("compute (full breakdown)");
test("theatre, 6 guests, cake x2, FLAT500", () => {
  const r = P.compute({
    venue: theatre,
    guests: 6,
    addOnItems: [{ price: 600, qty: 2 }], // 1200
    coupon: D.coupons.find((c) => c.code === "FLAT500"),
    gstRate: 0.18,
    advancePercent: 25,
  });
  // venueCost 1899 + addOns 1200 = 3099 subtotal
  assert.strictEqual(r.venueCost, 1899);
  assert.strictEqual(r.addOnsCost, 1200);
  assert.strictEqual(r.subtotal, 3099);
  assert.strictEqual(r.discount, 500);           // >= 2000 so valid
  assert.strictEqual(r.taxable, 2599);
  assert.strictEqual(r.gst, Math.round(2599 * 0.18)); // 468
  assert.strictEqual(r.total, 2599 + 468);       // 3067
  assert.strictEqual(r.advance, Math.round(3067 * 0.25)); // 767
  assert.strictEqual(r.balance, 3067 - 767);     // 2300
});
test("no venue, no add-ons -> all zero", () => {
  const r = P.compute({});
  assert.strictEqual(r.subtotal, 0);
  assert.strictEqual(r.total, 0);
  assert.strictEqual(r.advance, 0);
  assert.strictEqual(r.balance, 0);
});
test("total never negative with big flat coupon", () => {
  const r = P.compute({ venue: theatre, guests: 4, addOnItems: [], coupon: { type: "flat", value: 99999, min: 0 } });
  assert.ok(r.total >= 0 && r.balance >= 0 && r.taxable >= 0);
});

/* ---------------- availability ---------------- */
section("availability");
const sampleBookings = [
  { venue: "theater", date: "2026-07-01", slot: "09:00 – 11:00", status: "confirmed" },
  { venue: "theater", date: "2026-07-01", slot: "11:00 – 13:00", status: "cancelled" },
  { venue: "hall",    date: "2026-07-01", slot: "09:00 – 11:00", status: "requested" },
];
test("availableSlots removes confirmed, keeps cancelled-free", () => {
  const res = P.availableSlots(D.slots.morning, "theater", "2026-07-01", sampleBookings);
  const map = {}; res.forEach((r) => (map[r.slot] = r.available));
  assert.strictEqual(map["09:00 – 11:00"], false); // taken
  assert.strictEqual(map["11:00 – 13:00"], true);  // cancelled -> free again
  assert.strictEqual(map["13:00 – 15:00"], true);
});
test("availability is per venue + date", () => {
  assert.strictEqual(P.isSlotAvailable("theater", "2026-07-02", "09:00 – 11:00", sampleBookings), true);
  assert.strictEqual(P.isSlotAvailable("hall", "2026-07-01", "09:00 – 11:00", sampleBookings), false);
});

/* ---------------- validators ---------------- */
section("validators");
test("phone validation", () => {
  assert.strictEqual(P.isValidPhone("9876543210"), true);
  assert.strictEqual(P.isValidPhone("12345"), false);
  assert.strictEqual(P.isValidPhone("98765abcde"), false);
});
test("email validation (optional)", () => {
  assert.strictEqual(P.isValidEmail(""), true);
  assert.strictEqual(P.isValidEmail("a@b.com"), true);
  assert.strictEqual(P.isValidEmail("nope"), false);
});
test("makeRef format", () => {
  const ref = P.makeRef(1700000000000);
  assert.ok(/^UTS\d{6}$/.test(ref), "ref should be UTS + 6 digits, got " + ref);
});

/* ---------------- data integrity ---------------- */
section("data integrity");
test("brand has gstRate and advancePercent", () => {
  assert.strictEqual(typeof D.brand.gstRate, "number");
  assert.strictEqual(typeof D.brand.advancePercent, "number");
});
test("every venue has required numeric fields", () => {
  D.venues.forEach((v) => {
    ["basePackage", "includesPeople", "extraPerPerson", "maxPeople"].forEach((k) =>
      assert.strictEqual(typeof v[k], "number", v.id + "." + k));
  });
});
test("every add-on has price and unique id", () => {
  const ids = new Set();
  D.addOns.forEach((a) => {
    assert.strictEqual(typeof a.price, "number", a.id);
    assert.ok(!ids.has(a.id), "duplicate add-on id " + a.id);
    ids.add(a.id);
  });
});
test("occasion ids unique", () => {
  const ids = new Set();
  D.events.forEach((e) => { assert.ok(!ids.has(e.id), "dup " + e.id); ids.add(e.id); });
});
test("every gallery tag has a matching filter", () => {
  const filters = new Set(D.galleryFilters.map((f) => f.id));
  D.gallery.forEach((g) => assert.ok(filters.has(g.tag), "no filter for tag " + g.tag));
});

/* ---------------- store (uses in-memory fallback in Node) ---------------- */
section("store");
test("save and read bookings", () => {
  const before = S.getBookings().length;
  S.saveBooking({ ref: "UTS000001", venue: "theater", date: "2026-07-09", slot: "09:00 – 11:00", status: "requested", pricing: { total: 1000 } });
  const after = S.getBookings();
  assert.strictEqual(after.length, before + 1);
  assert.strictEqual(after[0].ref, "UTS000001"); // unshifted to front
});
test("update booking status", () => {
  S.updateBookingStatus("UTS000001", "cancelled");
  const b = S.getBookings().find((x) => x.ref === "UTS000001");
  assert.strictEqual(b.status, "cancelled");
});
test("toggle favourite", () => {
  const on = S.toggleFavourite("theater");
  assert.strictEqual(on, true);
  assert.strictEqual(S.isFavourite("theater"), true);
  const off = S.toggleFavourite("theater");
  assert.strictEqual(off, false);
});
test("profile save/get", () => {
  S.saveProfile({ name: "Test", phone: "9876543210", email: "t@e.com" });
  assert.strictEqual(S.getProfile().name, "Test");
});

/* ---------------- summary ---------------- */
console.log("\n----------------------------------------");
console.log(`  ${passed} passed, ${failed} failed`);
console.log("----------------------------------------");
process.exit(failed ? 1 : 0);
