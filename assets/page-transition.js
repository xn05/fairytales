(() => {
  const INTRO_MS = 720;
  const OUTRO_MS = 480;
  let isLeaving = false;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function makeWash(className) {
    const wash = document.createElement("div");
    wash.className = `page_transition_wash ${className}`;
    wash.setAttribute("aria-hidden", "true");
    return wash;
  }

  function runIntro() {
    if (prefersReducedMotion()) {
      return;
    }

    const wash = makeWash("page_transition_intro");
    document.body.appendChild(wash);
    window.setTimeout(() => wash.remove(), INTRO_MS);
  }

  function isInternalSiteLink(url) {
    return url.origin === window.location.origin && url.pathname.startsWith("/fairytales/");
  }

  function shouldSkipLink(event, link) {
    const href = link.getAttribute("href");

    return (
      isLeaving ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      link.hasAttribute("download") ||
      link.dataset.scrollTarget
    );
  }

  function openTarget(link, url) {
    const target = link.getAttribute("target");

    if (target === "_blank") {
      window.open(url.href, "_blank", "noopener");
      return;
    }

    window.location.assign(url.href);
  }

  function runOutro(event, link, url) {
    if (prefersReducedMotion()) {
      return;
    }

    event.preventDefault();
    isLeaving = true;

    const wash = makeWash("page_transition_outro");
    document.body.appendChild(wash);

    window.setTimeout(() => {
      openTarget(link, url);
      window.setTimeout(() => {
        isLeaving = false;
        wash.remove();
      }, 120);
    }, OUTRO_MS);
  }

  document.addEventListener("DOMContentLoaded", runIntro);

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link || shouldSkipLink(event, link)) {
      return;
    }

    const url = new URL(link.href, window.location.href);

    if (!isInternalSiteLink(url)) {
      return;
    }

    runOutro(event, link, url);
  });
})();
