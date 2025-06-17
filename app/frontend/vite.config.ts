import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "../backend/static",
        emptyOutDir: true,
        sourcemap: true
    },
    server: {
        proxy: {
            "/search": "http://127.0.0.1:5000",
            "/getTopics": "http://127.0.0.1:5000",
            "/refine": "http://127.0.0.1:5000",
            "/getGPTAnswer": "http://127.0.0.1:5000",
            "/getOrderedTopics":"http://127.0.0.1:5000"
        }
    }
});
