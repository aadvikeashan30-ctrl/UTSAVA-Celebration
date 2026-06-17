/* ============================================================
   UTSAVA Celebration — DOM Smoke Test
   Runs app.js end-to-end against a minimal DOM stub (no jsdom).
   Verifies the app initialises and the full booking flow runs
   through all 4 steps + confirmation without throwing, and that
   the saved booking matches the pricing engine.
   Run: node tests/dom-smoke.test.js
   ============================================================ */
"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  \u2713 " + name); }
  catch (e) { failed++; console.error("  \u2717 " + name + "\n      " + (e && e.stack || e)); }
}

/* ---------- minimal DOM stub ---------- */
function makeEl() {
  const el = {
    style: {}, dataset: {}, _html: "", textContent: "", value: "",
    hidden: false, href: "", disabled: false, checked: false,
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, removeEventListener() {},
    setAttribute() {}, getAttribute() { return null; },
    appendChild() {}, removeChild() {}, remove() {}, focus() {}, reset() {},
    querySelector() { return makeEl(); },
    querySelectorAll() { return []; },
    closest() { return null; },
  };
  Object.defineProperty(el, "innerHTML", { get() { return el._html; }, set(v) { el._html = v; } });
  return el;
}

const documentStub = {
  readyState: "complete",
  body: makeEl(),
  addEventListener() {},
  removeEventListener() {},
  createElement() { return makeEl(); },
  querySelector() { return makeEl(); },
  querySelectorAll() { return []; },
};

let _hash = "";
const windowStub = {
  get location() { return { get hash() { return _hash; }, set hash(v) { _hash = v; } }; },
  addEventListener() {}, removeEventListener() {},
  scrollTo() {}, scrollY: 0,
  navigator: {},            // no serviceWorker -> PWA init skipped
  setTimeout, clearTimeout,
};

// wire globals app.js relies on
global.window = windowStub;
global.document = documentStub;
global.location = windowStub.location;
global.setTimeout = setTimeout;
global.clearTimeout = clearTimeout;
// note: `navigator` is a built-in read-only global in Node 22 (no serviceWorker),
// so app.js's PWA registration is safely skipped.

// data/pricing/store export via module; expose on window as the browser would
windowStub.UTSAVA = require(path.join(__dirname, "..", "js", "data.js"));
windowStub.PRICING = require(path.join(__dirname, "..", "js", "pricing.js"));
windowStub.STORE = require(path.join(__dirname, "..", "js", "store.js"));

/* ---------- load & run app.js ---------- */
console.log("\nDOM smoke test");
test("app.js initialises without throwing", () => {
  const code = fs.readFileSync(path.join(__dirname, "..", "js", "app.js"), "utf8");
  // eval in this scope where window/document/etc are globals
  eval(code);
  assert.ok(windowStub.UTSAVA_APP, "UTSAVA_APP should be exposed");
});

const APP = windowStub.UTSAVA_APP;
const D = windowStub.UTSAVA;
const P = windowStub.PRICING;
const S = windowStub.STORE;

test("router applies all routes without throwing", () => {
  ["home", "occasions", "venues", "gallery", "bookings"].forEach((r) => {
    _hash = "#/" + r;
    APP._applyRoute();
  });
  _hash = "#/unknown";
  APP._applyRoute(); // should fall back to home
});

test("openBooking renders step 1", () => {
  APP.openBooking();
  assert.strictEqual(APP._booking.step, 1);
});

test("full booking flow steps 1->4 without throwing", () => {
  APP.openBooking("birthday", "theater");
  const b = APP._booking;
  assert.strictEqual(b.eventId, "birthday");
  assert.strictEqual(b.venueId, "theater");
  assert.strictEqual(b.guests, 4); // theatre includes 4

  // step 1 -> 2
  APP._next();
  assert.strictEqual(b.step, 2);

  // customise: 6 guests + cake x2
  b.guests = 6;
  b.addOns = { cake: 2 };
  APP._next();
  assert.strictEqual(b.step, 3);

  // date/slot/contact + coupon
  b.date = "2026-08-15";
  b.slot = "17:30 – 19:00";
  b.name = "Test User";
  b.phone = "9876543210";
  b.email = "test@example.com";
  b.coupon = "FLAT500";
  APP._next();
  assert.strictEqual(b.step, 4);
});

test("priceBreakdown matches pricing engine for current state", () => {
  const pr = APP.priceBreakdown();
  const expected = P.compute({
    venue: D.venues.find((v) => v.id === "theater"),
    guests: 6,
    addOnItems: [{ id: "cake", price: 600, qty: 2 }],
    coupon: D.coupons.find((c) => c.code === "FLAT500"),
    gstRate: D.brand.gstRate,
    advancePercent: D.brand.advancePercent,
  });
  assert.deepStrictEqual(pr, expected);
  assert.strictEqual(pr.subtotal, 1899 + 1200);
});

test("confirm saves booking with status requested", () => {
  const before = S.getBookings().length;
  APP._confirm();
  const all = S.getBookings();
  assert.strictEqual(all.length, before + 1);
  const saved = all[0];
  assert.strictEqual(saved.status, "requested");
  assert.strictEqual(saved.occasion, "birthday");
  assert.strictEqual(saved.venue, "theater");
  assert.strictEqual(saved.guests, 6);
  assert.ok(/^UTS\d{6}$/.test(saved.ref));
  assert.ok(saved.pricing && saved.pricing.total > 0);
});

test("booked slot becomes unavailable afterwards", () => {
  const avail = P.isSlotAvailable("theater", "2026-08-15", "17:30 – 19:00", S.getBookings());
  assert.strictEqual(avail, false);
});

test("renderBookings runs with data present", () => {
  APP._renderBookings();
});

console.log("\n----------------------------------------");
console.log(`  ${passed} passed, ${failed} failed`);
console.log("----------------------------------------");
process.exit(failed ? 1 : 0);
