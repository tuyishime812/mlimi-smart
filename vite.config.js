import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    host: "::",
    port: 8080,

    // ✅ Allow Serveo and localhost (include specific tunneled hostnames we use)
    allowedHosts: [
      '5550d6d63395c54549f73c67bac1be7e.serveo.net',
      'serveo.net',
      'localhost',
      '127.0.0.1',
      '.serveo.net' // Allow all subdomains of serveo.net
    ],

    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));