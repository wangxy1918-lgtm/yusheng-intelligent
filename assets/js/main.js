/* ============================================================
   Yusheng Intelligent Technology — shared site scripts
   Language toggle · mobile nav · inquiry modal · scroll · forms
   ============================================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "yusheng-lang";

  /* ---------- Language ---------- */
  function currentLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  function applyLang(lang) {
    var nodes = document.querySelectorAll("[data-en][data-zh]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = lang === "zh" ? "data-zh" : "data-en";
      var text = el.getAttribute(key);
      if (text !== null) el.textContent = text;
      var phKey = lang === "zh" ? "data-zh-ph" : "data-en-ph";
      var ph = el.getAttribute(phKey);
      if (ph !== null) el.setAttribute("placeholder", ph);
    }
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    var toggle = document.getElementById("langToggle");
    if (toggle) toggle.textContent = lang === "zh" ? "EN" : "中文";
    var htmlAttr = document.querySelectorAll("[data-html-en][data-html-zh]");
    for (var j = 0; j < htmlAttr.length; j++) {
      var a = htmlAttr[j];
      a.innerHTML = lang === "zh" ? a.getAttribute("data-html-zh") : a.getAttribute("data-html-en");
    }
  }

  function initLang() {
    applyLang(currentLang());
    var toggle = document.getElementById("langToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = currentLang() === "en" ? "zh" : "en";
        localStorage.setItem(STORAGE_KEY, next);
        applyLang(next);
      });
    }
  }

  /* ---------- Header / mobile nav ---------- */
  function initNav() {
    var header = document.querySelector(".site-header");
    var navToggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");

    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (navToggle && nav) {
      navToggle.addEventListener("click", function () {
        nav.classList.toggle("open");
        navToggle.classList.toggle("open");
      });
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          nav.classList.remove("open");
          navToggle.classList.remove("open");
        }
      });
    }
  }

  /* ---------- Inquiry modal ---------- */
  function openModal() {
    var ov = document.getElementById("inquiryModal");
    if (ov) { ov.classList.add("open"); document.body.style.overflow = "hidden"; }
  }
  function closeModal() {
    var ov = document.getElementById("inquiryModal");
    if (ov) { ov.classList.remove("open"); document.body.style.overflow = ""; }
  }

  function initModal() {
    var triggers = document.querySelectorAll("[data-open-modal]");
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener("click", function (e) {
        e.preventDefault();
        var product = this.getAttribute("data-product");
        var select = document.getElementById("inquiryProduct");
        if (select && product) {
          var match = Array.prototype.filter.call(select.options, function (o) { return o.value === product; })[0];
          if (match) select.value = product;
        }
        openModal();
      });
    }
    var close = document.getElementById("modalClose");
    if (close) close.addEventListener("click", closeModal);
    var overlay = document.getElementById("inquiryModal");
    if (overlay) overlay.addEventListener("click", function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }

  /* ---------- Forms ---------- */
  function initForms() {
    var forms = document.querySelectorAll("form[data-ajax]");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", function (e) {
        e.preventDefault();
        var name = this.querySelector('[name="name"]');
        if (name && !name.value.trim()) {
          showToast(document.getElementById("langToggle") && document.documentElement.getAttribute("lang") === "zh-CN" ? "请填写您的姓名" : "Please fill in your name");
          name.focus();
          return;
        }
        this.reset();
        closeModal();
        showToast(document.documentElement.getAttribute("lang") === "zh-CN" ? "询盘已提交，我们会尽快与您联系" : "Inquiry submitted — our team will contact you shortly");
      });
    }
  }

  /* ---------- Toast ---------- */
  function showToast(msg) {
    var t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("revealed");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Image hooks (backgrounds) ---------- */
  function initImages() {
    var cards = document.querySelectorAll("[data-img]");
    for (var i = 0; i < cards.length; i++) {
      var f = cards[i].getAttribute("data-img");
      if (f) cards[i].style.backgroundImage = "url('assets/img/" + f + "')";
    }
    var hero = document.querySelector("[data-hero-img]");
    if (hero) {
      var hf = hero.getAttribute("data-hero-img");
      if (hf) {
        hero.style.backgroundImage = "url('assets/img/" + hf + "')";
        hero.classList.add("show");
      }
    }
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initNav();
    initModal();
    initForms();
    initReveal();
    initYear();
    initImages();
  });
})();
