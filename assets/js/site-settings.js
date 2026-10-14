// Points the "Download CV" button at the CV uploaded in admin.html.
// If nothing is uploaded (or Supabase is not configured) the bundled PDF is used.
(function () {
  'use strict';
  var cfg = window.PORTFOLIO_CONFIG || {};
  var links = function () { return document.querySelectorAll('[data-cv-link]'); };

  // open the CV in a popup window (falls back to a new tab if popups are blocked)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-cv-link]');
    if (!a) return;
    var w = window.open(a.href, 'CVPopup', 'width=900,height=700,resizable=yes,scrollbars=yes');
    if (w) e.preventDefault();
  });

  var configured = cfg.supabaseUrl && cfg.supabaseAnonKey &&
    cfg.supabaseUrl.indexOf('YOUR_') !== 0 && cfg.supabaseAnonKey.indexOf('YOUR_') !== 0;
  if (!configured || !window.fetch) return;

  fetch(cfg.supabaseUrl.replace(/\/$/, '') + '/rest/v1/site_settings?select=value&key=eq.cv_url', {
    headers: { apikey: cfg.supabaseAnonKey, Authorization: 'Bearer ' + cfg.supabaseAnonKey }
  }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (rows) {
      var v = rows && rows[0] && rows[0].value;
      if (v && /^https?:\/\//i.test(v)) {
        Array.prototype.forEach.call(links(), function (a) { a.href = v; });
      }
    })
    .catch(function () { /* keep the bundled CV */ });
})();
