import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Vite configuration for OBSIDIAN.
// Replaces the old create-react-app / craco build, which pulled in an
// incompatible ajv toolchain that could not build on standard hosts.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // The codebase came from CRA and uses process.env.REACT_APP_BACKEND_URL.
  // Keep that working without touching the source by inlining it at build time.
  define: {
    "process.env.REACT_APP_BACKEND_URL": JSON.stringify(
      process.env.REACT_APP_BACKEND_URL || ""
    ),
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "production"
    ),
  },
  server: { port: 3000, host: true },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
  },
});
