import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // يتيح الوصول من أي IP محلي (يعني بدل localhost)
    port: 3000, // تقدر تختار رقم بورت يناسبك، اختياري
  },
});
