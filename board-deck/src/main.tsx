import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Latin-only subsets keep the single-file build small; Arabic comes from IBM Plex Sans Arabic.
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-700.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-400.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-600.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-700.css";
import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2";
import "./styles.css";
import App from "./App";

const face = document.createElement("style");
face.textContent = `@font-face{font-family:"Inter Variable";font-style:normal;font-display:swap;font-weight:100 900;src:url(${interLatin}) format("woff2");}`;
document.head.append(face);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
