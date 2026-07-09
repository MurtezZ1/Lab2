import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react") || id.includes("react-dom")) return "vendor-react";
          if (id.includes("react-router-dom")) return "vendor-router";
          if (id.includes("@reduxjs") || id.includes("react-redux")) return "vendor-redux";
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("three")) return "vendor-3d";
          if (id.includes("lucide-react")) return "vendor-icons";
          if (id.includes("axios") || id.includes("socket.io-client")) return "vendor-network";
          return "vendor";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
  },
});
