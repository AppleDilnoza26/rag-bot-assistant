/* Culinary House — interface behaviour. */
(function () {
  "use strict";

  var CH = window.CH;
  var I = CH.icons;
  var root = document.documentElement;
  var body = document.body;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* storage unavailable */ } }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  var firstRender = true;

  CH.state.cal.month = new Date(CH.today.getFullYear(), CH.today.getMonth(), 1);

  /* ---------- Images: skeleton until loaded, local placeholder on error ---------- */
  function markLoaded(img) {
    var m = img.closest(".media");
    if (m) m.classList.add("is-loaded");
  }
  document.addEventListener("load", function (e) {
    if (e.target.tagName === "IMG") markLoaded(e.target);
  }, true);
  document.addEventListener("error", function (e) {
    var img = e.target;
    if (img.tagName !== "IMG") return;
    var fb = img.getAttribute("data-fallback");
    if (fb && img.getAttribute("src") !== fb) img.setAttribute("src", fb);
    else markLoaded(img);
  }, true);
  function checkImages(scope) {
    $$(".media img", scope).forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) markLoaded(img);
    });
  }

  /* ---------- Theme ---------- */
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    store("ch-theme", t);
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "light" ? "#faf6f0" : "#0d0b09");
  }
  function toggleTheme() {
    setTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
  }

  /* ---------- Language ---------- */
  function setLang(l) {
    if (l === CH.state.lang) return;
    CH.state.lang = l;
    store("ch-lang", l);
    renderAll();
  }

  /* ---------- Rendering ---------- */
  function renderAll() {
    var formState = saveForm();
    root.lang = CH.state.lang;
    document.title = CH.t("meta." + CH.page);
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", CH.t("meta.description"));

    $("#site-header").innerHTML = CH.tpl.header();
    $("#site-footer").innerHTML = CH.tpl.footer();
    $$("[data-section]").forEach(function (el) {
      var fn = CH.tpl[el.getAttribute("data-section")];
      if (fn) el.innerHTML = fn(el.dataset);
    });

    if (!firstRender) body.classList.add("rerendered");
    checkImages(document);
    setupReveal();
    setupCounters();
    setupCarousel();
    collectParallax();
    setupFaq();
    restoreForm(formState);
    toTop.setAttribute("aria-label", CH.t("ui.toTop"));
    lbRefreshLabels();
    if (modal.classList.contains("open") && modalCourse) renderModal(modalCourse);
    else $(".modal__dialog", modal).innerHTML = "";
    if (!lb.classList.contains("open")) lbImg.alt = "";
    onScroll();
    firstRender = false;
  }

  /* ---------- Reveal on scroll ---------- */
  var revealObs = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }) : null;

  function setupReveal() {
    $$(".reveal").forEach(function (el) {
      if (!firstRender || !revealObs || reduceMotion) el.classList.add("in");
      else revealObs.observe(el);
    });
  }

  /* ---------- Animated counters ---------- */
  function counterText(el, v) {
    var dec = +el.getAttribute("data-decimals") || 0;
    return (dec ? v.toFixed(dec) : String(Math.round(v))) + (el.getAttribute("data-suffix") || "");
  }
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var start = performance.now(), dur = 1800;
    function step(now) {
      var p = Math.min((now - start) / dur, 1);
      el.textContent = counterText(el, target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var countObs = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        animateCount(en.target);
        countObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.6 }) : null;

  function setupCounters() {
    $$("[data-count]").forEach(function (el) {
      if (!firstRender || !countObs || reduceMotion) el.textContent = counterText(el, parseFloat(el.getAttribute("data-count")));
      else countObs.observe(el);
    });
  }

  /* ---------- Parallax ---------- */
  var parallaxItems = [];
  function collectParallax() {
    parallaxItems = $$(".parallax-bg").map(function (el) {
      return { el: el, speed: parseFloat(el.getAttribute("data-speed")) || 0.2 };
    });
    updateParallax();
  }
  function updateParallax() {
    if (reduceMotion || coarsePointer) return;
    var vh = window.innerHeight;
    parallaxItems.forEach(function (p) {
      var r = p.el.parentElement.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      var offset = r.top + r.height / 2 - vh / 2;
      var max = r.height * 0.14;
      var y = Math.max(-max, Math.min(max, -offset * p.speed));
      p.el.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
    });
  }

  /* ---------- Header, scroll spy, back-to-top ---------- */
  var toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "to-top";
  toTop.innerHTML = I.up;
  body.appendChild(toTop);

  var lastY = window.scrollY, ticking = false;
  var spyIds = ["courses", "teachers", "gallery", "schedule", "pricing", "booking"];

  function onScroll() {
    var y = window.scrollY;
    var header = $("#header");
    if (header) {
      var navOpen = header.classList.contains("nav-open");
      header.classList.toggle("scrolled", y > 60);
      if (y > lastY + 4 && y > 600 && !navOpen) header.classList.add("hidden");
      else if (y < lastY - 4 || y <= 600) header.classList.remove("hidden");
    }
    toTop.classList.toggle("show", y > 900);

    if (CH.page === "index") {
      var current = "top";
      spyIds.forEach(function (id) {
        var s = document.getElementById(id);
        if (s && s.getBoundingClientRect().top <= 160) current = id;
      });
      $$(".nav__link").forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("data-nav") === current);
      });
    }
    updateParallax();
    lastY = y;
  }
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });

  /* ---------- Mobile navigation ---------- */
  function toggleNav(force) {
    var header = $("#header");
    if (!header) return;
    var open = force != null ? force : !header.classList.contains("nav-open");
    if (!open && !header.classList.contains("nav-open")) return;
    header.classList.toggle("nav-open", open);
    var burger = $(".burger", header);
    if (burger) burger.setAttribute("aria-expanded", String(open));
    lockScroll(open);
    if (open) header.classList.remove("hidden");
  }

  var locks = 0;
  function lockScroll(on) {
    locks = Math.max(0, locks + (on ? 1 : -1));
    body.classList.toggle("no-scroll", locks > 0);
  }

  /* ---------- Toasts ---------- */
  var toastBox = document.createElement("div");
  toastBox.className = "toasts";
  toastBox.setAttribute("aria-live", "polite");
  body.appendChild(toastBox);

  function toast(title, text, type) {
    while (toastBox.children.length >= 3) toastBox.firstChild.remove();
    var el = document.createElement("div");
    el.className = "toast" + (type === "error" ? " toast--error" : "");
    el.setAttribute("role", type === "error" ? "alert" : "status");
    el.innerHTML = '<span class="toast__icon">' + (type === "error" ? I.close : I.check) + "</span><div><b></b><p></p></div>";
    $("b", el).textContent = title;
    $("p", el).textContent = text;
    toastBox.appendChild(el);
    body.classList.add("has-toast");
    setTimeout(function () {
      el.classList.add("out");
      setTimeout(function () {
        el.remove();
        if (!toastBox.children.length) body.classList.remove("has-toast");
      }, 400);
    }, 5200);
  }
  CH.toast = toast;

  /* ---------- Course filter ---------- */
  function setCourseFilter(f) {
    CH.state.courseFilter = f;
    $$("[data-filter]").forEach(function (b) {
      var on = b.getAttribute("data-filter") === f;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", String(on));
    });
    var i = 0;
    $$(".course-card").forEach(function (c) {
      var show = f === "all" || c.getAttribute("data-cat") === f;
      c.classList.toggle("is-hidden", !show);
      c.classList.remove("pop");
      if (show) {
        void c.offsetWidth;
        c.style.setProperty("--i", i++);
        c.classList.add("pop", "in");
      }
    });
  }

  function setGalleryFilter(f) {
    CH.state.galleryFilter = f;
    $$("[data-gfilter]").forEach(function (b) {
      var on = b.getAttribute("data-gfilter") === f;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", String(on));
    });
    var i = 0;
    $$(".gallery__item").forEach(function (g) {
      var show = f === "all" || g.getAttribute("data-cat") === f;
      g.classList.toggle("is-hidden", !show);
      g.classList.remove("pop");
      if (show) {
        void g.offsetWidth;
        g.style.setProperty("--i", i++ % 6);
        g.classList.add("pop", "in");
      }
    });
  }

  /* ---------- Course modal ---------- */
  var modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "modal-title");
  modal.innerHTML = '<div class="modal__dialog"></div>';
  body.appendChild(modal);
  var modalCourse = null, lastFocus = null;

  function renderModal(id) {
    $(".modal__dialog", modal).innerHTML = CH.tpl.courseModal(id);
    checkImages(modal);
  }
  function openModal(id) {
    if (!CH.course(id)) return;
    modalCourse = id;
    lastFocus = document.activeElement;
    renderModal(id);
    $(".modal__dialog", modal).scrollTop = 0;
    modal.classList.add("open");
    lockScroll(true);
    setTimeout(function () { var c = $(".modal__close", modal); if (c) c.focus(); }, 60);
  }
  function closeModal() {
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modalCourse = null;
    lockScroll(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ---------- Lightbox ---------- */
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.innerHTML =
    '<span class="lightbox__counter"></span>' +
    '<button type="button" class="lightbox__btn lightbox__close" data-lb="close">' + I.close + "</button>" +
    '<button type="button" class="lightbox__btn lightbox__prev" data-lb="prev">' + I.left + "</button>" +
    '<button type="button" class="lightbox__btn lightbox__next" data-lb="next">' + I.right + "</button>" +
    '<figure class="lightbox__figure"><img class="lightbox__img" alt="" data-fallback="' + CH.data.placeholders.food + '"><figcaption class="lightbox__caption"></figcaption></figure>';
  body.appendChild(lb);
  var lbImg = $(".lightbox__img", lb);
  var lbItems = [], lbIndex = 0;
  lbImg.addEventListener("load", function () { lbImg.classList.add("ready"); });

  function lbRefreshLabels() {
    $(".lightbox__close", lb).setAttribute("aria-label", CH.t("ui.close"));
    $(".lightbox__prev", lb).setAttribute("aria-label", CH.t("ui.prev"));
    $(".lightbox__next", lb).setAttribute("aria-label", CH.t("ui.next"));
  }
  function hiRes(src) {
    if (src.indexOf("images.unsplash.com") === -1) return src;
    return src.replace(/([?&])w=(\d+)/, function (m, p, w) { return p + "w=" + w * 2; })
      .replace(/([?&])h=(\d+)/, function (m, p, h) { return p + "h=" + h * 2; });
  }
  function openLightbox(item) {
    var gallery = item.closest(".gallery");
    var items = $$(".gallery__item:not(.is-hidden)", gallery);
    lbItems = items.map(function (it) {
      return { src: hiRes(it.querySelector("img").getAttribute("src")), caption: it.querySelector(".gallery__caption b").textContent };
    });
    lbIndex = Math.max(0, items.indexOf(item));
    lastFocus = item;
    showLb();
    lb.classList.add("open");
    lockScroll(true);
    setTimeout(function () { $(".lightbox__close", lb).focus(); }, 60);
  }
  function showLb() {
    var it = lbItems[lbIndex];
    if (!it) return;
    lbImg.classList.remove("ready");
    lbImg.alt = it.caption;
    lbImg.src = it.src;
    $(".lightbox__caption", lb).textContent = it.caption;
    $(".lightbox__counter", lb).textContent = (lbIndex + 1) + " / " + lbItems.length;
  }
  function lbStep(dir) {
    if (!lbItems.length) return;
    lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
    showLb();
  }
  function closeLightbox() {
    if (!lb.classList.contains("open")) return;
    lb.classList.remove("open");
    lockScroll(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  var touchX = null;
  lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1);
    touchX = null;
  });

  /* ---------- Calendar ---------- */
  function rerenderCalendar(dir) {
    var wrap = $("[data-calendar]");
    if (!wrap) return;
    wrap.innerHTML = CH.tpl.calendarBody();
    if (dir) {
      var g = $(".calendar__grid", wrap);
      g.style.setProperty("--dir", dir > 0 ? "24px" : "-24px");
      g.classList.add("animating");
    }
  }
  function calAction(a) {
    var st = CH.state.cal;
    if (a === "prev" || a === "next") {
      var dir = a === "next" ? 1 : -1;
      st.month = new Date(st.month.getFullYear(), st.month.getMonth() + dir, 1);
      st.selected = null;
      rerenderCalendar(dir);
      var btn = $('[data-cal="' + a + '"]');
      if (btn && !btn.disabled) btn.focus({ preventScroll: true });
    } else if (a === "all") {
      st.selected = null;
      rerenderCalendar();
    }
  }
  function selectDay(key) {
    var st = CH.state.cal;
    st.selected = st.selected === key ? null : key;
    rerenderCalendar();
    var live = $("[data-cal-live]");
    var h = $(".launches__head h3");
    if (live && h) live.textContent = h.textContent;
    var dayBtn = $('[data-day="' + key + '"]');
    if (dayBtn) dayBtn.focus({ preventScroll: true });
    if (window.innerWidth < 1100 && st.selected) {
      var list = $(".launches");
      if (list) list.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }

  /* ---------- FAQ accordion ---------- */
  function setupFaq() {
    $$(".faq__item").forEach(function (it) {
      var a = $(".faq__a", it);
      a.style.maxHeight = it.classList.contains("open") ? a.scrollHeight + "px" : "0px";
    });
  }
  function toggleFaq(i) {
    CH.state.faqOpen = CH.state.faqOpen === i ? -1 : i;
    $$(".faq__item").forEach(function (it, idx) {
      var open = idx === CH.state.faqOpen;
      it.classList.toggle("open", open);
      $(".faq__q", it).setAttribute("aria-expanded", String(open));
      var a = $(".faq__a", it);
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
    });
  }

  /* ---------- Reviews carousel ---------- */
  var car = null;
  function slidesPerView() {
    var w = window.innerWidth;
    return w >= 1100 ? 3 : w >= 700 ? 2 : 1;
  }
  function setupCarousel() {
    var prevIndex = car ? car.index : 0;
    if (car) clearInterval(car.timer);
    var el = $("[data-carousel]");
    if (!el) { car = null; return; }
    car = {
      root: el,
      track: $(".carousel__track", el),
      vp: $(".carousel__viewport", el),
      dots: $(".carousel__dots", el),
      count: $$(".carousel__slide", el).length,
      index: prevIndex,
      paused: false,
      timer: null
    };
    layoutCarousel();
    el.addEventListener("mouseenter", function () { car.paused = true; });
    el.addEventListener("mouseleave", function () { car.paused = false; });
    el.addEventListener("focusin", function () { car.paused = true; });
    el.addEventListener("focusout", function () { car.paused = false; });
    bindDrag(car);
    startAuto();
  }
  function layoutCarousel() {
    if (!car) return;
    car.spv = slidesPerView();
    car.max = Math.max(0, car.count - car.spv);
    car.root.style.setProperty("--spv", car.spv);
    var html = "";
    for (var i = 0; i <= car.max; i++) html += '<button type="button" data-i="' + i + '" aria-label="' + (i + 1) + '"></button>';
    car.dots.innerHTML = html;
    go(Math.min(car.index, car.max));
  }
  function go(i, user) {
    if (!car) return;
    if (i > car.max) i = 0;
    if (i < 0) i = car.max;
    car.index = i;
    car.track.style.transform = "translate3d(" + (-i * 100 / car.spv) + "%,0,0)";
    $$("button", car.dots).forEach(function (b, k) {
      b.classList.toggle("active", k === i);
      if (k === i) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
    if (user) startAuto();
  }
  function startAuto() {
    if (!car) return;
    clearInterval(car.timer);
    if (reduceMotion) return;
    car.timer = setInterval(function () {
      if (car && !car.paused && !document.hidden) go(car.index + 1);
    }, 5500);
  }
  function bindDrag(c) {
    var drag = null;
    c.vp.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag = { x: e.clientX, dx: 0, id: e.pointerId };
      c.track.classList.add("dragging");
    });
    c.vp.addEventListener("pointermove", function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      drag.dx = e.clientX - drag.x;
      if (Math.abs(drag.dx) > 6 && !c.vp.hasPointerCapture(e.pointerId)) c.vp.setPointerCapture(e.pointerId);
      c.track.style.transform = "translate3d(calc(" + (-c.index * 100 / c.spv) + "% + " + drag.dx + "px),0,0)";
    });
    function end() {
      if (!drag) return;
      c.track.classList.remove("dragging");
      var dx = drag.dx;
      drag = null;
      if (Math.abs(dx) > 50) go(c.index + (dx < 0 ? 1 : -1), true);
      else go(c.index);
    }
    c.vp.addEventListener("pointerup", end);
    c.vp.addEventListener("pointercancel", end);
    c.vp.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") end(); });
  }

  /* ---------- Booking form ---------- */
  function formatPhone(v) {
    var d = v.replace(/\D/g, "");
    if (!d) return "";
    if ("998".indexOf(d) === 0) return "+" + d;
    if (d.indexOf("998") !== 0) d = "998" + d;
    d = d.slice(0, 12);
    var out = "+" + d.slice(0, 3);
    [[3, 5], [5, 8], [8, 10], [10, 12]].forEach(function (r) {
      var part = d.slice(r[0], r[1]);
      if (part) out += " " + part;
    });
    return out;
  }

  function setError(el, msg) {
    var f = el.closest(".field");
    if (!f) return;
    f.classList.toggle("invalid", !!msg);
    $(".field__error", f).textContent = msg;
    if (msg) el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
  }
  function validateField(el) {
    var v = (el.value || "").trim(), ok;
    switch (el.name) {
      case "name": ok = v.length >= 2; break;
      case "phone": ok = /^998\d{9}$/.test(v.replace(/\D/g, "")); break;
      case "course": ok = !!v; break;
      case "date": ok = !!v && v >= CH.isoDate(CH.today); break;
      default: return true;
    }
    setError(el, ok ? "" : CH.t("booking.errors." + el.name));
    return ok;
  }

  CH.submitBooking = function (payload) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        try {
          var list = JSON.parse(localStorage.getItem("ch-bookings") || "[]");
          list.push(Object.assign({ createdAt: new Date().toISOString() }, payload));
          localStorage.setItem("ch-bookings", JSON.stringify(list));
        } catch (e) { /* storage unavailable */ }
        resolve({ ok: true });
      }, 1200);
    });
  };

  function handleSubmit(form) {
    var els = ["name", "phone", "course", "date"].map(function (n) { return form.elements.namedItem(n); });
    var firstBad = null;
    els.forEach(function (el) {
      if (!validateField(el) && !firstBad) firstBad = el;
    });
    if (firstBad) {
      firstBad.focus();
      toast(CH.t("booking.errorTitle"), CH.t("booking.errorText"), "error");
      return;
    }
    var btn = $('button[type="submit"]', form);
    btn.classList.add("is-loading");
    btn.disabled = true;
    var payload = {
      name: form.elements.namedItem("name").value.trim(),
      phone: form.elements.namedItem("phone").value.trim(),
      course: form.elements.namedItem("course").value,
      date: form.elements.namedItem("date").value,
      comment: form.elements.namedItem("comment").value.trim(),
      lang: CH.state.lang
    };
    CH.submitBooking(payload).then(function () {
      var course = CH.course(payload.course);
      toast(CH.t("booking.successTitle"), CH.t("booking.successText", { name: payload.name, course: course ? CH.L(course.title) : "" }));
      form.reset();
    }).catch(function () {
      toast(CH.t("booking.errorTitle"), CH.t("booking.errorText"), "error");
    }).then(function () {
      btn.classList.remove("is-loading");
      btn.disabled = false;
    });
  }

  function saveForm() {
    var form = $("[data-booking-form]");
    if (!form) return null;
    var s = { values: {}, invalid: [] };
    $$("input, select, textarea", form).forEach(function (el) {
      s.values[el.name] = el.value;
      if (el.closest(".field.invalid")) s.invalid.push(el.name);
    });
    return s;
  }
  function restoreForm(s) {
    var form = $("[data-booking-form]");
    if (!form || !s) return;
    Object.keys(s.values).forEach(function (n) {
      var el = form.elements.namedItem(n);
      if (el) el.value = s.values[n];
    });
    s.invalid.forEach(function (n) { validateField(form.elements.namedItem(n)); });
  }

  function prefillFromUrl() {
    var form = $("[data-booking-form]");
    if (!form || !window.URLSearchParams) return;
    var p = new URLSearchParams(location.search);
    var c = p.get("course"), d = p.get("date");
    if (c && CH.course(c)) form.elements.namedItem("course").value = c;
    if (d && /^\d{4}-\d{2}-\d{2}$/.test(d) && d >= CH.isoDate(CH.today)) form.elements.namedItem("date").value = d;
  }

  /* Go to the booking form, optionally with a course and date preselected. */
  function book(courseId, date) {
    toggleNav(false);
    closeModal();
    var form = $("[data-booking-form]");
    if (!form) {
      var q = [];
      if (courseId) q.push("course=" + encodeURIComponent(courseId));
      if (date) q.push("date=" + encodeURIComponent(date));
      location.href = "contacts.html" + (q.length ? "?" + q.join("&") : "") + "#booking";
      return;
    }
    if (courseId) { form.elements.namedItem("course").value = courseId; setError(form.elements.namedItem("course"), ""); }
    if (date) { form.elements.namedItem("date").value = date; setError(form.elements.namedItem("date"), ""); }
    document.getElementById("booking").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setTimeout(function () { form.elements.namedItem("name").focus({ preventScroll: true }); }, 800);
    if (courseId) {
      toast(CH.t("booking.courseSelectedTitle"), CH.t("booking.courseSelectedText", { course: CH.L(CH.course(courseId).title) }));
    }
  }

  /* ---------- Global events ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target, el;
    if (!t.closest) return;

    if ((el = t.closest("[data-lang]"))) { setLang(el.getAttribute("data-lang")); return; }
    if (t.closest("[data-theme-toggle]")) { toggleTheme(); return; }
    if (t.closest(".burger")) { toggleNav(); return; }
    if ((el = t.closest("[data-book]"))) { e.preventDefault(); book(el.getAttribute("data-book"), el.getAttribute("data-date")); return; }
    if (t.closest(".nav a, .logo")) toggleNav(false);
    if ((el = t.closest("[data-filter]"))) { setCourseFilter(el.getAttribute("data-filter")); return; }
    if ((el = t.closest("[data-gfilter]"))) { setGalleryFilter(el.getAttribute("data-gfilter")); return; }
    if ((el = t.closest("[data-course-open]"))) { openModal(el.getAttribute("data-course-open")); return; }
    if ((el = t.closest(".gallery__item"))) { openLightbox(el); return; }
    if ((el = t.closest("[data-cal]"))) { calAction(el.getAttribute("data-cal")); return; }
    if ((el = t.closest("[data-day]"))) { selectDay(el.getAttribute("data-day")); return; }
    if ((el = t.closest("[data-faq]"))) { toggleFaq(+el.getAttribute("data-faq")); return; }
    if ((el = t.closest(".carousel__btn"))) { if (car) go(car.index + (+el.getAttribute("data-dir")), true); return; }
    if ((el = t.closest(".carousel__dots button"))) { go(+el.getAttribute("data-i"), true); return; }
    if (t.closest("[data-modal-close]") || t === modal) { closeModal(); return; }
    if ((el = t.closest("[data-lb]"))) {
      var a = el.getAttribute("data-lb");
      if (a === "close") closeLightbox(); else lbStep(a === "next" ? 1 : -1);
      return;
    }
    if (t === lb || t.classList.contains("lightbox__figure")) { closeLightbox(); return; }
    if (t.closest(".to-top")) { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (lb.classList.contains("open")) closeLightbox();
      else if (modal.classList.contains("open")) closeModal();
      else toggleNav(false);
    } else if (lb.classList.contains("open") && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      lbStep(e.key === "ArrowRight" ? 1 : -1);
    } else if (e.key === "Tab") {
      var scope = lb.classList.contains("open") ? lb : modal.classList.contains("open") ? modal : null;
      if (!scope) return;
      var f = $$("button, a[href], input, select, textarea", scope).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var firstEl = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    }
  });

  document.addEventListener("submit", function (e) {
    var form = e.target.closest && e.target.closest("[data-booking-form]");
    if (!form) return;
    e.preventDefault();
    handleSubmit(form);
  });

  document.addEventListener("input", function (e) {
    var el = e.target;
    if (!el.closest || !el.closest("[data-booking-form]")) return;
    if (el.name === "phone") el.value = formatPhone(el.value);
    if (el.closest(".field.invalid")) validateField(el);
  });
  document.addEventListener("change", function (e) {
    var el = e.target;
    if (el.closest && el.closest("[data-booking-form]") && el.closest(".field.invalid")) validateField(el);
  });

  document.addEventListener("pointermove", function (e) {
    var el = e.target.closest && e.target.closest(".stats, .featured__info");
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (e.clientX - r.left) + "px");
    el.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (car && car.spv !== slidesPerView()) layoutCarousel();
      setupFaq();
      updateParallax();
      if (window.innerWidth > 1100) toggleNav(false);
    }, 150);
  });

  /* ---------- Boot ---------- */
  renderAll();
  prefillFromUrl();

  var booted = false;
  function finishLoading() {
    if (booted) return;
    booted = true;
    body.classList.add("loaded");
    setupFaq();
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) setTimeout(function () { target.scrollIntoView({ behavior: "auto" }); }, 60);
    }
  }
  if (document.readyState === "complete") setTimeout(finishLoading, 150);
  else window.addEventListener("load", function () { setTimeout(finishLoading, 150); });
  setTimeout(finishLoading, 2200);
})();
