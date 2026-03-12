import { defineConfig } from "vite";
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// Plugin to copy src directory to dist
function copySrcPlugin() {
  return {
    name: 'copy-src',
    closeBundle() {
      const copyRecursive = (src: string, dest: string) => {
        try {
          mkdirSync(dest, { recursive: true });
        } catch (e) {}
        
        const entries = readdirSync(src);
        
        for (const entry of entries) {
          const srcPath = join(src, entry);
          const destPath = join(dest, entry);
          
          if (statSync(srcPath).isDirectory()) {
            copyRecursive(srcPath, destPath);
          } else {
            try {
              mkdirSync(dirname(destPath), { recursive: true });
            } catch (e) {}
            copyFileSync(srcPath, destPath);
          }
        }
      };
      
      copyRecursive('src', 'dist/src');
      copyFileSync('app.js', 'dist/app.js');
    }
  };
}

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [copySrcPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
