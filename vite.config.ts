import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env for server-side dev middleware without leaking to client
  if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return {
    plugins: [
      react(),
      {
        name: 'parcelflow-ai-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url || '';
            if (url.startsWith('/api/ai/chat')) {
              try {
                const chatModule = await server.ssrLoadModule('/api/ai/chat.ts');
                const handler = chatModule.default || chatModule.handler;
                if (typeof handler === 'function') {
                  await handler(req, res);
                  return;
                }
              } catch (err: any) {
                console.error('[Vite AI Middleware Error]:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: false,
                    error: err?.message || 'Internal AI Server Error',
                  })
                );
                return;
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
        'lucide-react': path.resolve(import.meta.dirname, './src/lucide-shim.ts'),
        'gsap': path.resolve(import.meta.dirname, './src/gsap-shim.ts'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
  };
});
