import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { staticPages } from "./scripts/static-pages";

export default defineConfig({
  plugins: [staticPages(), react()],
  base: "/",
  build: { manifest: true },
});
