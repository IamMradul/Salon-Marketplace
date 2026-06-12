import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url) {
            const urlObj = new URL(req.url, 'http://localhost');
            const pathname = urlObj.pathname;
            
            // Rewrite clean URL paths internally to serve the respective .html file (e.g. /services -> /services.html)
            if (pathname !== '/' && !pathname.includes('.')) {
              urlObj.pathname = `${pathname}.html`;
              req.url = urlObj.pathname + urlObj.search;
            }
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url) {
            const urlObj = new URL(req.url, 'http://localhost');
            const pathname = urlObj.pathname;
            
            if (pathname !== '/' && !pathname.includes('.')) {
              urlObj.pathname = `${pathname}.html`;
              req.url = urlObj.pathname + urlObj.search;
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services.html'),
        salons: resolve(__dirname, 'salons.html'),
        shop: resolve(__dirname, 'shop.html')
      }
    }
  }
});
