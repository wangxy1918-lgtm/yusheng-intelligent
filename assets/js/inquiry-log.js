/* ============================================================
   Inquiry Log admin page (inquiry-log.html)
   Gate by access key → fetch inquiries from the Worker (D1) → render table
   ============================================================ */
(function () {
  "use strict";

  var API = "https://inquiry-worker.wangxy1918.workers.dev/api/list";
  var gate = document.getElementById("gate");
  var log = document.getElementById("log");
  var keyInput = document.getElementById("keyInput");
  var loadBtn = document.getElementById("loadBtn");
  var gateMsg = document.getElementById("gateMsg");
  var refreshBtn = document.getElementById("refreshBtn");
  var tbody = document.getElementById("inqBody");
  var count = document.getElementById("inqCount");
  var empty = document.getElementById("inqEmpty");

  if (!loadBtn) return; // 不在询盘页则跳过

  function isZh() { return document.documentElement.getAttribute("lang") === "zh-CN"; }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function load() {
    var key = (sessionStorage.getItem("ys-inq-key") || keyInput.value || "").trim();
    if (!key) { gateMsg.textContent = isZh() ? "请输入访问密码" : "Enter the access key"; return; }
    loadBtn.disabled = true;
    loadBtn.textContent = isZh() ? "加载中…" : "Loading…";
    fetch(API + "?key=" + encodeURIComponent(key))
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (data) {
        loadBtn.disabled = false;
        loadBtn.textContent = isZh() ? "查看询盘" : "Load Inquiries";
        if (!data.ok || !data.inquiries) { gateMsg.textContent = isZh() ? "密码错误" : "Wrong access key"; return; }
        sessionStorage.setItem("ys-inq-key", key);
        gate.style.display = "none";
        log.style.display = "block";
        render(data.inquiries);
      })
      .catch(function () {
        loadBtn.disabled = false;
        loadBtn.textContent = isZh() ? "查看询盘" : "Load Inquiries";
        gateMsg.textContent = isZh() ? "网络异常，请重试" : "Network error, please retry";
      });
  }

  function render(list) {
    count.textContent = isZh() ? "共 " + list.length + " 条询盘" : list.length + " inquiries";
    empty.style.display = list.length ? "none" : "block";
    tbody.innerHTML = list.map(function (r) {
      var t = String(r.created_at || "").replace("T", " ").slice(0, 16);
      return "<tr>" +
        "<td>" + esc(r.id) + "</td>" +
        "<td class='time'>" + esc(t) + "</td>" +
        "<td>" + esc(r.name) + "</td>" +
        "<td><a href='mailto:" + esc(r.email) + "'>" + esc(r.email) + "</a></td>" +
        "<td>" + esc(r.product) + "</td>" +
        "<td class='msg'>" + esc(r.message) + "</td>" +
        "<td>" + esc(r.page) + "</td>" +
        "</tr>";
    }).join("");
  }

  loadBtn.addEventListener("click", load);
  refreshBtn.addEventListener("click", load);
  keyInput.addEventListener("keydown", function (e) { if (e.key === "Enter") load(); });
  if (sessionStorage.getItem("ys-inq-key")) { keyInput.value = sessionStorage.getItem("ys-inq-key"); load(); }
})();
