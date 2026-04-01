import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages のプロジェクトサイト: https://<user>.github.io/budget/
const base =
  process.env.GITHUB_PAGES === "true" ? "/budget/" : "/";

export default defineConfig({
  plugins: [react()],
  base,
});
