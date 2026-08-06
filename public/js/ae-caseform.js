// Case review form: expands the "Get your case reviewed" Tally form
// inline, in place, instead of sending the reader to a new tab. One
// delegated listener handles every .case-form block on the page (there
// is at most one per blog post). If JS never runs, the CTA is a plain
// <a href="https://tally.so/r/Y5voaW" target="_blank">, so nothing
// breaks with JS off.
//
// Runs after ae-analytics.js, which has already appended ?src=&pos=&cid=
// to every tally.so link by the time a click can happen, so this file
// reuses the anchor's live href rather than rebuilding attribution.
(() => {
  let tallyEmbedLoaded = false;
  const ensureTallyEmbedScript = () => new Promise((resolve) => {
    if (tallyEmbedLoaded || window.Tally) { tallyEmbedLoaded = true; resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://tally.so/widgets/embed.js";
    s.async = true;
    s.onload = () => { tallyEmbedLoaded = true; resolve(); };
    s.onerror = () => resolve();
    document.body.appendChild(s);
  });

  document.addEventListener("click", async (e) => {
    const trigger = e.target.closest("[data-case-form-open]");
    if (!trigger) return;
    const card = trigger.closest(".case-form");
    const embed = card && card.querySelector(".case-form-embed");
    if (!embed) return; // no mount point, let the link behave normally

    e.preventDefault();

    const cta = trigger.closest(".case-form-cta") || trigger.parentElement;
    const url = new URL(trigger.href);
    url.pathname = url.pathname.replace("/r/", "/embed/");
    url.searchParams.set("alignLeft", "1");
    url.searchParams.set("hideTitle", "1");
    url.searchParams.set("transparentBackground", "1");
    url.searchParams.set("dynamicHeight", "1");

    embed.innerHTML = '<iframe data-tally-src="' + url.toString() +
      '" width="100%" height="480" frameborder="0" title="Get your case reviewed"></iframe>';
    embed.hidden = false;
    if (cta) cta.hidden = true;

    await ensureTallyEmbedScript();
    if (window.Tally && typeof window.Tally.loadEmbeds === "function") {
      window.Tally.loadEmbeds();
    }
    embed.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();
