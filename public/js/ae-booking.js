// Booking: every "book a call" button and link opens the Cal.com calendar as a
// popup over the page, using Cal.com's official embed. Nothing from Cal.com
// downloads until a visitor shows intent (hover, touch, focus or click).
//
// Markup: <a data-book href="https://cal.com/appealedge/discovery-call" target="_blank" rel="noopener">
// The href is the fallback. With JS off, a modifier click, or if the popup
// cannot load (blocked script, offline, slow network), the link opens the same
// calendar in a new tab.
//
// After a scan, ae-scanner.js calls AEBooking.setPrefill(). The detected issue and
// the notice text then go into the booking question "Describe what happened or
// Paste your suspension notice", and the email into the email field. With no scan,
// the calendar just opens.
//
// Analytics: the click itself is reported by ae-analytics.js (cta_click, destination
// "cal"). A completed booking is reported here as generate_lead.
(() => {
  const CAL_LINK = "appealedge/discovery-call";
  const NS = "discovery-call";
  const ORIGIN = "https://app.cal.com";
  const PUBLIC_URL = "https://cal.com/appealedge/discovery-call";
  // Cal.com's identifier for the booking question, from the event's booking fields.
  const NOTICE_FIELD = "Describe-what-happened-or-Paste-your-suspension-notice";
  const NOTICE_MAX = 1500; // keeps the prefill URL a safe length
  const LOAD_TIMEOUT_MS = 8000;

  const path = location.pathname;
  let pageType = "other";
  if (path === "/") pageType = "home";
  else if (path === "/blog/") pageType = "blog_index";
  else if (/^\/blog\/[^/]+\/$/.test(path)) pageType = "blog_post";
  else if (/^\/amazon-[^/]*service[^/]*\/$/.test(path)) pageType = "service";

  let started = false;
  let scriptLoaded = false;
  let scriptFailed = false;
  let prefill = null;
  let pending = null; // booking request waiting for embed.js

  const start = () => {
    if (started) return;
    started = true;
    // Cal.com's official embed loader, unchanged. It queues calls until embed.js arrives.
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, ORIGIN + "/embed/embed.js", "init");

    window.Cal("init", NS, { origin: ORIGIN });
    window.Cal.ns[NS]("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: { light: { "cal-brand": "#2B50FF" }, dark: { "cal-brand": "#2B50FF" } },
    });
    window.Cal.ns[NS]("on", { action: "bookingSuccessful", callback: onBooked });

    const el = document.querySelector('script[src="' + ORIGIN + '/embed/embed.js"]');
    if (el) {
      el.addEventListener("load", () => { scriptLoaded = true; pending = null; });
      el.addEventListener("error", () => {
        scriptFailed = true;
        if (pending) { const p = pending; pending = null; openFallback(p); }
      });
    }
  };

  const clientId = () => {
    const m = document.cookie.match(/(?:^|;\s*)_ga=GA1\.\d\.(\d+\.\d+)/);
    return m ? m[1] : "";
  };

  const onBooked = () => {
    let key = "ae_lead_" + clientId() + path;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch (e) { /* storage blocked: report anyway */ }
    if (typeof gtag === "function") {
      gtag("event", "generate_lead", {
        source_page: path,
        cta_position: window.__aeLastCtaPos || "unknown",
        cta_destination: "cal",
        page_type: pageType,
        currency: "USD",
        value: 1,
      });
    }
  };

  const noticeText = (p) => {
    if (!p || (!p.issue && !p.notice)) return "";
    let out = p.issue ? "Detected issue: " + p.issue : "";
    if (p.notice) out += (out ? "\n\n" : "") + "Notice:\n" + p.notice.slice(0, NOTICE_MAX);
    return out;
  };

  const prefillParams = (p) => {
    const q = {};
    if (p && p.email) q.email = p.email;
    const text = noticeText(p);
    if (text) q[NOTICE_FIELD] = text;
    return q;
  };

  const openFallback = (p) => {
    const url = new URL(PUBLIC_URL);
    const q = prefillParams(p);
    Object.keys(q).forEach((k) => url.searchParams.set(k, q[k]));
    window.open(url.toString(), "_blank", "noopener");
  };

  const open = (extra) => {
    const p = Object.assign({}, prefill || {}, extra || {});
    if (scriptFailed) { openFallback(p); return; }
    start();
    const config = Object.assign({ layout: "month_view" }, prefillParams(p));
    if (!scriptLoaded) pending = p;
    window.Cal.ns[NS]("modal", { calLink: CAL_LINK, config: config });
    // If embed.js never arrives, give the visitor the calendar in a new tab.
    setTimeout(() => {
      if (pending && !scriptLoaded) {
        scriptFailed = true;
        const q = pending; pending = null;
        openFallback(q);
      }
    }, LOAD_TIMEOUT_MS);
  };

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented) return;
    const t = e.target.closest && e.target.closest("[data-book]");
    if (!t) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // new tab as asked
    e.preventDefault();
    open();
  });

  // Warm the embed up when someone shows intent, so the first click is quick.
  const warm = (e) => {
    if (started || scriptFailed) return;
    if (e.target.closest && e.target.closest("[data-book]")) start();
  };
  document.addEventListener("pointerover", warm, { passive: true });
  document.addEventListener("touchstart", warm, { passive: true });
  document.addEventListener("focusin", warm);

  window.AEBooking = {
    open: open,
    warm: start,
    setPrefill: (p) => { prefill = p || null; },
    clearPrefill: () => { prefill = null; },
    publicUrl: PUBLIC_URL,
  };
})();
