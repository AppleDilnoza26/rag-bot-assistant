/* Culinary House — AI consultant chat widget (talks to /api/chat on the Node server). */
(function () {
  "use strict";

  var STORE_KEY = "ch-chat";
  var MAX_STORED = 30;
  var HISTORY_SENT = 8;

  var TEXT = {
    ru: {
      title: "AI-консультант",
      sub: "Ответы по базе знаний школы",
      open: "Открыть чат с консультантом",
      close: "Закрыть чат",
      clear: "Очистить чат",
      placeholder: "Задайте вопрос о курсах…",
      send: "Отправить",
      welcome: "Здравствуйте! Я AI-консультант Culinary House. Помогу выбрать курс и расскажу о ценах, рассрочке, графике преподавателей и подготовке к занятиям.",
      suggestions: [
        "Сколько стоит курс «Кондитерское дело»?",
        "Какие курсы можно оплатить в рассрочку?",
        "Когда работает Тимур Ахмедов?",
        "Что взять с собой на занятие?"
      ],
      sources: "Источники",
      sourceNames: { "price-list": "Прайс-лист", faq: "FAQ", "work-schedule": "График работы" },
      errNetwork: "Не удалось получить ответ. Попробуйте ещё раз или позвоните нам: +998 71 200 45 45.",
      errConfig: "Консультант временно недоступен. Свяжитесь с нами по телефону +998 71 200 45 45 или в Telegram @culinaryhouse_uz.",
      errRate: "Слишком много сообщений подряд. Подождите минуту и попробуйте снова.",
      note: "AI может ошибаться. Точные условия уточняйте у администратора."
    },
    uz: {
      title: "AI-maslahatchi",
      sub: "Maktab bilimlar bazasi asosida javoblar",
      open: "Maslahatchi bilan chatni ochish",
      close: "Chatni yopish",
      clear: "Chatni tozalash",
      placeholder: "Kurslar haqida savol bering…",
      send: "Yuborish",
      welcome: "Assalomu alaykum! Men Culinary House AI-maslahatchisiman. Kurs tanlashga yordam beraman, narxlar, muddatli toʻlov, oʻqituvchilar jadvali va darsga tayyorgarlik haqida aytib beraman.",
      suggestions: [
        "«Qandolatchilik» kursi qancha turadi?",
        "Qaysi kurslarni muddatli toʻlov bilan olish mumkin?",
        "Timur Ahmedov qachon ishlaydi?",
        "Darsga nima olib kelish kerak?"
      ],
      sources: "Manbalar",
      sourceNames: { "price-list": "Narxlar roʻyxati", faq: "FAQ", "work-schedule": "Ish jadvali" },
      errNetwork: "Javob olinmadi. Qayta urinib koʻring yoki bizga qoʻngʻiroq qiling: +998 71 200 45 45.",
      errConfig: "Maslahatchi vaqtincha ishlamayapti. Biz bilan +998 71 200 45 45 telefoni yoki Telegram @culinaryhouse_uz orqali bogʻlaning.",
      errRate: "Ketma-ket juda koʻp xabar. Bir daqiqa kuting va qayta urinib koʻring.",
      note: "AI xato qilishi mumkin. Aniq shartlarni administratordan soʻrang."
    }
  };

  var ICONS = {
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.4A8.5 8.5 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    mark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M7 13.2A3.2 3.2 0 0 1 7.6 6.9 4.6 4.6 0 0 1 12 4a4.6 4.6 0 0 1 4.4 2.9A3.2 3.2 0 0 1 17 13.2V18H7z"/><path d="M7 15.5h10" stroke-linecap="round"/></svg>'
  };

  var root = document.documentElement;
  var body = document.body;
  var messages = load();
  var busy = false;
  var controller = null;

  function lang() { return root.lang === "uz" ? "uz" : "ru"; }
  function tx(key) { return TEXT[lang()][key]; }

  function load() {
    try {
      var list = JSON.parse(sessionStorage.getItem(STORE_KEY) || "[]");
      return Array.isArray(list) ? list.filter(function (m) { return m && m.text && !m.pending; }) : [];
    } catch (e) { return []; }
  }
  function save() {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.filter(function (m) { return !m.pending; }).slice(-MAX_STORED)));
    } catch (e) { /* storage unavailable */ }
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function linkify(html) {
    return html
      .replace(/\+998[\d\s]{9,12}\d/g, function (p) { return '<a href="tel:' + p.replace(/\s/g, "") + '">' + p + "</a>"; })
      .replace(/@culinaryhouse_uz\b/g, '<a href="https://t.me/culinaryhouse_uz" target="_blank" rel="noopener">@culinaryhouse_uz</a>')
      .replace(/@culinaryhouse\.uz\b/g, '<a href="https://instagram.com/culinaryhouse.uz" target="_blank" rel="noopener">@culinaryhouse.uz</a>');
  }

  /* Minimal, safe markdown: **bold**, "- " / "1. " lists, line breaks. */
  function format(text) {
    var out = [], list = null;
    esc(text).split(/\n/).forEach(function (raw) {
      var line = raw.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
      var m = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
      if (m) {
        if (!list) { list = []; }
        list.push("<li>" + m[1] + "</li>");
        return;
      }
      if (list) { out.push("<ul>" + list.join("") + "</ul>"); list = null; }
      if (line.trim()) out.push("<p>" + line + "</p>");
    });
    if (list) out.push("<ul>" + list.join("") + "</ul>");
    return linkify(out.join(""));
  }

  /* ---------- DOM ---------- */
  var launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "ch-ai__launcher";
  launcher.innerHTML = '<span class="ch-ai__launcher-open">' + ICONS.chat + '</span><span class="ch-ai__launcher-close">' + ICONS.close + "</span>";

  var panel = document.createElement("section");
  panel.className = "ch-ai__panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.hidden = true;
  panel.innerHTML =
    '<header class="ch-ai__head">' +
      '<span class="ch-ai__avatar">' + ICONS.mark + "</span>" +
      '<div class="ch-ai__heading"><b data-ch-ai="title"></b><span><i class="ch-ai__dot"></i><span data-ch-ai="sub"></span></span></div>' +
      '<button type="button" class="ch-ai__icon" data-ch-ai-action="clear">' + ICONS.trash + "</button>" +
      '<button type="button" class="ch-ai__icon" data-ch-ai-action="close">' + ICONS.close + "</button>" +
    "</header>" +
    '<div class="ch-ai__log" role="log" aria-live="polite"></div>' +
    '<form class="ch-ai__form">' +
      '<textarea class="ch-ai__input" rows="1" maxlength="1000"></textarea>' +
      '<button type="submit" class="ch-ai__send">' + ICONS.send + "</button>" +
    "</form>" +
    '<p class="ch-ai__note" data-ch-ai="note"></p>';

  body.appendChild(panel);
  body.appendChild(launcher);
  body.classList.add("has-assistant");

  var log = panel.querySelector(".ch-ai__log");
  var form = panel.querySelector(".ch-ai__form");
  var input = panel.querySelector(".ch-ai__input");
  var sendBtn = panel.querySelector(".ch-ai__send");

  function applyLabels() {
    panel.setAttribute("aria-label", tx("title"));
    panel.querySelectorAll("[data-ch-ai]").forEach(function (el) { el.textContent = tx(el.getAttribute("data-ch-ai")); });
    panel.querySelector('[data-ch-ai-action="clear"]').setAttribute("aria-label", tx("clear"));
    panel.querySelector('[data-ch-ai-action="clear"]').title = tx("clear");
    panel.querySelector('[data-ch-ai-action="close"]').setAttribute("aria-label", tx("close"));
    launcher.setAttribute("aria-label", isOpen() ? tx("close") : tx("open"));
    input.placeholder = tx("placeholder");
    input.setAttribute("aria-label", tx("placeholder"));
    sendBtn.setAttribute("aria-label", tx("send"));
  }

  function messageHtml(m) {
    if (m.role === "user") return '<div class="ch-ai__msg ch-ai__msg--user">' + esc(m.text).replace(/\n/g, "<br>") + "</div>";
    var cls = "ch-ai__msg ch-ai__msg--bot" + (m.error ? " ch-ai__msg--error" : "");
    var inner = m.pending && !m.text
      ? '<span class="ch-ai__typing"><i></i><i></i><i></i></span>'
      : format(m.errorKey ? tx(m.errorKey) : m.text);
    var sources = "";
    if (m.sources && m.sources.length && !m.pending) {
      var names = tx("sourceNames");
      sources = '<div class="ch-ai__sources">' + esc(tx("sources")) + ": " +
        m.sources.map(function (s) { return "<span>" + esc(names[s] || s) + "</span>"; }).join("") + "</div>";
    }
    return '<div class="' + cls + '">' + inner + sources + "</div>";
  }

  function render() {
    var html = '<div class="ch-ai__msg ch-ai__msg--bot">' + format(tx("welcome")) + "</div>";
    if (!messages.length) {
      html += '<div class="ch-ai__chips">' + tx("suggestions").map(function (s) {
        return '<button type="button" class="ch-ai__chip" data-ch-ai-ask="' + esc(s) + '">' + esc(s) + "</button>";
      }).join("") + "</div>";
    }
    html += messages.map(messageHtml).join("");
    log.innerHTML = html;
    scrollDown(true);
  }

  function updateLast() {
    var last = log.lastElementChild;
    var m = messages[messages.length - 1];
    if (!last || !m) return render();
    var stick = log.scrollHeight - log.scrollTop - log.clientHeight < 80;
    last.outerHTML = messageHtml(m);
    if (stick) scrollDown(true);
  }

  function scrollDown(force) {
    if (force) log.scrollTop = log.scrollHeight;
  }

  function setBusy(v) {
    busy = v;
    sendBtn.disabled = v;
    panel.classList.toggle("is-busy", v);
  }

  function autoSize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  }

  /* ---------- Open / close ---------- */
  function isOpen() { return panel.classList.contains("open"); }
  function mobile() { return window.matchMedia("(max-width: 640px)").matches; }

  function open() {
    panel.hidden = false;
    // Force a reflow so the opening transition runs after `hidden` is removed.
    void panel.offsetWidth;
    panel.classList.add("open");
    launcher.classList.add("is-open");
    body.classList.add("ch-ai-open");
    if (mobile()) body.classList.add("no-scroll");
    applyLabels();
    render();
    setTimeout(function () { input.focus(); }, 60);
  }

  function close() {
    panel.classList.remove("open");
    launcher.classList.remove("is-open");
    body.classList.remove("ch-ai-open");
    if (!document.querySelector(".mobile-nav.open, .modal.open, .lightbox.open")) body.classList.remove("no-scroll");
    applyLabels();
    setTimeout(function () { if (!isOpen()) panel.hidden = true; }, 350);
    launcher.focus();
  }

  /* ---------- Sending ---------- */
  function history() {
    return messages
      .filter(function (m) { return !m.error && !m.pending; })
      .slice(-HISTORY_SENT)
      .map(function (m) { return { role: m.role, text: m.text }; });
  }

  function fail(bot, key) {
    bot.text = tx(key);
    bot.errorKey = key;
    bot.error = true;
    bot.pending = false;
  }

  function ask(text) {
    text = String(text || "").trim();
    if (!text || busy) return;

    var past = history();
    messages.push({ role: "user", text: text });
    var bot = { role: "assistant", text: "", pending: true };
    messages.push(bot);
    input.value = "";
    autoSize();
    render();
    setBusy(true);

    controller = "AbortController" in window ? new AbortController() : null;
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: past, lang: lang() }),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (res.status === 503) return fail(bot, "errConfig");
      if (res.status === 429) return fail(bot, "errRate");
      if (!res.ok || !res.body) return fail(bot, "errNetwork");
      return readStream(res.body, bot);
    }).catch(function (e) {
      if (e && e.name === "AbortError") { bot.pending = false; return; }
      fail(bot, "errNetwork");
    }).then(function () {
      bot.pending = false;
      if (!bot.text) fail(bot, "errNetwork");
      controller = null;
      setBusy(false);
      updateLast();
      save();
    });
  }

  function readStream(stream, bot) {
    var reader = stream.getReader();
    var decoder = new TextDecoder();
    var buffer = "";

    function handle(evt) {
      if (evt.t) { bot.text += evt.t; updateLast(); }
      if (evt.done) bot.sources = evt.sources || [];
      if (evt.error) fail(bot, evt.error === "rate_limited" ? "errRate" : "errNetwork");
    }

    function pump() {
      return reader.read().then(function (r) {
        if (r.done) return;
        buffer += decoder.decode(r.value, { stream: true });
        var parts = buffer.split("\n\n");
        buffer = parts.pop();
        parts.forEach(function (p) {
          var line = p.trim();
          if (line.indexOf("data:") !== 0) return;
          try { handle(JSON.parse(line.slice(5))); } catch (e) { /* ignore malformed event */ }
        });
        return pump();
      });
    }
    return pump();
  }

  function clearChat() {
    if (controller) controller.abort();
    messages = [];
    save();
    render();
    input.focus();
  }

  /* ---------- Events ---------- */
  launcher.addEventListener("click", function () { isOpen() ? close() : open(); });

  panel.addEventListener("click", function (e) {
    var t = e.target.closest("[data-ch-ai-action], [data-ch-ai-ask]");
    if (!t) return;
    if (t.hasAttribute("data-ch-ai-ask")) return ask(t.getAttribute("data-ch-ai-ask"));
    var action = t.getAttribute("data-ch-ai-action");
    if (action === "close") close();
    if (action === "clear") clearChat();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    ask(input.value);
  });

  input.addEventListener("input", autoSize);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      ask(input.value);
    }
  });

  panel.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { e.stopPropagation(); close(); }
  });

  // The site re-renders on language change and updates <html lang>; follow it.
  new MutationObserver(function () {
    applyLabels();
    if (isOpen()) render();
  }).observe(root, { attributes: true, attributeFilter: ["lang"] });

  applyLabels();
})();
