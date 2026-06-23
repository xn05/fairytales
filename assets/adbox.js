(() => {
  if (window.__joshiAdboxLoaded) {
    return;
  }

  window.__joshiAdboxLoaded = true;

  const DEFAULT_ADS_PATH = "assets/ads/";
  const DEFAULT_MANIFEST = "ads.json";
  const DEFAULT_HEIGHT = 120;
  const DEFAULT_RADIUS = 10;
  const DEFAULT_SPEED = 6;

  const style = document.createElement("style");
  style.textContent = `
    .adbox {
      width: min(760px, calc(100% - 32px));
      margin: 18px auto;
      padding: 8px;
      background: #f5f0e6;
      border: 1px solid rgba(44, 31, 15, 0.12);
      border-radius: 14px;
      box-shadow: 0 12px 24px rgba(44, 31, 15, 0.08);
      overflow: hidden;
    }

    .adbox marquee {
      display: block;
      overflow: hidden;
    }

    .adbox-track {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      white-space: nowrap;
    }

    .adbox-image {
      display: inline-block;
      width: auto;
      object-fit: cover;
      vertical-align: middle;
      user-select: none;
      -webkit-user-drag: none;
    }
  `;
  document.head.appendChild(style);

  function joinPath(base, file) {
    return (base.endsWith("/") ? base : base + "/") + file;
  }

  function getPositiveNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function shuffled(items) {
    const copy = [...items];

    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
  }

  function buildLoopingAds(ads, minimumImages) {
    const loop = [];

    while (loop.length < minimumImages) {
      loop.push(...shuffled(ads));
    }

    return loop;
  }

  function createImage(src, height, radius) {
    const img = document.createElement("img");
    img.className = "adbox-image";
    img.src = src;
    img.alt = "Advertisement";
    img.draggable = false;
    img.style.height = `${height}px`;
    img.style.borderRadius = `${radius}px`;
    return img;
  }

  function createAdBox(element, ads) {
    const base = element.dataset.adsPath || DEFAULT_ADS_PATH;
    const height = getPositiveNumber(element.dataset.height, DEFAULT_HEIGHT);
    const radius = getPositiveNumber(element.dataset.radius, DEFAULT_RADIUS);
    const speed = getPositiveNumber(element.dataset.speed, DEFAULT_SPEED);
    const count = Math.min(
      ads.length,
      Math.floor(getPositiveNumber(element.dataset.count, Math.min(ads.length, 12)))
    );
    const selectedAds = shuffled(ads).slice(0, Math.max(1, count));
    const loopingAds = buildLoopingAds(selectedAds, selectedAds.length * 4);

    element.style.setProperty("--adbox-height", `${height}px`);
    element.innerHTML = "";
    element.setAttribute("aria-label", element.getAttribute("aria-label") || "Rolling advertisements");

    const marquee = document.createElement("marquee");
    marquee.behavior = "scroll";
    marquee.direction = element.dataset.direction || "left";
    marquee.scrollAmount = String(speed);
    marquee.loop = -1;
    marquee.style.height = `${height}px`;
    marquee.addEventListener("mouseenter", () => marquee.stop());
    marquee.addEventListener("mouseleave", () => marquee.start());

    const track = document.createElement("span");
    track.className = "adbox-track";
    track.style.minHeight = `${height}px`;

    loopingAds.forEach((file) => {
      track.appendChild(createImage(joinPath(base, file), height, radius));
    });

    marquee.appendChild(track);
    element.appendChild(marquee);
  }

  async function init() {
    const boxes = document.querySelectorAll(".adbox");

    for (const box of boxes) {
      const adsPath = box.dataset.adsPath || DEFAULT_ADS_PATH;

      try {
        const response = await fetch(joinPath(adsPath, DEFAULT_MANIFEST), {
          cache: "no-cache"
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const ads = await response.json();

        if (Array.isArray(ads) && ads.length > 0) {
          createAdBox(box, ads);
        }
      } catch (err) {
        console.error("AdBox error:", err);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
