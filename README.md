# PS:Digital — mobilná homepage

Statická mobilná verzia homepage podľa Figmy (`Mobil_Homepage_390px`).
Postavené na čistom HTML + CSS + JavaScripte, bez build nástrojov.

## Spustenie

Stačí otvoriť `index.html` v prehliadači. Alebo lokálny server:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Štruktúra

```
index.html            – obsah a štruktúra stránky
css/styles.css        – štýly (brand farby, layout, animácie)
js/main.js            – interakcie a animácie (menu, ticker, marquee, slot-machine)
assets/
  img/                – logo, ikony, hero poster, dvojbodka v pozadí
  video/              – SHOWREEL VIDEO (sem dodaj súbor – viď nižšie)
  portfolio/          – obrázky/náhľady prác
  logos/clients/      – LOGÁ KLIENTOV (sem dodaj čisté logá)
  logos/awards/       – logá súťaží/ocenení
```

## Podklady (už zapojené)

- **Showreel video** — `assets/video/showreel.mp4` (1920×1080, autoplay/muted/loop).
  Poster `assets/img/hero-poster.png` (LOVE FOR) sa zobrazí, kým sa video nenačíta.
  Pozn.: súbor má ~138 MB — pri nasadení zváž odľahčenú/komprimovanú verziu.
- **Logá klientov** — `assets/logos/clients/klienti_1.png` (horný riadok) a
  `klienti_2.png` (spodný riadok). Sú to súvislé pásy, marquee ich pre slučku vloží 2×.
- **Logá súťaží** — `assets/logos/awards/sutaze.png`.
- **Práce** — `assets/portfolio/{mila,xiaomi,NMS,hevier}.png`.

### Ako vymeniť / pridať podklady
- **Iné video:** prepíš `assets/video/showreel.mp4`.
- **Iné logá:** vymeň príslušný PNG pás (rovnaký pomer strán); cesty sú v
  `js/main.js` v poli `tracks`.
- **Ďalšia práca:** pridaj `<article class="work-card">…</article>` do `#work-reel`
  v `index.html` — slot-machine ich preberá automaticky.

## Animácie podľa komentárov grafika

| Sekcia        | Komentár grafika                                              | Implementácia |
|---------------|--------------------------------------------------------------|---------------|
| Hero          | Showreel video, autoplay pri načítaní                        | `<video autoplay muted loop>` + poster |
| Novinky       | Texty sa menia, rotujú ako slivky na automate                | vertikálny „slot" reel (`#ticker`) |
| Klienti       | Logá defilujú: horný riadok →, spodný ←                       | dva marquee pásy (opačné smery) |
| Naše práce    | Karty rotujú ako slivky; dvojbodka v pozadí zostáva statická | vertikálny slot reel + statická „:" (`.work__colon`) |
| Súťaže        | Logá defilujú sprava doľava                                  | marquee pás |

Animácie rešpektujú `prefers-reduced-motion` (vypnú sa pri obmedzenom pohybe).

## Brand
- PS:BLUE `#004165` · PS:AZURE `#00B3BE` · PS:YELLOW `#FECB00`
- Font: Montserrat (Google Fonts)
