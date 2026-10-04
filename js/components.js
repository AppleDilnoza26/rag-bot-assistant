/* Culinary House — core helpers and HTML templates for the header, footer and every section. */
(function () {
  "use strict";

  var D = window.CH_DATA;
  var I18N = window.CH_I18N;

  /* ---------- Core state & helpers ---------- */
  function readStore(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
  }

  var CH = window.CH = {
    data: D,
    state: {
      lang: readStore("ch-lang", "ru") === "uz" ? "uz" : "ru",
      courseFilter: "all",
      galleryFilter: "all",
      faqOpen: 0,
      cal: { month: null, selected: null }
    },
    page: document.body.getAttribute("data-page") || "index",
    tpl: {}
  };

  CH.t = function (path, vars) {
    var parts = path.split(".");
    var v = I18N[CH.state.lang];
    for (var i = 0; i < parts.length && v != null; i++) v = v[parts[i]];
    if (v == null) {
      v = I18N.ru;
      for (var j = 0; j < parts.length && v != null; j++) v = v[parts[j]];
    }
    if (v == null) return path;
    if (typeof v === "string" && vars) {
      v = v.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    }
    return v;
  };

  CH.L = function (obj) {
    if (obj == null) return "";
    if (typeof obj !== "object" || Array.isArray(obj)) return obj;
    return obj[CH.state.lang] != null ? obj[CH.state.lang] : obj.ru;
  };

  CH.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  CH.plural = function (n, forms) {
    if (CH.state.lang !== "ru") return forms[0];
    var a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5) return forms[1];
    if (b === 1) return forms[0];
    return forms[2];
  };

  CH.num = function (n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  };

  CH.money = function (n) {
    return CH.num(n) + "\u00a0" + CH.t("ui.currency");
  };

  CH.monthly = function (price, months) {
    return Math.ceil(price / months / 1000) * 1000;
  };

  CH.course = function (id) {
    for (var i = 0; i < D.courses.length; i++) if (D.courses[i].id === id) return D.courses[i];
    return null;
  };

  CH.teacher = function (id) {
    for (var i = 0; i < D.teachers.length; i++) if (D.teachers[i].id === id) return D.teachers[i];
    return null;
  };

  CH.duration = function (c) {
    var ui = CH.t("ui");
    return c.lessons + "\u00a0" + CH.plural(c.lessons, ui.lesson) + " · " + c.weeks + "\u00a0" + CH.plural(c.weeks, ui.week);
  };

  CH.isoDate = function (d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  };

  CH.parseISO = function (s) {
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  };

  CH.fmtDate = function (d, withWeekday) {
    var c = CH.t("calendar");
    var s = CH.state.lang === "ru"
      ? d.getDate() + " " + c.monthsGen[d.getMonth()]
      : d.getDate() + "-" + c.monthsGen[d.getMonth()];
    if (withWeekday) s += ", " + c.weekdaysFull[d.getDay()];
    return s;
  };

  /* Launch list with real dates, sorted. */
  (function buildLaunches() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    CH.today = today;
    CH.launches = D.launches.map(function (l) {
      var d = new Date(today);
      d.setDate(d.getDate() + l.offset);
      return { course: l.course, date: d, key: CH.isoDate(d), time: l.time, seats: l.seats, total: l.total };
    }).sort(function (a, b) { return a.date - b.date; });
  })();

  CH.nextLaunch = function (courseId) {
    for (var i = 0; i < CH.launches.length; i++) if (CH.launches[i].course === courseId) return CH.launches[i];
    return null;
  };

  CH.bookHref = function () {
    return document.querySelector('[data-section="booking"]') ? "#booking" : "contacts.html#booking";
  };

  /* ---------- Icons ---------- */
  function svg(path, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || "") + ">" + path + "</svg>";
  }
  var I = CH.icons = {
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M7 13.2A3.2 3.2 0 0 1 7.6 6.9 4.6 4.6 0 0 1 12 4a4.6 4.6 0 0 1 4.4 2.9A3.2 3.2 0 0 1 17 13.2V18H7z"/><path d="M7 15.5h10M7 20.5h10" stroke-linecap="round"/></svg>',
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    check: svg('<path d="m5 12.5 4.2 4.2L19 7"/>'),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    calendar: svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    user: svg('<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>'),
    users: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>'),
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',
    close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
    left: svg('<path d="m15 5-7 7 7 7"/>'),
    right: svg('<path d="m9 5 7 7-7 7"/>'),
    up: svg('<path d="m5 15 7-7 7 7"/>'),
    zoom: svg('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2M11 8v6M8 11h6"/>'),
    phone: svg('<path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z"/>'),
    pin: svg('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    telegram: svg('<path d="M21 4.5 2.8 11.4c-.9.4-.9 1.6.1 1.9l4.6 1.4 1.8 5.4c.3.8 1.3 1 1.9.4l2.6-2.5 4.8 3.5c.7.5 1.7.1 1.9-.7L22.3 5.8c.2-1-.6-1.7-1.3-1.3z"/><path d="m7.5 14.7 9.5-6.2-7 7.4"/>'),
    instagram: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".8" fill="currentColor"/>'),
    sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>', ' class="i-sun"'),
    moon: svg('<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>', ' class="i-moon"'),
    medal: svg('<circle cx="12" cy="14.5" r="5.5"/><path d="m8.5 10-3-7h4l2.5 5M15.5 10l3-7h-4L12 8"/><path d="m12 12 .9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" fill="currentColor" stroke="none"/>'),
    flame: svg('<path d="M12 21a6.5 6.5 0 0 0 6.5-6.5c0-4-3-6-3.5-9.5-2 1.5-3 3.5-3 5.5-1-.5-2-1.8-2-3.5-2 2-4.5 4.5-4.5 7.5A6.5 6.5 0 0 0 12 21z"/>'),
    wallet: svg('<rect x="3" y="6" width="18" height="14" rx="2.5"/><path d="M3 10h18M16.5 14.5h1.5M7 3.5h10"/>'),
    quote: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 7H6.5A3.5 3.5 0 0 0 3 10.5V17h7v-6.5H6.4A1.4 1.4 0 0 1 7.8 9H10zm11 0h-3.5a3.5 3.5 0 0 0-3.5 3.5V17h7v-6.5h-3.6A1.4 1.4 0 0 1 18.8 9H21z"/></svg>',
    hand: svg('<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4a1.5 1.5 0 0 1 3 0v6.5M14 10.5V5.5a1.5 1.5 0 0 1 3 0V13M17 9.5a1.5 1.5 0 0 1 3 0V15a6.5 6.5 0 0 1-6.5 6.5h-1A6.5 6.5 0 0 1 7 18.8L4.3 14.6a1.5 1.5 0 0 1 2.5-1.6L8 14.5"/>'),
    chef: svg('<path d="M7 13.2A3.2 3.2 0 0 1 7.6 6.9 4.6 4.6 0 0 1 12 4a4.6 4.6 0 0 1 4.4 2.9A3.2 3.2 0 0 1 17 13.2V18H7z"/><path d="M7 15.5h10M9 18v2.5h6V18"/>'),
    oven: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M3.5 8h17"/><rect x="7" y="11" width="10" height="6.5" rx="1.5"/><path d="M7 5.8h.01M10 5.8h.01"/>'),
    plate: svg('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>'),
    sparkle: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>'),
    camera: svg('<path d="M4 8h3l1.8-2.5h6.4L17 8h3a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.6"/>'),
    whisk: svg('<path d="M12 14.5V21"/><path d="M12 14.5c-2.8 0-4.5-3.3-4.5-6.3S9.5 3 12 3s4.5 2.2 4.5 5.2-1.7 6.3-4.5 6.3z"/><path d="M12 3c-1.1 1.8-1.6 4-1.6 6.2M12 3c1.1 1.8 1.6 4 1.6 6.2"/>'),
    cake: svg('<path d="M4 20.5h16M5.5 20.5V14a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v6.5"/><path d="M5.5 16.2c1.1.9 2.2.9 3.3 0s2.2-.9 3.2 0 2.2.9 3.2 0 2.2-.9 3.3 0"/><path d="M12 12V8.5M12 5.5v.01"/>')
  };

  /* ---------- Small template helpers ---------- */
  function media(src, alt, fallback, cls, attrs) {
    return '<div class="media ' + (cls || "") + '"><img src="' + src + '" alt="' + CH.esc(alt) + '" loading="lazy" decoding="async" data-fallback="' + (fallback || D.placeholders.food) + '"' + (attrs || "") + "></div>";
  }
  function bg(src, fallback) {
    return "background-image:url('" + src + "'),url('" + (fallback || D.placeholders.kitchen) + "')";
  }
  function head(key, mod, extra) {
    return '<div class="section-head ' + (mod || "") + '"><div class="reveal">' +
      '<span class="eyebrow">' + CH.t(key + ".eyebrow") + "</span>" +
      '<h2 class="section-title">' + CH.t(key + ".title") + "</h2>" +
      '<p class="section-sub">' + CH.t(key + ".sub") + "</p></div>" + (extra || "") + "</div>";
  }
  function d(i, step) { return ' style="--d:' + ((i || 0) * (step || 0.08)).toFixed(2) + '"'; }
  function stars(n) {
    var s = "";
    for (var i = 1; i <= 5; i++) s += i <= n ? I.star : I.star.replace("<svg", '<svg class="off"');
    return '<div class="stars" aria-label="' + n + '/5">' + s + "</div>";
  }
  function initials(name) {
    return name.split(" ").map(function (p) { return p.charAt(0); }).join("").slice(0, 2);
  }
  CH.media = media;
  CH.bg = bg;

  /* ---------- Header / Footer ---------- */
  var NAV = [
    { key: "home", page: "index.html", anchor: "#top", id: "index" },
    { key: "courses", page: "courses.html", anchor: "#courses", id: "courses" },
    { key: "teachers", page: "teachers.html", anchor: "#teachers", id: "teachers" },
    { key: "gallery", page: "gallery.html", anchor: "#gallery", id: "gallery" },
    { key: "schedule", page: "schedule.html", anchor: "#schedule", id: "schedule" },
    { key: "pricing", page: "pricing.html", anchor: "#pricing", id: "pricing" },
    { key: "contacts", page: "contacts.html", anchor: "#booking", id: "contacts" }
  ];
  CH.NAV = NAV;

  function navHref(n) { return CH.page === "index" ? n.anchor : n.page; }

  function langSwitch() {
    return '<div class="lang-switch" role="group" aria-label="' + CH.t("ui.language") + '">' +
      ["ru", "uz"].map(function (l) {
        return '<button type="button" data-lang="' + l + '" class="' + (CH.state.lang === l ? "active" : "") + '" aria-pressed="' + (CH.state.lang === l) + '">' + l.toUpperCase() + "</button>";
      }).join("") + "</div>";
  }
  function themeToggle() {
    return '<button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-label="' + CH.t("ui.theme") + '" title="' + CH.t("ui.theme") + '">' + I.moon + I.sun + "</button>";
  }
  function logo() {
    return '<a class="logo" href="index.html" aria-label="Culinary House"><span class="logo__mark">' + I.logo + '</span><span class="logo__text"><b>Culinary House</b><span>' + CH.t("logoSub") + "</span></span></a>";
  }
  CH.logo = logo;

  CH.tpl.header = function () {
    var links = NAV.map(function (n, i) {
      var active = CH.page !== "index" && CH.page === n.id;
      return '<a class="nav__link' + (active ? " active" : "") + '" href="' + navHref(n) + '" data-nav="' + n.anchor.slice(1) + '" style="--i:' + i + '">' + CH.t("nav." + n.key) + "</a>";
    }).join("");
    return '<header class="header" id="header"><div class="container header__inner">' + logo() +
      '<nav class="nav" id="site-nav" aria-label="Main">' + links +
      '<div class="nav__extra">' + langSwitch() + themeToggle() +
      '<a class="btn btn--primary" href="' + CH.bookHref() + '" data-book="">' + CH.t("ui.book") + I.arrow + "</a></div></nav>" +
      '<div class="header__actions">' + langSwitch() + themeToggle() +
      '<a class="btn btn--primary btn--sm" href="' + CH.bookHref() + '" data-book="">' + CH.t("ui.book") + "</a>" +
      '<button type="button" class="burger" aria-label="' + CH.t("ui.menu") + '" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span></span></button>' +
      "</div></div></header>";
  };

  CH.tpl.footer = function () {
    var c = D.contacts;
    return '<footer class="footer"><div class="container"><div class="footer__grid">' +
      '<div class="footer__about">' + logo() + "<p>" + CH.t("footer.about") + "</p>" +
      '<div class="socials"><a href="' + c.telegramHref + '" target="_blank" rel="noopener" aria-label="Telegram">' + I.telegram + '</a><a href="' + c.instagramHref + '" target="_blank" rel="noopener" aria-label="Instagram">' + I.instagram + '</a><a href="' + c.phoneHref + '" aria-label="' + CH.t("booking.phoneLabel") + '">' + I.phone + "</a></div></div>" +
      "<div><h5>" + CH.t("footer.nav") + '</h5><ul class="footer__links">' +
      NAV.map(function (n) { return '<li><a href="' + n.page + '">' + CH.t("nav." + n.key) + "</a></li>"; }).join("") + "</ul></div>" +
      "<div><h5>" + CH.t("footer.contacts") + '</h5><ul class="footer__contacts">' +
      "<li>" + I.pin + "<span>" + CH.t("booking.addressValue") + "</span></li>" +
      "<li>" + I.phone + '<a href="' + c.phoneHref + '">' + c.phone + "</a></li>" +
      "<li>" + I.telegram + '<a href="' + c.telegramHref + '" target="_blank" rel="noopener">' + c.telegram + "</a></li>" +
      "<li>" + I.instagram + '<a href="' + c.instagramHref + '" target="_blank" rel="noopener">' + c.instagram + "</a></li>" +
      "<li>" + I.clock + "<span>" + CH.t("booking.hours") + "</span></li></ul></div>" +
      "<div><h5>" + CH.t("footer.settings") + '</h5><div class="footer__settings">' + langSwitch() + themeToggle() + "</div>" +
      '<a class="btn btn--primary" style="margin-top:26px" href="' + CH.bookHref() + '" data-book="">' + CH.t("ui.book") + I.arrow + "</a></div>" +
      '</div><div class="footer__bottom"><span>' + CH.t("footer.rights", { year: new Date().getFullYear() }) + "</span><span>" + CH.t("footer.made") + "</span></div></div></footer>";
  };

  /* ---------- Sections ---------- */
  var T = CH.tpl;

  T.hero = function () {
    var h = CH.t("hero");
    var onIndex = CH.page === "index";
    return '<div class="parallax-bg" data-speed="0.3"></div><div class="hero__overlay"></div>' +
      '<div class="container"><div class="hero__content">' +
      '<span class="eyebrow hero__eyebrow anim-up" style="--d:0">' + h.eyebrow + "</span>" +
      '<h1 class="hero__title">' + h.title.map(function (w, i) { return '<span class="anim-up" style="--d:' + (0.12 + i * 0.12) + '">' + w + "</span>"; }).join("") + "</h1>" +
      '<p class="hero__sub anim-up" style="--d:.5">' + h.sub + "</p>" +
      '<div class="hero__actions anim-up" style="--d:.65">' +
      '<a class="btn btn--primary" href="' + (onIndex ? "#courses" : "courses.html") + '">' + h.ctaCourses + I.arrow + "</a>" +
      '<a class="btn btn--ghost" href="' + (onIndex ? "#schedule" : "schedule.html") + '">' + I.calendar + h.ctaSchedule + "</a></div>" +
      '<div class="hero__meta anim-up" style="--d:.8">' + h.meta.map(function (m) { return "<div><b>" + m[0] + "</b><span>" + m[1] + "</span></div>"; }).join("") + "</div>" +
      '</div></div><a class="hero__scroll" href="#about" aria-label="' + h.scroll + '"><span>' + h.scroll + "</span><i></i></a>";
  };

  T.pageHero = function () {
    var p = CH.page;
    return '<div class="parallax-bg" data-speed="0.25" style="' + bg(D.images.pages[p]) + '"></div><div class="hero__overlay"></div>' +
      '<div class="container"><div class="page-hero__content">' +
      '<nav class="breadcrumbs anim-up" aria-label="Breadcrumb"><a href="index.html">' + CH.t("pages.home") + "</a><span>/</span><span>" + CH.t("pages." + p + ".title") + "</span></nav>" +
      '<h1 class="anim-up" style="--d:.1">' + CH.t("pages." + p + ".title") + "</h1>" +
      '<p class="anim-up" style="--d:.2">' + CH.t("pages." + p + ".sub") + "</p></div></div>";
  };

  T.about = function () {
    var a = CH.t("about");
    var icons = [I.hand, I.chef, I.oven, I.users, I.plate];
    var stats = [
      { n: 12, s: "+", dec: 0 }, { n: 5, s: "", dec: 0 }, { n: 500, s: "+", dec: 0 }, { n: 4.9, s: "/5", dec: 1 }
    ];
    return '<div class="container"><div class="about-grid"><div>' +
      '<div class="reveal"><span class="eyebrow">' + a.eyebrow + '</span><h2 class="section-title">' + a.title + '</h2><p class="about__lead">' + a.lead + "</p></div>" +
      '<div class="feature-list">' + a.features.map(function (f, i) {
        return '<div class="feature reveal"' + d(i, 0.07) + '><span class="feature__icon">' + icons[i] + "</span><div><h4>" + f[0] + "</h4><p>" + f[1] + "</p></div></div>";
      }).join("") + "</div></div>" +
      '<div class="about__media reveal reveal--right">' +
      media(D.images.about1, a.features[0][0], D.placeholders.food) +
      media(D.images.about2, a.features[2][0], D.placeholders.kitchen) +
      '<div class="about__badge"><b>' + a.badgeNum + "</b><span>" + a.badgeText + "</span></div></div></div>" +
      '<div class="stats reveal">' + stats.map(function (s, i) {
        return '<div class="stat"><div class="stat__num" data-count="' + s.n + '" data-suffix="' + s.s + '" data-decimals="' + s.dec + '">0' + s.s + '</div><div class="stat__label">' + a.stats[i] + "</div></div>";
      }).join("") + "</div></div>";
  };

  T.parallax = function (opts) {
    var v = opts.variant || "p1";
    var p = CH.t("parallax." + v);
    var img = D.images[{ p1: "parallax1", p2: "parallax2", p3: "parallax3" }[v]];
    var btn = p.btn ? '<a class="btn btn--primary" href="' + (CH.page === "index" ? "#courses" : "courses.html") + '">' + p.btn + I.arrow + "</a>" : "";
    return '<div class="parallax-bg" data-speed="0.2" style="' + bg(img) + '"></div><div class="hero__overlay"></div>' +
      '<div class="parallax__content reveal"><span class="eyebrow hero__eyebrow">' + p.eyebrow + '</span><h2 class="parallax__quote">' + p.quote + '</h2><p class="parallax__text">' + p.text + "</p>" + btn + "</div>";
  };

  function courseCard(c, i) {
    var t = CH.teacher(c.teacher);
    var hidden = CH.state.courseFilter !== "all" && CH.state.courseFilter !== c.cat;
    return '<article class="course-card reveal' + (hidden ? " is-hidden" : "") + '" data-cat="' + c.cat + '"' + d(i % 3, 0.1) + ">" +
      '<div class="course-card__media media"><img src="' + c.image + '" alt="' + CH.esc(CH.L(c.title)) + '" loading="lazy" decoding="async" data-fallback="' + D.placeholders.food + '">' +
      '<span class="badge">' + CH.t("courses.cats." + c.cat) + "</span>" +
      (c.popular ? '<span class="badge badge--accent">' + CH.t("courses.popular") + "</span>" : "") + "</div>" +
      '<div class="course-card__body"><h3 class="course-card__title">' + CH.L(c.title) + '</h3><p class="course-card__desc">' + CH.L(c.desc) + "</p>" +
      '<div class="course-card__meta"><span>' + I.clock + CH.duration(c) + "</span><span>" + I.user + CH.L(t.name) + "</span></div>" +
      '<div class="course-card__footer"><div class="price"><small>' + CH.t("ui.price") + "</small>" + CH.money(c.price) + "</div>" +
      '<button type="button" class="btn btn--outline btn--sm" data-course-open="' + c.id + '">' + CH.t("ui.more") + "</button></div></div></article>";
  }

  T.courses = function () {
    var f = CH.t("courses.filters");
    var counts = { all: D.courses.length };
    D.courses.forEach(function (c) { counts[c.cat] = (counts[c.cat] || 0) + 1; });
    var filters = '<div class="filters reveal" role="tablist">' + ["all", "cooking", "pastry", "special"].map(function (k) {
      var on = CH.state.courseFilter === k;
      return '<button type="button" class="filter-btn' + (on ? " active" : "") + '" data-filter="' + k + '" role="tab" aria-selected="' + on + '">' + f[k] + "<sup>" + counts[k] + "</sup></button>";
    }).join("") + "</div>";
    return '<div class="container">' + head("courses", "section-head--split", filters) +
      '<div class="courses-grid">' + D.courses.map(courseCard).join("") + "</div></div>";
  };

  T.featured = function () {
    var c = CH.course(D.featuredCourse);
    var f = CH.t("featured");
    var next = CH.nextLaunch(c.id);
    return '<div class="container"><div class="featured reveal reveal--zoom">' +
      '<div class="featured__media">' + media(D.images.featured, CH.L(c.title), D.placeholders.food) +
      '<span class="featured__tag">' + I.flame + f.tag + "</span>" +
      '<div class="featured__float"><b>' + f.floatNum + "</b><span>" + f.floatText + "</span></div></div>" +
      '<div class="featured__info"><span class="eyebrow">' + f.eyebrow + "</span><h3>" + CH.L(c.title) + "</h3><p>" + f.desc + "</p>" +
      '<ul class="featured__list">' + f.list.map(function (li) { return "<li>" + I.check + "<span>" + li + "</span></li>"; }).join("") + "</ul>" +
      '<div class="featured__meta"><div><span>' + f.metaDuration + "</span><b>" + CH.duration(c) + "</b></div>" +
      "<div><span>" + f.metaStart + "</span><b>" + (next ? CH.fmtDate(next.date) : CH.t("modal.noStart")) + "</b></div>" +
      "<div><span>" + f.metaGroup + "</span><b>" + f.groupValue + "</b></div></div>" +
      '<div class="featured__bottom"><div><div class="price">' + CH.money(c.price) + "</div>" +
      '<div class="installment-note">' + I.wallet + CH.t("pricing.installmentShort", { n: c.installment, sum: CH.money(CH.monthly(c.price, c.installment)) }) + "</div></div>" +
      '<button type="button" class="btn btn--primary" data-book="' + c.id + '"' + (next ? ' data-date="' + next.key + '"' : "") + ">" + f.btnBook + I.arrow + "</button>" +
      '<button type="button" class="btn btn--outline" data-course-open="' + c.id + '">' + f.btnMore + "</button></div></div></div></div>";
  };

  T.teachers = function () {
    var ui = CH.t("ui");
    return '<div class="container">' + head("teachers", "section-head--center") + '<div class="teachers-grid">' +
      D.teachers.map(function (t, i) {
        var name = CH.L(t.name);
        var initials = name.split(/\s+/).map(function (w) { return w.charAt(0); }).join("");
        return '<article class="teacher-card reveal"' + d(i, 0.08) + ">" +
          '<div class="teacher-card__top" aria-hidden="true"><span class="teacher-card__index">' + (i < 9 ? "0" : "") + (i + 1) + "</span>" +
          '<div class="teacher-card__mono"><span>' + initials + '</span><i class="teacher-card__icon">' + I[t.icon] + "</i></div></div>" +
          '<div class="teacher-card__body"><div class="teacher-card__role">' + CH.L(t.role) + '</div><h3 class="teacher-card__name">' + name + "</h3>" +
          "<p>" + CH.L(t.bio) + '</p><div class="tags">' + CH.L(t.tags).map(function (g) { return "<span>" + g + "</span>"; }).join("") + "</div>" +
          '<div class="teacher-card__exp"><b>' + t.exp + "</b>" + CH.plural(t.exp, ui.year) + " " + CH.t("teachers.exp") + "</div></div></article>";
      }).join("") + "</div></div>";
  };

  T.gallery = function (opts) {
    var limit = +opts.limit || D.gallery.length;
    var withFilter = opts.filterable === "true";
    var cats = CH.t("gallery.cats");
    var items = D.gallery.slice(0, limit);
    var filters = withFilter ? '<div class="filters reveal" role="tablist">' + ["all", "dishes", "process", "kitchen", "baking", "students"].map(function (k) {
      var on = CH.state.galleryFilter === k;
      return '<button type="button" class="filter-btn' + (on ? " active" : "") + '" data-gfilter="' + k + '" role="tab" aria-selected="' + on + '">' + cats[k] + "</button>";
    }).join("") + "</div>" : "";
    return '<div class="container">' + head("gallery", withFilter ? "section-head--split" : "section-head--center", filters) +
      '<div class="gallery">' + items.map(function (g, i) {
        var hidden = withFilter && CH.state.galleryFilter !== "all" && CH.state.galleryFilter !== g.cat;
        var w = (g.src.match(/[?&]w=(\d+)/) || [])[1] || 800, h = (g.src.match(/[?&]h=(\d+)/) || [])[1] || 600;
        var cap = CH.L(g.caption);
        return '<button type="button" class="gallery__item reveal' + (hidden ? " is-hidden" : "") + '" data-index="' + i + '" data-cat="' + g.cat + '"' + d(i % 3, 0.08) + ' aria-label="' + CH.esc(CH.t("gallery.open") + ": " + cap) + '">' +
          media(g.src, cap, D.placeholders.food, "", ' width="' + w + '" height="' + h + '"') +
          '<span class="gallery__caption"><span><small>' + cats[g.cat] + "</small><b>" + cap + '</b></span><span class="gallery__zoom">' + I.zoom + "</span></span></button>";
      }).join("") + "</div>" +
      (limit < D.gallery.length ? '<div class="gallery-more reveal"><a class="btn btn--outline" href="gallery.html">' + CH.t("gallery.more") + I.arrow + "</a></div>" : "") +
      "</div>";
  };

  T.calendar = function () {
    var c = CH.t("calendar");
    return '<div class="container">' + head("calendar", "section-head--center") +
      '<div class="calendar-wrap reveal" data-calendar>' + T.calendarBody() + "</div>" +
      '<p class="sr-only" aria-live="polite" data-cal-live></p></div>';
  };

  T.calendarBody = function () {
    var c = CH.t("calendar");
    var st = CH.state.cal;
    var m = st.month;
    var y = m.getFullYear(), mo = m.getMonth();
    var first = new Date(y, mo, 1);
    var startOffset = (first.getDay() + 6) % 7;
    var daysIn = new Date(y, mo + 1, 0).getDate();
    var cells = Math.ceil((startOffset + daysIn) / 7) * 7;
    var byDay = {};
    CH.launches.forEach(function (l) { (byDay[l.key] = byDay[l.key] || []).push(l); });
    var todayKey = CH.isoDate(CH.today);

    var grid = "";
    for (var i = 0; i < cells; i++) {
      var date = new Date(y, mo, 1 - startOffset + i);
      var key = CH.isoDate(date);
      var other = date.getMonth() !== mo;
      var ev = !other && byDay[key];
      var cls = "cal-day" + (other ? " is-other" : "") + (date < CH.today ? " is-past" : "") + (key === todayKey ? " is-today" : "") +
        (ev ? " has-event" : "") + (ev && st.selected === key ? " is-selected" : "");
      if (ev) {
        var names = ev.map(function (l) { return CH.L(CH.course(l.course).title); }).join(", ");
        grid += '<button type="button" class="' + cls + '" data-day="' + key + '" aria-label="' + CH.esc(CH.fmtDate(date) + ": " + names) + '" aria-pressed="' + (st.selected === key) + '">' + date.getDate() +
          '<span class="cal-dots">' + ev.slice(0, 3).map(function () { return "<i></i>"; }).join("") + "</span></button>";
      } else {
        grid += '<span class="' + cls + '">' + date.getDate() + "</span>";
      }
    }

    var minMonth = new Date(CH.today.getFullYear(), CH.today.getMonth(), 1);
    var last = CH.launches[CH.launches.length - 1].date;
    var maxMonth = new Date(last.getFullYear(), last.getMonth(), 1);

    var list, title, showAll = "";
    if (st.selected && byDay[st.selected]) {
      list = byDay[st.selected];
      title = c.onDay.replace("{date}", CH.fmtDate(CH.parseISO(st.selected)));
      showAll = '<button type="button" data-cal="all">' + c.showAll + "</button>";
    } else {
      list = CH.launches.filter(function (l) { return l.date >= CH.today; }).slice(0, 5);
      title = c.upcoming;
    }

    return '<div class="calendar">' +
      '<div class="calendar__head"><h3 class="calendar__title">' + c.months[mo] + " " + y + "</h3>" +
      '<div class="cal-nav"><button type="button" data-cal="prev" aria-label="' + c.prevMonth + '"' + (m <= minMonth ? " disabled" : "") + ">" + I.left + "</button>" +
      '<button type="button" data-cal="next" aria-label="' + c.nextMonth + '"' + (m >= maxMonth ? " disabled" : "") + ">" + I.right + "</button></div></div>" +
      '<div class="calendar__weekdays">' + c.weekdays.map(function (w) { return "<span>" + w + "</span>"; }).join("") + "</div>" +
      '<div class="calendar__grid">' + grid + "</div>" +
      '<div class="calendar__legend"><span><i></i>' + c.legendEvent + '</span><span><i class="today"></i>' + c.legendToday + "</span></div></div>" +
      '<div class="launches"><div class="launches__head"><h3>' + title + "</h3>" + showAll + "</div>" +
      '<div class="launches__list">' + (list.length ? list.map(launchCard).join("") : '<div class="launches__empty">' + c.empty + "</div>") + "</div></div>";
  };

  function launchCard(l, i) {
    var c = CH.t("calendar");
    var course = CH.course(l.course);
    var teacher = CH.teacher(course.teacher);
    var low = l.seats <= 2;
    return '<article class="launch-card" style="--i:' + i + '">' +
      '<div class="launch-card__date"><b>' + l.date.getDate() + "</b><span>" + c.monthsShort[l.date.getMonth()] + "</span></div>" +
      "<div><h4>" + CH.L(course.title) + "</h4>" +
      '<div class="launch-card__meta"><span>' + I.clock + l.time + ", " + c.weekdaysFull[l.date.getDay()] + "</span>" +
      "<span>" + I.calendar + CH.duration(course) + "</span><span>" + I.user + CH.L(teacher.name) + "</span></div>" +
      '<div class="launch-card__foot"><div class="seats' + (low ? " seats--low" : "") + '"><div class="seats__label"><span>' + c.seatsLeft + "</span><span><b>" + l.seats + "</b> " + c.of + " " + l.total + "</span></div>" +
      '<div class="seats__bar"><span style="width:' + Math.round(l.seats / l.total * 100) + '%"></span></div></div>' +
      '<button type="button" class="btn btn--primary btn--sm" data-book="' + l.course + '" data-date="' + l.key + '">' + CH.t("ui.book") + "</button></div></div></article>";
  }

  T.pricing = function (opts) {
    var p = CH.t("pricing");
    var cards = D.plans.map(function (pl, i) {
      var course = pl.course ? CH.course(pl.course) : null;
      var inst = course && course.installment ? '<div class="price-card__installment">' + I.wallet + p.installmentShort.replace("{n}", course.installment).replace("{sum}", CH.money(CH.monthly(pl.price, course.installment))) + "</div>" : "";
      return '<article class="price-card' + (pl.popular ? " price-card--popular" : "") + ' reveal"' + d(i, 0.08) + ">" +
        (pl.popular ? '<span class="price-card__badge">' + I.star + p.popular + "</span>" : "") +
        '<span class="price-card__type">' + CH.L(pl.type) + "</span><h3>" + CH.L(pl.name) + '</h3><p class="price-card__desc">' + CH.L(pl.desc) + "</p>" +
        '<div class="price-card__price">' + CH.num(pl.price) + " <small>" + CH.t("ui.currency") + '</small></div><div class="price-card__period">' + p[pl.unit] + "</div>" + inst +
        "<ul>" + CH.L(pl.features).map(function (f) { return "<li>" + I.check + "<span>" + f + "</span></li>"; }).join("") + "</ul>" +
        '<button type="button" class="btn ' + (pl.popular ? "btn--primary" : "btn--outline") + ' btn--block" data-book="' + pl.course + '">' + p.choose + "</button></article>";
    }).join("");

    var banner = '<div class="installment reveal"><span class="installment__icon">' + I.wallet + "</span><div><h3>" + p.instTitle + "</h3><p>" + p.instText + "</p></div>" +
      '<button type="button" class="btn btn--primary" data-book="pastry">' + p.instBtn + I.arrow + "</button></div>";

    var table = "";
    if (opts.table === "true") {
      table = '<div class="price-table reveal"><div class="price-table__head"><span>' + p.tableCourse + "</span><span>" + p.tableDuration + "</span><span>" + p.tableTeacher + "</span><span>" + p.tablePrice + "</span><span></span></div>" +
        D.courses.map(function (c) {
          return '<div class="price-row"><div class="price-row__name"><img src="' + c.image.replace("w=900", "w=120") + '" alt="" loading="lazy" data-fallback="' + D.placeholders.food + '"><span>' + CH.L(c.title) + "<br>" +
            (c.installment ? '<span class="chip">' + I.wallet.replace("<svg", '<svg width="12" height="12"') + " 0% · " + c.installment + " " + CH.t("ui.monthShortUnit") + "</span>" : '<span class="chip chip--muted">' + p.no + "</span>") + "</span></div>" +
            "<span>" + CH.duration(c) + "</span><span>" + CH.L(CH.teacher(c.teacher).name) + '</span><span class="price-row__price">' + CH.money(c.price) + "</span>" +
            '<button type="button" class="btn btn--outline btn--sm" data-course-open="' + c.id + '">' + CH.t("ui.more") + "</button></div>";
        }).join("") + "</div>";
    }
    return '<div class="container">' + head("pricing", "section-head--center") + '<div class="pricing-grid">' + cards + "</div>" + banner +
      (table ? '<h3 class="section-title" style="font-size:clamp(26px,3vw,36px);margin-top:80px">' + p.tableTitle + "</h3>" + table : "") + "</div>";
  };

  T.honor = function () {
    var h = CH.t("honor");
    return '<div class="container">' + head("honor", "section-head--center") + '<div class="honor-grid">' +
      D.honor.map(function (s, i) {
        var name = CH.L(s.name);
        return '<article class="honor-card honor-card--' + s.medal + ' reveal"' + d(i % 3, 0.1) + ' style="--i:' + i + '">' +
          '<div class="honor-card__avatar-wrap"><div class="avatar" style="--avatar-bg:linear-gradient(135deg,' + s.colors[0] + "," + s.colors[1] + ')">' + initials(name) + "</div>" +
          '<span class="medal" title="' + h.places[s.medal] + '">' + I.medal + "</span></div>" +
          '<div class="honor-card__place">' + h.places[s.medal] + "</div><h4>" + name + '</h4><div class="honor-card__course">' + CH.L(CH.course(s.course).title) + "</div>" +
          '<p class="honor-card__achievement">' + CH.L(s.achievement) + '</p><span class="honor-card__year">' + h.graduate + " " + s.year + "</span></article>";
      }).join("") + "</div></div>";
  };

  T.reviews = function () {
    return '<div class="container">' + head("reviews", "section-head--center") +
      '<div class="carousel reveal" data-carousel><div class="carousel__viewport"><div class="carousel__track">' +
      D.reviews.map(function (r) {
        var name = CH.L(r.name);
        return '<div class="carousel__slide"><article class="review-card">' + I.quote.replace("<svg", '<svg class="review-card__quote"') + stars(r.rating) +
          '<p class="review-card__text">' + CH.L(r.text) + "</p>" +
          '<div class="review-card__author"><div class="avatar">' + initials(name) + "</div><div><b>" + name + "</b><span>" + CH.L(CH.course(r.course).title) + "</span></div></div></article></div>";
      }).join("") + "</div></div>" +
      '<div class="carousel__controls"><button type="button" class="carousel__btn" data-dir="-1" aria-label="' + CH.t("ui.prev") + '">' + I.left + "</button>" +
      '<div class="carousel__dots"></div><button type="button" class="carousel__btn" data-dir="1" aria-label="' + CH.t("ui.next") + '">' + I.right + "</button></div></div></div>";
  };

  T.faq = function () {
    var f = CH.t("faq");
    return '<div class="container"><div class="faq-layout"><div class="faq-aside">' +
      '<div class="reveal"><span class="eyebrow">' + f.eyebrow + '</span><h2 class="section-title">' + f.title + '</h2><p class="section-sub">' + f.sub + "</p></div>" +
      '<div class="faq-aside__card reveal"><h4>' + f.asideTitle + "</h4><p>" + f.asideText + "</p>" +
      '<a class="btn btn--primary" href="' + D.contacts.telegramHref + '" target="_blank" rel="noopener">' + I.telegram + f.asideBtn + "</a></div></div>" +
      '<div class="faq">' + D.faq.map(function (q, i) {
        var open = CH.state.faqOpen === i;
        return '<div class="faq__item reveal' + (open ? " open" : "") + '"' + d(i, 0.06) + ">" +
          '<button type="button" class="faq__q" id="faq-q-' + i + '" aria-expanded="' + open + '" aria-controls="faq-a-' + i + '" data-faq="' + i + '"><span>' + CH.L(q.q) + '</span><span class="faq__icon" aria-hidden="true"></span></button>' +
          '<div class="faq__a" id="faq-a-' + i + '" role="region" aria-labelledby="faq-q-' + i + '"><div class="faq__a-inner">' + CH.L(q.a) + "</div></div></div>";
      }).join("") + "</div></div></div>";
  };

  T.booking = function () {
    var b = CH.t("booking");
    var c = D.contacts;
    var options = D.courses.map(function (co) { return '<option value="' + co.id + '">' + CH.L(co.title) + " — " + CH.money(co.price) + "</option>"; }).join("");
    function field(name, label, control, full) {
      return '<div class="field' + (full ? " field--full" : "") + '">' + '<label for="bf-' + name + '">' + label + (b.errors[name] ? " <i>*</i>" : "") + "</label>" + control + '<span class="field__error" id="bf-' + name + '-err" role="alert"></span></div>';
    }
    return '<div class="container">' + head("booking", "section-head--center") + '<div class="booking">' +
      '<form class="booking__form reveal reveal--left" novalidate data-booking-form><h3>' + b.formTitle + "</h3><p>" + b.formText + '</p><div class="form-grid">' +
      field("name", b.name, '<input id="bf-name" name="name" type="text" autocomplete="name" placeholder="' + b.namePh + '" maxlength="60" aria-describedby="bf-name-err">') +
      field("phone", b.phone, '<input id="bf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="' + b.phonePh + '" aria-describedby="bf-phone-err">') +
      field("course", b.course, '<select id="bf-course" name="course" aria-describedby="bf-course-err"><option value="">' + b.coursePh + "</option>" + options + "</select>") +
      field("date", b.date, '<input id="bf-date" name="date" type="date" min="' + CH.isoDate(CH.today) + '" aria-describedby="bf-date-err">') +
      field("comment", b.comment, '<textarea id="bf-comment" name="comment" placeholder="' + b.commentPh + '" maxlength="600"></textarea>', true) +
      '</div><div class="form-foot"><small>' + b.privacy + '</small><button type="submit" class="btn btn--primary">' + b.submit + I.arrow + "</button></div></form>" +
      '<aside class="contact-card reveal reveal--right"><div class="contact-card__bg" style="' + bg(D.images.contact) + '"></div>' +
      "<h3>" + b.contactTitle + "</h3><p>" + b.contactText + '</p><div class="contact-list">' +
      "<div><i>" + I.pin + "</i><span><small>" + b.address + "</small><b>" + b.addressValue + "</b></span></div>" +
      '<a href="' + c.phoneHref + '"><i>' + I.phone + "</i><span><small>" + b.phoneLabel + "</small><b>" + c.phone + "</b></span></a>" +
      '<a href="' + c.telegramHref + '" target="_blank" rel="noopener"><i>' + I.telegram + "</i><span><small>Telegram</small><b>" + c.telegram + "</b></span></a>" +
      '<a href="' + c.instagramHref + '" target="_blank" rel="noopener"><i>' + I.instagram + "</i><span><small>Instagram</small><b>" + c.instagram + "</b></span></a>" +
      '</div><div class="contact-card__hours">' + b.hours + "</div></aside></div></div>";
  };

  T.map = function () {
    var m = CH.t("map");
    return '<div class="container"><div class="section-head section-head--center"><div class="reveal"><span class="eyebrow">' + CH.t("booking.address") + '</span><h2 class="section-title">' + m.title + '</h2><p class="section-sub">' + m.sub + "</p></div></div>" +
      '<div class="map-wrap reveal"><iframe title="' + CH.esc(m.title) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' + encodeURIComponent(D.contacts.mapQuery) + '&z=16&output=embed"></iframe></div></div>';
  };

  T.cta = function () {
    var c = CH.t("cta");
    return '<div class="container"><div class="cta-band reveal reveal--zoom"><div class="parallax-bg" data-speed="0.15" style="' + bg(D.images.parallax3) + '"></div>' +
      "<div><h2>" + c.title + "</h2><p>" + c.text + "</p></div>" +
      '<a class="btn btn--primary" href="' + CH.bookHref() + '" data-book="">' + c.btn + I.arrow + "</a></div></div>";
  };

  /* Course detail modal body */
  T.courseModal = function (id) {
    var c = CH.course(id);
    var t = CH.teacher(c.teacher);
    var m = CH.t("modal");
    var next = CH.nextLaunch(id);
    return '<button type="button" class="modal__close" data-modal-close aria-label="' + CH.t("ui.close") + '">' + I.close + "</button>" +
      media(c.image.replace("w=900", "w=1100"), CH.L(c.title), D.placeholders.food, "modal__media") +
      '<div class="modal__body"><span class="eyebrow">' + CH.t("courses.cats." + c.cat) + '</span><h3 id="modal-title">' + CH.L(c.title) + "</h3><p>" + CH.L(c.desc) + "</p>" +
      '<div class="modal__facts"><div><span>' + m.teacher + "</span><b>" + CH.L(t.name) + "</b></div><div><span>" + m.duration + "</span><b>" + CH.duration(c) + "</b></div>" +
      "<div><span>" + m.start + "</span><b>" + (next ? CH.fmtDate(next.date) + ", " + next.time : m.noStart) + "</b></div><div><span>" + m.group + "</span><b>" + m.groupValue + "</b></div></div>" +
      "<h4>" + m.includesTitle + '</h4><ul class="modal__includes">' + m.includes.map(function (x) { return "<li>" + I.check + "<span>" + x + "</span></li>"; }).join("") + "</ul>" +
      '<div class="modal__actions"><div><div class="price">' + CH.money(c.price) + "</div>" +
      (c.installment ? '<div class="installment-note">' + I.wallet + m.installment.replace("{n}", c.installment).replace("{sum}", CH.money(CH.monthly(c.price, c.installment))) + "</div>" : "") +
      '</div><button type="button" class="btn btn--primary" data-book="' + c.id + '"' + (next ? ' data-date="' + next.key + '"' : "") + ">" + CH.t("ui.book") + I.arrow + "</button></div></div>";
  };
})();
