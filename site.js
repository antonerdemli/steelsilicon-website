(() => {
  "use strict";

  const data = window.STEEL_SILICON_CONTENT;
  const languageCodes = ["en", "ru", "de", "es"];
  let currentLanguage = "en";
  let openSystem = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function iconSvg(name) {
    const common = 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square" stroke-linejoin="miter"';
    const icons = {
      economy: `<path ${common} d="M9 55h47M14 51V37h9v14M28 51V28h9v23M42 51V16h9v35M13 28l12-9 10 5 17-14"/>`,
      steel: `<path ${common} d="M8 54h48M12 54V33l12 7V28l13 8V17h10l5 37M37 25h10M37 34h10M37 43h11M17 48h6M29 48h6"/><path ${common} d="M41 17V9h4v8"/>`,
      society: `<circle ${common} cx="32" cy="20" r="8"/><circle ${common} cx="13" cy="28" r="6"/><circle ${common} cx="51" cy="28" r="6"/><path ${common} d="M18 54v-7c0-9 6-14 14-14s14 5 14 14v7M4 54v-5c0-7 4-11 10-11h5M60 54v-5c0-7-4-11-10-11h-5"/>`,
      politics: `<path ${common} d="M9 54h46M16 54V31h12v23M36 54V20h12v34M12 25h20M32 14h20M9 9h46"/><circle ${common} cx="22" cy="16" r="4"/><circle ${common} cx="42" cy="42" r="4"/>`,
      government: `<path ${common} d="M7 22h50L32 8 7 22zM11 27h42M14 27v22M24 27v22M40 27v22M50 27v22M8 49h48M5 56h54"/>`,
      atom: `<ellipse ${common} cx="32" cy="32" rx="25" ry="10"/><ellipse ${common} cx="32" cy="32" rx="25" ry="10" transform="rotate(60 32 32)"/><ellipse ${common} cx="32" cy="32" rx="25" ry="10" transform="rotate(120 32 32)"/><circle cx="32" cy="32" r="3.5" fill="currentColor"/>`,
      transport: `<path ${common} d="M15 45V18c0-7 5-10 17-10s17 3 17 10v27M18 27h28M21 37h4M39 37h4M12 47h40M21 47l-5 9M43 47l5 9M19 56h10M35 56h10"/>`,
      construction: `<path ${common} d="M12 56h40M19 56V9h7v47M15 16h38M26 16l22 8M47 16v25M42 41h10v7H42zM19 27h7M19 39h7M19 49h7"/>`,
    };
    return `<svg viewBox="0 0 64 64" aria-hidden="true">${icons[name] || icons.politics}</svg>`;
  }

  function systemsFor(language) {
    return language === "ru" ? data.systemsRu : data.systemsByLang[language];
  }

  function renderSystems(copy) {
    const root = $(".system-cards");
    const systems = systemsFor(currentLanguage);
    root.innerHTML = systems.map((system) => {
      const isOpen = openSystem === system.number;
      const detailItems = system.details.map((detail) => `
        <li>${detail.label ? `<strong>${escapeHtml(detail.label)}</strong> ` : ""}${escapeHtml(detail.text)}</li>
      `).join("");

      return `
        <article class="system-card${isOpen ? " is-open" : ""}">
          <div class="card-top">
            <span class="card-number">${escapeHtml(system.number)}</span>
            <div class="card-icon">${iconSvg(system.icon)}</div>
          </div>
          <h3>${escapeHtml(system.title)}</h3>
          <p>${escapeHtml(system.text)}</p>
          <button class="system-toggle" type="button" aria-expanded="${isOpen}" data-system="${escapeHtml(system.number)}">
            <span>${escapeHtml(isOpen ? copy.systems.collapseLabel : copy.systems.detailsLabel)}</span>
            <strong aria-hidden="true">${isOpen ? "−" : "+"}</strong>
          </button>
          <ul${isOpen ? "" : " hidden"}>${detailItems}</ul>
        </article>
      `;
    }).join("");
  }

  function render(language) {
    currentLanguage = language;
    openSystem = null;
    const copy = data.siteCopy[language];

    document.documentElement.lang = language;
    $(".brand").setAttribute("aria-label", copy.homeLabel);
    $(".site-header nav").setAttribute("aria-label", copy.navLabel);
    $(".language-switcher").setAttribute("aria-label", copy.languageLabel);

    const navLinks = $$(".site-header nav a");
    [copy.nav.about, copy.nav.era, copy.nav.mechanics, copy.nav.contact].forEach((label, index) => {
      navLinks[index].textContent = label;
    });

    $$(".language-switcher button").forEach((button) => {
      const isActive = button.textContent.toLowerCase() === language;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    $(".hero-intro").innerHTML = `<strong>Steel &amp; Silicon: The Nation Simulator</strong> ${escapeHtml(copy.hero.description)}`;
    $(".button.primary").innerHTML = `${escapeHtml(copy.hero.mechanicsButton)} <span aria-hidden="true">↓</span>`;
    $(".button.secondary").innerHTML = `${escapeHtml(copy.hero.followButton)} <span aria-hidden="true">↗</span>`;
    $(".hero-visual").setAttribute("aria-label", copy.hero.visualLabel);
    $(".hero-visual img").alt = copy.hero.visualAlt;

    $(".era .section-label strong").textContent = copy.era.sectionLabel;
    $(".era h2").textContent = copy.era.title;
    $(".era-visual img").alt = copy.era.visualAlt;
    $(".era-copy").innerHTML = copy.era.paragraphs.map((paragraph, index) =>
      `<p${index === 0 ? ' class="lead"' : ""}>${escapeHtml(paragraph)}</p>`
    ).join("");

    $(".project-scope .section-label strong").textContent = copy.scope.sectionLabel;
    $(".scope-heading h2").textContent = copy.scope.title;
    $(".scope-heading p").textContent = copy.scope.introduction;
    $(".scope-visual img").alt = copy.scope.visualAlt;
    $(".scope-grid").innerHTML = copy.scope.entries.map((entry) => `
      <div class="scope-card">
        <dt>${escapeHtml(entry.label)}</dt>
        <dd><strong>${escapeHtml(entry.value)}</strong><span>${escapeHtml(entry.detail)}</span></dd>
      </div>
    `).join("");

    $(".project-strengths .section-label strong").textContent = copy.strengths.sectionLabel;
    $(".strengths-heading h2").textContent = copy.strengths.title;
    $(".strengths-heading p").textContent = copy.strengths.introduction;
    $(".strengths-visual img").alt = copy.strengths.visualAlt;
    $(".strengths-grid").innerHTML = copy.strengths.entries.map((entry, index) => `
      <article class="strength-card">
        <span class="strength-number">${String(index + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(entry.title)}</h3>
        <p>${escapeHtml(entry.description)}</p>
      </article>
    `).join("");

    $(".systems .section-label strong").textContent = copy.systems.sectionLabel;
    $(".systems-heading h2").innerHTML = `${escapeHtml(copy.systems.headline)}<br><span>${escapeHtml(copy.systems.headlineAccent)}</span>`;
    $(".systems-heading p").textContent = copy.systems.introduction;
    renderSystems(copy);

    $(".contact .section-label strong").textContent = copy.contact.sectionLabel;
    $(".contact h2").innerHTML = `${escapeHtml(copy.contact.heading)}<br>Steel &amp; Silicon:<br><span>The Nation Simulator.</span>`;
    $(".contact-copy > p").textContent = copy.contact.description;
    $(".contact-link[href^='mailto:'] small").textContent = copy.contact.emailLabel;
    $("footer span").textContent = copy.footerStatus;
  }

  $$(".language-switcher button").forEach((button) => {
    button.addEventListener("click", () => render(button.textContent.toLowerCase()));
  });

  $(".system-cards").addEventListener("click", (event) => {
    const button = event.target.closest(".system-toggle");
    if (!button) return;
    openSystem = openSystem === button.dataset.system ? null : button.dataset.system;
    renderSystems(data.siteCopy[currentLanguage]);
  });

  render(languageCodes[0]);
})();
