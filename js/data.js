/* ============================================================
   UTSAVA Celebration — App Data Layer
   All content sourced from the project requirements.
   ============================================================ */

const UTSAVA = {
  brand: {
    name: "UTSAVA",
    tagline: "Celebration",
    motto: "Where every moment becomes a memory",
    phone: "8884000556",
    phoneDisplay: "+91 88840 00556",
    email: "utsavcelebration@gmail.com",
    location: "Bingetown, Bangalore",
    address: "Bingetown, Bengaluru, Karnataka, India",
    hours: "Open all 7 days · 9:00 AM – 11:00 PM",
  },

  // 1) Core services offered
  services: [
    { icon: "hall",     name: "Banquet Hall",        desc: "Spacious, air-conditioned halls for gatherings of every size." },
    { icon: "decor",    name: "Decoration",          desc: "Bespoke themes crafted to match your celebration." },
    { icon: "flower",   name: "Flower Decoration",   desc: "Fresh floral arrangements, garlands and stage backdrops." },
    { icon: "balloon",  name: "Balloon Decoration",  desc: "Playful balloon arches, columns and ceiling installs." },
    { icon: "light",    name: "Lighting",            desc: "Ambient, fairy and stage lighting to set the mood." },
    { icon: "sound",    name: "Sound Systems",       desc: "Crisp audio, mics and DJ-ready setups." },
    { icon: "catering", name: "Catering",            desc: "Multi-cuisine menus, live counters and desserts." },
  ],

  // Event types we plan
  events: [
    { id: "birthday",    name: "Birthday",             emoji: "🎂", blurb: "Joyful birthdays for all ages, themed your way.", base: 8000 },
    { id: "marriage",    name: "Marriage",             emoji: "💍", blurb: "Grand weddings with end-to-end planning.",        base: 50000 },
    { id: "oldage",      name: "Old Age Party",        emoji: "🌼", blurb: "Warm get-togethers honouring our elders.",       base: 10000 },
    { id: "anniversary", name: "Marriage Anniversary", emoji: "❤️", blurb: "Celebrate years of togetherness in style.",      base: 12000 },
    { id: "naming",      name: "Naming Ceremony",      emoji: "🍼", blurb: "Traditional naming ceremonies & cradle decor.",  base: 9000 },
    { id: "sendoff",     name: "Send-off",             emoji: "🎓", blurb: "Memorable farewells & send-off parties.",        base: 8000 },
  ],

  // Venues — Theater (intimate) & Hall (large)
  venues: [
    {
      id: "theater",
      name: "The Theater",
      capacity: "Up to 50 guests",
      size: "5 m stage hall",
      desc: "An intimate, screen-equipped space — ideal for small gatherings, naming ceremonies and birthdays.",
      perHour: 1500,
      tags: ["Intimate", "Projector", "AC"],
    },
    {
      id: "hall",
      name: "The Grand Hall",
      capacity: "Up to 350 guests",
      size: "35 m banquet hall",
      desc: "Our flagship banquet hall for weddings, anniversaries and large celebrations.",
      perHour: 4000,
      tags: ["Spacious", "Stage", "Parking", "AC"],
    },
  ],

  // Optional add-ons
  addOns: [
    { id: "cake",       name: "Cakes",                 icon: "cake",  desc: "Custom designer cakes, any flavour.",          price: 2000 },
    { id: "photo",      name: "Photo Shooting",        icon: "cam",   desc: "Professional photo & video coverage.",         price: 6000 },
    { id: "extradecor", name: "Additional Decoration", icon: "spark", desc: "Extra themed decor & premium upgrades.",       price: 4000 },
  ],

  // Booking packages (from requirements)
  packages: [
    { id: "morning",  name: "Morning Slot",  window: "9:00 AM – 4:00 PM",  slot: "2 hour slots",      note: "Best for daytime functions" },
    { id: "evening",  name: "Evening Slot",  window: "4:00 PM – 11:00 PM", slot: "1½ hour slots",     note: "Perfect for evening parties" },
    { id: "hourly",   name: "Hourly (Big Hall)", window: "Flexible hours", slot: "Pay per hour",      note: "Grand Hall, billed hourly" },
    { id: "halfday",  name: "Half Day",      window: "Up to 6 hours",      slot: "Half-day package",  note: "Great value for big events" },
  ],

  // Pre-defined bookable time slots derived from the rules:
  //   9 AM – 4 PM  -> 2 hour slots
  //   4 PM – 11 PM -> 1.5 hour slots
  slots: {
    morning: ["09:00 – 11:00", "11:00 – 13:00", "13:00 – 15:00"],
    evening: ["16:00 – 17:30", "17:30 – 19:00", "19:00 – 20:30", "20:30 – 22:00", "22:00 – 23:00"],
  },

  // Gallery cards use CSS gradients (no external images needed)
  gallery: [
    { title: "Wedding Mandap", theme: "g-rose" },
    { title: "Balloon Arch",   theme: "g-violet" },
    { title: "Floral Stage",   theme: "g-green" },
    { title: "Birthday Theme", theme: "g-amber" },
    { title: "Naming Cradle",  theme: "g-teal" },
    { title: "Stage Lighting", theme: "g-indigo" },
  ],

  // Why choose us
  highlights: [
    { icon: "calendar", title: "Open 7 Days",      text: "9 AM to 11 PM, every single day." },
    { icon: "shield",   title: "End-to-End",       text: "From decor to dinner, we handle it all." },
    { icon: "star",     title: "Custom Themes",    text: "Tailored to your taste and budget." },
    { icon: "heart",    title: "Trusted Team",     text: "Experienced planners in Bangalore." },
  ],
};
