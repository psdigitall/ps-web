/* =========================================================
   PS:Digital — interakcie a animácie
   Vychádza z komentárov grafika vo Figme.
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1) Hamburger menu ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("mobile-nav");
  if (burger && nav) {
    const toggle = (open) => {
      nav.classList.toggle("is-open", open);
      nav.setAttribute("aria-hidden", String(!open));
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Zavrieť menu" : "Otvoriť menu");
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => toggle(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) toggle(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });
  }

  /* ---------- 2) Showreel video – autoplay + fallback ----------
     Komentár grafika: „Showreel video, automaticky sa spustí pri načítaní webu."
     Autoplay môže politika prehliadača zablokovať (úsporný režim, prísne nastavenia),
     preto skúšame na viacerých miestach, pri prvej interakcii, a inak ukážeme Prehrať. */
  const video = document.querySelector(".hero__video");
  const playBtn = document.querySelector(".hero__play");
  if (video) {
    // Stlmenie aj ako property (nie len atribút) – niektoré prehliadače to vyžadujú.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const showBtn = () => { if (playBtn) playBtn.hidden = false; };
    const hideBtn = () => { if (playBtn) playBtn.hidden = true; };
    const attempt = () => {
      if (!video.paused) return;            // už hrá – nič nerob
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(hideBtn).catch(showBtn);     // úspech skryje tlačidlo, zlyhanie ho ukáže
      }
    };

    if (video.readyState >= 2) attempt();
    ["loadeddata", "canplay"].forEach((ev) => video.addEventListener(ev, attempt));
    window.addEventListener("load", attempt, { once: true });

    // Fallback: spusti pri prvej interakcii kdekoľvek (scroll/dotyk/klik/klávesa).
    ["pointerdown", "touchstart", "keydown", "scroll"].forEach((ev) =>
      window.addEventListener(ev, attempt, { once: true, passive: true })
    );

    // Explicitné tlačidlo Prehrať (klik = istá používateľská interakcia).
    if (playBtn) playBtn.addEventListener("click", attempt);

    // Šetrenie dát/batérie: pauza mimo obrazovky, prehrávanie keď je vidno.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) attempt();
          else if (!video.paused) video.pause();
        });
      }, { threshold: 0.25 }).observe(video);
    }
  }

  /* ---------- 3) Novinky – „slot machine" reel ----------
     Komentár grafika: „NOVINKY – texty sa menia, rotujú ako slivky na automate." */
  const ticker = document.getElementById("ticker");
  if (ticker && !reduceMotion) {
    const items = Array.from(ticker.children);
    if (items.length > 1) {
      const stepH = items[0].offsetHeight;
      ticker.appendChild(items[0].cloneNode(true)); // klon prvého pre plynulú slučku
      let i = 0;
      setInterval(() => {
        i++;
        ticker.style.transition = "transform .55s cubic-bezier(.22,1.2,.36,1)";
        ticker.style.transform = `translateY(${-i * stepH}px)`;
        if (i === items.length) {
          setTimeout(() => {
            ticker.style.transition = "none";
            ticker.style.transform = "translateY(0)";
            i = 0;
          }, 600);
        }
      }, 3000);
    }
  }

  /* ---------- 4) Defilujúce logá (marquee) ----------
     Klienti: horný riadok doprava, spodný doľava. Súťaže: sprava doľava.
     Dodané logá sú súvislé pásy (PNG) – vložíme ich dvakrát za sebou kvôli slučke. */
  // gapNative = koľko priehľadného miesta (v px originálu) treba doplniť na šev,
  // aby medzera medzi poslednou a prvou kópiou sadla na vnútorné medzery medzi logami.
  // = (vnútorná medzera medzi logami) − (ľavý + pravý okraj pásu). Zmerané z podkladov.
  const tracks = [
    { el: document.getElementById("clients-row-1"), src: "assets/logos/clients/klienti_1.png", alt: "Klienti",  gapNative: 37 },
    { el: document.getElementById("clients-row-2"), src: "assets/logos/clients/klienti_2.png", alt: "Klienti",  gapNative: 26 },
    { el: document.getElementById("awards-row"),    src: "assets/logos/awards/sutaze.png",     alt: "Ocenenia", gapNative: 62 },
  ];

  // Nastaví medzeru na šve, presný posun (kópia + medzera) a rýchlosť defilovania.
  function layoutMarquee(t) {
    const track = t.el;
    const first = track && track.querySelector("img");
    if (!first) return;
    const rect = first.getBoundingClientRect();
    if (!rect.width || !first.naturalHeight) return;
    const scale = rect.height / first.naturalHeight;     // zobrazené / originál
    const gap = (t.gapNative || 0) * scale;              // medzera na šve v zobrazených px
    const shift = rect.width + gap;                      // posun o jednu kópiu + medzeru
    track.style.setProperty("--seam-gap", gap + "px");
    track.style.setProperty("--shift", shift + "px");
    const marquee = track.closest(".marquee");
    const speed = parseFloat(marquee && marquee.dataset.speed) || 40; // px/s
    track.style.animationDuration = shift / speed + "s";
  }

  tracks.forEach((t) => {
    if (!t.el) return;
    for (let k = 0; k < 2; k++) {
      const img = document.createElement("img");
      img.src = t.src;
      img.alt = k === 0 ? t.alt : "";
      img.setAttribute("aria-hidden", k === 0 ? "false" : "true");
      img.addEventListener("load", () => layoutMarquee(t));
      t.el.appendChild(img);
    }
  });

  window.addEventListener("resize", () => {
    tracks.forEach((t) => t.el && layoutMarquee(t));
  });

  /* ---------- 5) Výber prác – „slot machine" reel ----------
     Komentár grafika: „NAŠE PRÁCE – rotujú ako slivky na automate.
     Dvojbodka v pozadí zostáva statická." (colon = .work__colon, mimo pásu) */
  const workReel = document.getElementById("work-reel");
  if (workReel && !reduceMotion) {
    const cards = Array.from(workReel.children);
    if (cards.length > 1) {
      workReel.appendChild(cards[0].cloneNode(true)); // klon prvej karty
      let i = 0;
      const advance = () => {
        const stepH = workReel.children[0].getBoundingClientRect().height;
        i++;
        workReel.style.transition = "transform .7s cubic-bezier(.22,1.15,.36,1)";
        workReel.style.transform = `translateY(${-i * stepH}px)`;
        if (i === cards.length) {
          setTimeout(() => {
            workReel.style.transition = "none";
            workReel.style.transform = "translateY(0)";
            i = 0;
          }, 750);
        }
      };
      setInterval(advance, 3800);
    }
  }
})();
