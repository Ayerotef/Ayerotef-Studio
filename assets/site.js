(function () {
  const BASE = "https://ayerotef.github.io/Ayerotef-Studio";

  const ENDPOINTS = [
    { field: "githubManifestUrl", label: "Manifest", path: "/AYEPOLIS/manifest.json" },
    { field: "githubConfigurationUrl", label: "Configuration", path: "/configuration.json" },
    { field: "githubVersionUrl", label: "Version", path: "/version.json" },
    { field: "githubMoviesCategoriesUrl", label: "Movies categories", path: "/categories/movies.json" },
    { field: "githubSeriesCategoriesUrl", label: "Series categories", path: "/categories/series.json" },
    { field: "posterBaseUrl", label: "Poster base", path: "/posters/" },
  ];

  function fillUrls() {
    const grid = document.getElementById("url-grid");
    if (!grid) return;
    grid.innerHTML = "";
    ENDPOINTS.forEach((ep) => {
      const url = BASE + ep.path;
      const row = document.createElement("div");
      row.className = "url-row";
      row.innerHTML =
        "<dt>" +
        ep.label +
        '</dt><dd><a href="' +
        url +
        '" rel="noopener">' +
        url +
        '</a></dd><button type="button" class="copy-btn" data-url="' +
        url +
        '">Copy</button>';
      const dt = row.querySelector("dt");
      dt.title = ep.field;
      grid.appendChild(row);
    });
  }

  async function copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add("copied");
      btn.textContent = "Copied";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = "Copy";
      }, 1200);
    } catch (_) {
      btn.textContent = "Select URL";
    }
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".copy-btn");
    if (btn && btn.dataset.url) copyText(btn.dataset.url, btn);
  });

  const state = { kind: "movies", cache: {} };

  function renderCategories(doc) {
    const list = document.getElementById("cat-list");
    const status = document.getElementById("cat-status");
    if (!list) return;
    list.innerHTML = "";
    const cats = (doc && doc.categories) || [];
    cats.forEach((c) => {
      if (!c || c.id === "all") return;
      const li = document.createElement("li");
      li.innerHTML =
        "<span>" +
        escapeHtml(c.name || c.id) +
        '</span><span class="total">' +
        String(c.total != null ? c.total : "—") +
        "</span>";
      list.appendChild(li);
    });
    if (status) {
      status.classList.remove("error");
      status.textContent =
        (doc.type || state.kind) +
        " · " +
        cats.filter((c) => c.id !== "all").length +
        " categories · v" +
        (doc.version || "?");
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function loadCategories(kind) {
    const status = document.getElementById("cat-status");
    const path = kind === "series" ? "/categories/series.json" : "/categories/movies.json";
    if (status) {
      status.classList.remove("error");
      status.textContent = "Loading…";
    }
    try {
      if (!state.cache[kind]) {
        const res = await fetch(path, { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        state.cache[kind] = await res.json();
      }
      renderCategories(state.cache[kind]);
    } catch (err) {
      if (status) {
        status.classList.add("error");
        status.textContent = "Could not load " + path + " (" + err.message + ")";
      }
    }
  }

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      state.kind = tab.dataset.kind || "movies";
      loadCategories(state.kind);
    });
  });

  fillUrls();
  loadCategories("movies");
})();
