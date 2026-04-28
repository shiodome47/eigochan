import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // 開発時は SW を登録しない(キャッシュが学習体験を邪魔しないため)
      devOptions: {
        enabled: false,
      },
      includeAssets: [
        "favicon.svg",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
        "city/city-map-base.png",
        "city/city-map-base.webp",
      ],
      manifest: {
        name: "eigochan",
        short_name: "eigochan",
        description: "英語を声に出すほど、街が育つ。音読・暗唱・録音で英語を体に入れる。",
        lang: "ja",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#fdf8ee",
        background_color: "#fdf8ee",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // アプリシェル中心 + 静的アセットを precache
        globPatterns: ["**/*.{js,css,html,svg,png,webp,ico,webmanifest}"],
        // SPA ルートを SW のフォールバックに
        navigateFallback: "/index.html",
        // localStorage や録音は触らない。HTTPで取れるアセットのみ runtime キャッシュも控えめに。
        cleanupOutdatedCaches: true,
        // 街マップの背景画像(~3MB)を precache に含めるため上限を上げる
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  server: {
    port: 5173,
    open: false,
  },
});
