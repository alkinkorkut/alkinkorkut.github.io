// =====================================================================================
// Sayfanin davranisi: kartlari uretme, dil/tema degistirme, mobil menu, beliren animasyonlar,
// kart isik efekti ve proje detay penceresi.
// =====================================================================================
// Non-teknik not: Icerik bu dosyada degil, js/data.js'te. Burasi sadece o icerigi sayfaya yerlestiriyor
// ve dugmelerin ne yapacagini belirliyor; metin degistirmek icin bu dosyaya dokunmana gerek yok.
//
// Teknik notlar:
//  - Hicbir kutuphane yok (React, jQuery vb.); tarayicinin kendi API'leri kullaniliyor.
//  - Script <head>'de "defer" ile yukleniyor: HTML tamamen okunduktan sonra ve data.js'ten hemen sonra
//    calisir, bu yuzden DOMContentLoaded beklemeye gerek yok.
//  - Tum metinler textContent ile yaziliyor (innerHTML degil): data.js'e yanlislikla HTML yazilsa bile
//    sayfada kod olarak calismaz. innerHTML sadece asagidaki sabit SVG ikonlari icin kullaniliyor.
//  - Dil ve tema tercihi localStorage'da tutuluyor ("locale", "theme"); Next.js surumuyle ayni anahtarlar.

