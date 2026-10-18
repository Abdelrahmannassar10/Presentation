# GID · From Fragile to Resilient — Board deck

Cinematic 25-scene presentation of the IT & Call Center four-year report (Jan 2023 – Oct 2026), in English and Arabic.
Figures come from the `../data` folder: `IT_Call_Center_4-Year_Achievement_Report.md`, `achievement2.xlsx`, `readme.md` and `Financial_Data_Request_EN-AR.docx`.
The 304-item register is in `src/data/register.json`; every count in the deck is derived from it. Money lines and the EGP-per-USD rate (`FX`) are in `src/data/content.ts`.

## Present

Open `../GID_Board_Presentation.html` in Chrome or Edge. It is one self-contained file (fonts and photos embedded) and works offline.
Press **F** for fullscreen and **P** for the presenter window (notes, timer, live preview); drag that window to your laptop screen.

| Key | Action |
| --- | --- |
| → Space PgDn / ← PgUp | Next / previous step (clickers work) |
| F | Fullscreen |
| P | Presenter window |
| N | Speaker notes on screen |
| O | Scene overview |
| R | Searchable register of all 304 deliverables |
| L | English / العربية |
| B | Black screen |
| G | Film grain on / off |
| 1–25 then Enter | Jump to a scene |

## Develop

```sh
npm install
npm run dev      # live preview
npm run build    # writes dist/index.html (single file); copy it to ../GID_Board_Presentation.html
```

Stack: React 18, Framer Motion, Vite with `vite-plugin-singlefile`. Scenes live in `src/slides/Act1–4.tsx`; order and speaker notes in `src/deck.ts`.
Photography: Unsplash (free licence).
