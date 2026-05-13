import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api/at-ams-api": {
        target: "http://ams.uat3.ant2world.com",
        changeOrigin: true
      },
      "/api/at-cms-api": {
        target: "http://ams.uat3.ant2world.com",
        changeOrigin: true
      },
      "/api": {
        target: "http://ams.uat3.ant2world.com",
        changeOrigin: true
      }
    }
  },
  build: {
    lib: {
      entry: "src/index.ts",
      name: "AntViewVue3Ts",
      fileName: "index",
      formats: ["es"]
    }
  }
});
