import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 경로 별칭 설정
    },
  },
  server: {
    proxy: {
      // 백엔드 API로 프록시 설정
      "/api": {
        target: "http://localhost:5000", // 백엔드 서버 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
