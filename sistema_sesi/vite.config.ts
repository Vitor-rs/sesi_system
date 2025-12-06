import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Libera acesso externo (necessário para Codespaces)
    port: 5173,
    strictPort: false, // Tenta outras portas se a 5173 estiver ocupada
  },
});
