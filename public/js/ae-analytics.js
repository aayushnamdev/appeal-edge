// Shared CTA tracking, loaded on every page.
// Tags every outbound conversion click with position + destination, appends
// attribution params to Tally links, and reports a gtag event. Nothing here
// intercepts navigation: every tracked link opens target="_blank", so the
// beacon always has time to send before the tab changes.

(() => {
  // Page type, derived once from the path.
  const path = location.pathname;
  let pageType = "other";
  if (path === "/") pageType = "home";
  else if (path === "/blog/") pageType = "blog_index";
  else if (/^\/blog\/[^/]+\/$/.test(path)) pageType = "blog_post";
  else if (path === "/privacy-policy/" || path === "/terms/") pageType = "legal";
  else if (path === "/thank-you/") pageType = "thank_you";
  else if (/^\/experts\/[^/]+\/$/.test(path)) pageType = "expert";
  else if (/^\/amazon-[^/]*service[^/]*\/$/.test(path)) pageType = "service";

  // GA4 client id, read straight from the _ga cookie so it's available
  // synchronously at click time (no gtag('get', ...) round trip).
  const getClientId = () => {
    const match = document.cookie.match(/(?:^|;\s*)_ga=GA1\.\d\.(\d+\.\d+)/);
    return match ? match[1] : "";
  };
  const clientId = getClientId();

  const positionOf = (a) => {
    if (a.closest("header.nav")) return "nav";
    if (a.closest(".hero")) return "hero";
    if (a.closest(".scan-zone")) return "mid_page";
    if (a.closest(".blog-cta")) return "mid_page";
    if (a.closest(".cta-card") || a.closest(".case-form")) return "article_end";
    if (a.closest(".prefooter")) return "prefooter";
    if (a.classList.contains("wa-fab")) return "float_wa";
    if (a.closest(".social-rail")) return "social_rail";
    if (a.closest(".footer-cols")) return "footer_link";
    return "other";
  };

  const destinationOf = (href) => {
    if (href.includes("tally.so")) return "tally";
    if (href.includes("wa.me")) return "whatsapp";
    if (href.startsWith("mailto:")) return "email";
    if (href.includes("instagram.com") || href.includes("linkedin.com")) return "social";
    if (href.includes("#understand")) return "scanner";
    return "outbound_other";
  };

  // Append attribution params to every Tally link so a submission can be
  // traced back to the page and button that produced it. Tally reads these
  // as hidden fields (src, pos, cid) if the form is configured to accept them.
  const tagTallyLinks = () => {
    document.querySelectorAll('a[href*="tally.so"]:not([data-ae-tagged])').forEach((a) => {
      const url = new URL(a.href);
      url.searchParams.set("src", path);
      url.searchParams.set("pos", positionOf(a));
      if (clientId) url.searchParams.set("cid", clientId);
      a.href = url.toString();
      a.setAttribute("data-ae-tagged", "1");
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tagTallyLinks);
  } else {
    tagTallyLinks();
  }

  // One delegated listener catches every CTA regardless of when it was
  // inserted or retagged. Duplicate outbound_click events from GA4 Enhanced
  // Measurement are expected and harmless; report on cta_click instead.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.href;
    const isTracked = href.includes("tally.so") || href.includes("wa.me") ||
      href.startsWith("mailto:") || href.includes("instagram.com") || href.includes("linkedin.com") ||
      href.includes("#understand");
    if (!isTracked) return;

    if (typeof gtag === "function") {
      gtag("event", "cta_click", {
        cta_position: positionOf(a),
        cta_destination: destinationOf(href),
        cta_label: (a.textContent || "").trim().slice(0, 60),
        source_page: path,
        page_type: pageType,
      });
    }
  });

  // Embedded Tally forms (the scanner's result panel, and the blog
  // case-form panel) submit inside an iframe. Tally's own "redirect on
  // completion" then navigates that iframe to /thank-you/, not the
  // parent tab, so the generate_lead conversion there never fires for an
  // embedded submission. Tally also posts a Tally.FormSubmitted message
  // to the parent window on every embed, iframe or not, so catch it here
  // instead. Guarded with the same sessionStorage key /thank-you/ uses,
  // so a submission is never double counted if its iframe does happen to
  // load the redirect.
  window.addEventListener("message", (e) => {
    if (e.origin !== "https://tally.so") return;
    let payload = e.data;
    if (typeof payload === "string") {
      try { payload = JSON.parse(payload); } catch { return; }
    }
    if (!payload || payload.event !== "Tally.FormSubmitted") return;

    const key = "ae_lead_" + clientId + path;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    let pos = "unknown";
    document.querySelectorAll("iframe").forEach((frame) => {
      if (frame.contentWindow !== e.source) return;
      const src = frame.getAttribute("src") || frame.getAttribute("data-tally-src") || "";
      try { pos = new URL(src, location.href).searchParams.get("pos") || "unknown"; } catch {}
    });

    if (typeof gtag === "function") {
      gtag("event", "generate_lead", {
        source_page: path,
        cta_position: pos,
        cta_destination: "tally",
        page_type: pageType,
        currency: "USD",
        value: 1,
      });
    }

    // Swap the iframe for a short native note. It already submitted;
    // showing Tally's own thank-you page inside a small embed reads odd.
    document.querySelectorAll(".scan-tally-wrap, .case-form-embed").forEach((wrap) => {
      if (!wrap.querySelector("iframe")) return;
      wrap.innerHTML = '<div class="tally-submitted-note"><strong>Got it.</strong>' +
        "We will reach out with next steps. Confidential, no charge to review.</div>";
    });
  });
})();
