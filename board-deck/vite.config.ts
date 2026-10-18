import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Single-file build: fonts and photos are inlined so the deck runs offline from one .html file.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: "./",
  build: { assetsInlineLimit: 100_000_000, cssCodeSplit: false, chunkSizeWarningLimit: 20_000 },
});
