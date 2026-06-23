(() => {
  const DEFAULT_ADS_PATH = "assets/ads/";
  const DEFAULT_MANIFEST = "ads.json";

  const style = document.createElement("style");
  style.textContent = `
    .adbox {
      max-width: 500px;
      margin: 16px auto;
      padding: 8px;
      background: #f5f5f5;
      border-radius: 8px;
      overflow: hidden;
    }

    .adbox-tiles {
      display: flex;
      gap: 8px;
    }

    .adbox-item {
      flex: 1;
    }

    .adbox-item img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      display: block;
      border-radius: 6px;
      user-select: none;
      -webkit-user-drag: none;
    }
  `;
  document.head.appendChild(style);

  function joinPath(base, file) {
    return (base.endsWith("/") ? base : base + "/") + file;
  }

  function pickRandom(arr, count) {
    const copy = [...arr];
    const result = [];

    while (result.length < count && copy.length) {
      const index = Math.floor(Math.random() * copy.length);
      result.push(copy.splice(index, 1)[0]);
    }

    return result;
  }

  function createAdBox(element, ads) {
    const base = element.dataset.adsPath || DEFAULT_ADS_PATH;

    element.innerHTML = `<div class="adbox-tiles"></div>`;

    const tiles = element.querySelector(".adbox-tiles");

    pickRandom(ads, 2).forEach(file => {
      const item = document.createElement("div");
      item.className = "adbox-item";

      const img = document.createElement("img");
      img.src = joinPath(base, file);
      img.alt = "Advertisement";
      img.draggable = false;

      img.onerror = () => {
        console.error("Failed to load image:", img.src);
      };

      item.appendChild(img);
      tiles.appendChild(item);
    });
  }

  async function init() {
    const boxes = document.querySelectorAll(".adbox");

    for (const box of boxes) {
      const adsPath = box.dataset.adsPath || DEFAULT_ADS_PATH;

      try {
        const manifestURL = joinPath(adsPath, DEFAULT_MANIFEST);

        console.log("Loading ads from:", manifestURL);

        const response = await fetch(manifestURL, {
          cache: "no-cache"
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const ads = await response.json();

        console.log("Ads loaded:", ads.length);

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