(function () {
  "use strict";

  const root = document.documentElement;
  // Ilk dil, index.html'deki kucuk script'in localStorage'dan okuyup <html lang>'e yazdigi deger.
  let locale = root.lang === "tr" ? "tr" : "en";

  // localStorage gizli modda ya da kapaliyken hata firlatabilir; tercih kaydedilemese de sayfa calismali.
  function save(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* tercih kaydedilemedi; sayfa yine de calisir */
    }
  }

  // "hero.eyebrow" gibi bir yolu sozlukte bulur.
  function lookup(dictionary, path) {
    return path.split(".").reduce((node, key) => (node == null ? undefined : node[key]), dictionary);
  }

  // Kucuk bir DOM yardimcisi: el("a", { class: "x", href: "..." }, [cocuklar]).
  // Cocuk olarak verilen metinler text node olur (HTML olarak yorumlanmaz).
  function el(tag, attributes = {}, children = []) {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(attributes)) {
      if (value !== null && value !== undefined) node.setAttribute(name, value);
    }
    for (const child of children) {
      node.append(typeof child === "string" ? document.createTextNode(child) : child);
    }
    return node;
  }

  // Lucide "arrow-up-right" ikonu (Next.js surumunde lucide-react'tan geliyordu). Sabit metin, kullanici
  // verisi icermiyor; bu yuzden innerHTML ile eklemek guvenli.
  const ARROW_UP_RIGHT =
    '<svg class="icon icon-3-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>';

  // --- Etiket ve link listeleri (kart ve detay penceresi ortak) ------------------------------
  function fillTags(container, tags) {
    container.replaceChildren(...tags.map((tag) => el("span", { class: "tag" }, [tag])));
  }

  // Link etiketi (ornegin "Source Code") data-label'da saklaniyor; ceviriyi applyLocale() yaziyor.
  function fillLinks(container, links) {
    container.replaceChildren(
      ...links.map((link) => {
        const anchor = el("a", { class: "project-link", href: link.href, target: "_blank", rel: "noreferrer" }, [
          el("span", { "data-label": link.label }, [link.label]),
        ]);
        anchor.insertAdjacentHTML("beforeend", ARROW_UP_RIGHT);
        return anchor;
      }),
    );
  }

  // --- Proje kartlari ----------------------------------------------------------------------
  function renderProjects() {
    const grid = document.getElementById("projects-grid");

    PROJECTS.forEach((project, index) => {
      // Kart ekrana girince sirayla belirsin: her kart bir oncekinden 0.06 sn sonra (6'li kalipla).
      const reveal = el("div", { class: "reveal", style: `--delay: ${(index % 6) * 0.06}s` });
      const card = el("div", { class: "card" });
      const inner = el("div", { class: "card-inner" });

      // Kartin tamamini tiklanabilir yapan gorunmez dugme (bkz. styles.css, .card-button).
      // aria-label'i ("<baslik> – View details") applyLocale() dile gore yaziyor.
      inner.append(el("button", { type: "button", class: "card-button", "aria-haspopup": "dialog", "data-project": index }));

      if (project.image) {
        // loading="lazy": gorsel, kart ekrana yaklasinca indirilir; sayfanin ilk acilisi hizlanir.
        inner.append(el("div", { class: "card-media" }, [el("img", { src: project.image, alt: project.title, loading: "lazy" })]));
      }

      const tags = el("div", { class: "tags" });
      const links = el("div", { class: "links" });
      fillTags(tags, project.tags);
      fillLinks(links, project.links);

      inner.append(
        el("div", { class: "card-body" }, [
          el("h3", { class: "card-title" }, [project.title]),
          // Aciklama dile gore degistigi icin applyLocale() dolduruyor; data-desc hangi proje oldugunu tutuyor.
          el("p", { class: "card-desc", "data-desc": index }),
          tags,
          links,
        ]),
      );

      card.append(inner);
      reveal.append(card);
      grid.append(reveal);
    });
  }

  // --- Yetenek kartlari --------------------------------------------------------------------
  function renderSkills() {
    const grid = document.getElementById("skills-grid");

    SKILL_GROUPS.forEach((group, index) => {
      const list = el(
        "ul",
        { class: "skill-list" },
        group.items.map((item) => el("li", { "data-skill-item": item }, [item])),
      );
      const card = el("div", { class: "card" }, [
        el("div", { class: "card-inner" }, [
          el("div", { class: "skill-body" }, [el("h3", { class: "skill-title", "data-skill-group": group.title }, [group.title]), list]),
        ]),
      ]);
      grid.append(el("div", { class: "reveal", style: `--delay: ${index * 0.08}s` }, [card]));
    });
  }

  // --- Dil ---------------------------------------------------------------------------------
  // Sayfadaki tum cevrilebilir metinleri secilen dile gore yeniden yazar. Kartlari yeniden olusturmuyor,
  // sadece metinlerini degistiriyor; boylece dil degisince kartlar yeniden "belirme" animasyonu oynatmaz.
  function applyLocale(next) {
    locale = next;
    const t = DICTIONARY[locale];
    root.lang = locale;

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const text = lookup(t, node.dataset.i18n);
      if (typeof text === "string") node.textContent = text;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
      const text = lookup(t, node.dataset.i18nAria);
      if (typeof text === "string") node.setAttribute("aria-label", text);
    });

    // Sozlukte karsiligi olmayan ad (ornegin "Python") oldugu gibi gosterilir.
    document.querySelectorAll("[data-desc]").forEach((node) => {
      node.textContent = PROJECTS[node.dataset.desc].description[locale];
    });
    document.querySelectorAll("[data-label]").forEach((node) => {
      node.textContent = t.projects.linkLabels[node.dataset.label] ?? node.dataset.label;
    });
    document.querySelectorAll("[data-skill-group]").forEach((node) => {
      node.textContent = t.skills.groups[node.dataset.skillGroup] ?? node.dataset.skillGroup;
    });
    document.querySelectorAll("[data-skill-item]").forEach((node) => {
      node.textContent = t.skills.items[node.dataset.skillItem] ?? node.dataset.skillItem;
    });
    document.querySelectorAll(".card-button").forEach((button) => {
      button.setAttribute("aria-label", `${PROJECTS[button.dataset.project].title} – ${t.projects.viewDetails}`);
    });

    // Dil dugmesi o anki dili gosterir (EN/TR), tiklayinca digerine gecer.
    const other = locale === "en" ? "tr" : "en";
    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.textContent = locale.toUpperCase();
      button.setAttribute("aria-label", `Switch language to ${other === "en" ? "English" : "Türkçe"}`);
    });
  }

  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = locale === "en" ? "tr" : "en";
      applyLocale(next);
      save("locale", next);
    });
  });

  // --- Tema --------------------------------------------------------------------------------
  // Sadece <html>'deki "dark" sinifini degistiriyor; renkler ve dogru ikon (gunes/ay) tamamen CSS'te.
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const dark = root.classList.toggle("dark");
      save("theme", dark ? "dark" : "light");
    });
  });

  // --- Mobil menu --------------------------------------------------------------------------
  const menu = document.getElementById("mobile-menu");
  const menuButton = document.querySelector("[data-menu-toggle]");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  }

  menuButton.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  // Menudeki bir linke (ya da logoya) tiklayinca menu kapanir.
  document.querySelectorAll("[data-close-menu]").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  // --- Kart isik efekti --------------------------------------------------------------------
  // Tek bir dinleyici tum kartlari yonetiyor (her karta ayri dinleyici eklemek yerine). Imlecin kart
  // icindeki konumu CSS degiskenlerine yaziliyor; isigi CSS ciziyor (bkz. styles.css, .card::before).
  document.addEventListener("mousemove", (event) => {
    const card = event.target instanceof Element ? event.target.closest(".card") : null;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
  });

  // --- Beliren ogeler ----------------------------------------------------------------------
  // Oge ekranin 80px icine girince "is-visible" sinifi eklenir ve bir daha izlenmez (animasyon tek sefer).
  function observeReveals() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-80px" },
    );
    items.forEach((item) => observer.observe(item));
  }

  // --- Proje detay penceresi ---------------------------------------------------------------
  // Tek bir <dialog> var (index.html'de); tiklanan projenin bilgileriyle doldurulup showModal() ile aciliyor.
  const dialog = document.getElementById("project-dialog");
  const dialogMedia = document.getElementById("dialog-media");
  const dialogImage = document.getElementById("dialog-image");

  function openProject(index) {
    const project = PROJECTS[index];

    // Gorseli olmayan projede (Simple CPU) gorsel alani tamamen gizlenir.
    dialogMedia.hidden = !project.image;
    if (project.image) {
      dialogImage.src = project.image;
      dialogImage.alt = project.title;
    }
    document.getElementById("dialog-title").textContent = project.title;
    document.getElementById("dialog-desc").textContent = project.description[locale];
    fillTags(document.getElementById("dialog-tags"), project.tags);
    fillLinks(document.getElementById("dialog-links"), project.links);
    applyLocale(locale); // yeni eklenen link etiketlerini secili dile cevir

    dialog.querySelector(".dialog-scroll").scrollTop = 0; // onceki projede asagi kaydirildiysa basa don
    dialog.showModal();
  }

  // Kart tiklamalari icin tek dinleyici (event delegation): tiklanan gorunmez kart dugmesini bulur.
  document.getElementById("projects-grid").addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest(".card-button") : null;
    if (button) openProject(Number(button.dataset.project));
  });

  // Pencerenin disina tiklama: arka plana (::backdrop) yapilan tiklamalar dialog ogesinin kendisine gelir.
  // Icerik pencereyi tamamen kapladigi icin tiklamanin hedefi dialog'un kendisiyse tiklama disaridadir.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  // --- Baslat ------------------------------------------------------------------------------
  renderProjects();
  renderSkills();
  applyLocale(locale);
  document.getElementById("year").textContent = String(new Date().getFullYear());
  observeReveals();
})();
