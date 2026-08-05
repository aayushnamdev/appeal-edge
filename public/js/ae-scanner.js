// Free case scan: paste, drop, or clipboard-paste a notice, with email
// optional and upfront in the same step. On a result, an inline Tally
// embed offers the deeper specialist review without a new tab.
//
// Extracted from frontend-v2/index.html so the identical scan-zone
// markup can be embedded on the homepage and inside blog posts. Fully
// self contained: only touches elements by id, defines its own
// getClientId, and posts directly to /api/analyze. Safe to load on any
// page; if #scan-form is not present it does nothing.
(() => {
  const form = document.getElementById("scan-form");
  const textEl = document.getElementById("scan-text");
  const fileEl = document.getElementById("scan-file");
  const fileNameEl = document.getElementById("scan-file-name");
  const emailEl = document.getElementById("scan-email");
  const dropZone = document.getElementById("scan-drop-zone");
  const submitBtn = document.getElementById("scan-submit");
  const emptyEl = document.getElementById("scan-empty");
  const loadingEl = document.getElementById("scan-loading");
  const errorEl = document.getElementById("scan-error");
  const resultsEl = document.getElementById("scan-results");
  const resetBtn = document.getElementById("scan-reset");
  if (!form) return;

  let lastResult = null;

  const updateFileName = () => {
    fileNameEl.textContent = fileEl.files.length
      ? Array.from(fileEl.files).map(f => f.name).join(", ")
      : "";
  };
  fileEl.addEventListener("change", updateFileName);

  // Assign a set of files to the hidden input from any source (click,
  // drop, or clipboard paste), all going through the same multer field.
  const assignFiles = (fileList) => {
    const dt = new DataTransfer();
    Array.from(fileList).forEach(f => dt.items.add(f));
    fileEl.files = dt.files;
    updateFileName();
  };

  // Clipboard paste: a suspension notice is very often a screenshot
  // already on the clipboard. No save-to-desktop, no file picker.
  const scanCard = form.closest(".scan-input-col");
  scanCard.addEventListener("paste", (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    const images = Array.from(items)
      .filter(i => i.kind === "file" && i.type.startsWith("image/"))
      .map(i => i.getAsFile())
      .filter(Boolean);
    if (images.length) {
      assignFiles(images);
    }
  });

  // Drag and drop onto the upload row.
  ["dragover", "dragenter"].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    });
  });
  ["dragleave", "drop"].forEach(evt => {
    dropZone.addEventListener(evt, () => dropZone.classList.remove("drag-over"));
  });
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files.length) {
      assignFiles(e.dataTransfer.files);
    }
  });

  const showError = (message) => {
    emptyEl.hidden = true;
    errorEl.textContent = message;
    errorEl.hidden = false;
  };

  // Reads the GA4 client id from the _ga cookie, same approach as
  // ae-analytics.js, kept local here to avoid coupling to that file's
  // internals.
  const getClientId = () => {
    const match = document.cookie.match(/(?:^|;\s*)_ga=GA1\.\d\.(\d+\.\d+)/);
    return match ? match[1] : "";
  };

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

  const renderTallyEmbed = async (data) => {
    const wrap = document.getElementById("scan-tally-wrap");
    const params = new URLSearchParams({
      alignLeft: "1", hideTitle: "1", transparentBackground: "1", dynamicHeight: "1",
      src: location.pathname,
      pos: "scan_result",
      cid: getClientId(),
      caseType: data.caseType || "",
      synthesis: (data.synthesis || "").slice(0, 300),
    });
    wrap.innerHTML = '<iframe data-tally-src="https://tally.so/embed/Y5voaW?' + params.toString() +
      '" width="100%" height="400" frameborder="0" title="Get your case reviewed"></iframe>';
    await ensureTallyEmbedScript();
    if (window.Tally && typeof window.Tally.loadEmbeds === "function") {
      window.Tally.loadEmbeds();
    }
  };

  const renderResults = (data) => {
    if (data.caseTypeId === "unrecognized") {
      form.hidden = false;
      showError("That doesn't look like an Amazon suspension notice. Paste the full notice text, or upload the notice itself, and try again.");
      return;
    }
    lastResult = data;
    document.getElementById("scan-result-tag").textContent = data.complexityTier + " case";
    document.getElementById("scan-result-type").textContent = data.caseType;
    document.getElementById("scan-result-synthesis").textContent = data.synthesis;
    document.getElementById("scan-result-why").textContent = data.whyThisMatters || data.rootCausePreview || "";

    const list = document.getElementById("scan-evidence-list");
    list.innerHTML = "";
    (data.evidenceNeeded || []).forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    const insight = document.getElementById("scan-result-insight");
    insight.innerHTML = "";
    if (data.urgencyNote) {
      const p1 = document.createElement("p");
      p1.innerHTML = "<strong>" + data.urgencyNote + "</strong>";
      insight.appendChild(p1);
    }
    if (data.keyInsight) {
      const p2 = document.createElement("p");
      p2.textContent = data.keyInsight;
      insight.appendChild(p2);
    }

    emptyEl.hidden = true;
    resultsEl.hidden = false;
    renderTallyEmbed(data);

    if (typeof gtag === "function") {
      const pageType = document.body.dataset.scanPageType || "home";
      gtag("event", "scan_completed", { case_type: data.caseTypeId, page_type: pageType });
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    errorEl.textContent = "";

    const text = textEl.value.trim();
    const hasFiles = fileEl.files.length > 0;
    if (text.length < 30 && !hasFiles) {
      showError("Paste your suspension notice, or upload a file, before analyzing.");
      return;
    }

    const body = new FormData();
    if (text) body.append("noticeText", text);
    Array.from(fileEl.files).forEach(f => body.append("files", f));
    const email = emailEl.value.trim();
    if (email) body.append("email", email);
    body.append("sourcePage", location.pathname);

    form.hidden = true;
    emptyEl.hidden = true;
    loadingEl.hidden = false;
    submitBtn.disabled = true;

    if (typeof gtag === "function") {
      const pageType = document.body.dataset.scanPageType || "home";
      gtag("event", "scan_started", { page_type: pageType, has_email: !!email });
    }

    try {
      const res = await fetch("/api/analyze", { method: "POST", body });
      const data = await res.json();
      loadingEl.hidden = true;
      if (!res.ok) {
        form.hidden = false;
        showError(data.error || "Something went wrong. Please try again.");
        return;
      }
      renderResults(data);
    } catch (err) {
      loadingEl.hidden = true;
      form.hidden = false;
      showError("Something went wrong reaching our server. Please try again in a moment.");
    } finally {
      submitBtn.disabled = false;
    }
  });

  resetBtn.addEventListener("click", () => {
    resultsEl.hidden = true;
    errorEl.hidden = true;
    emptyEl.hidden = false;
    form.hidden = false;
    textEl.value = "";
    fileEl.value = "";
    emailEl.value = "";
    fileNameEl.textContent = "";
    lastResult = null;
  });
})();
