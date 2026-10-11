import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

function apiHandlerPlugin(): Plugin {
  return {
    name: 'api-handler-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]

        if (
          url === '/api/auth' ||
          url === '/api/students' ||
          url === '/api/settings' ||
          url === '/api/create-checkout-session' ||
          url === '/api/verify-payment' ||
          url === '/api/ai-tutor'
        ) {
          const wrappedRes = res as any
          if (!wrappedRes.status) {
            wrappedRes.status = (code: number) => {
              wrappedRes.statusCode = code
              return wrappedRes
            }
          }
          if (!wrappedRes.json) {
            wrappedRes.json = (data: any) => {
              wrappedRes.setHeader('Content-Type', 'application/json')
              wrappedRes.end(JSON.stringify(data))
            }
          }

          try {
            if (url === '/api/auth') {
              // @ts-ignore
              const { default: authHandler } = await import('./api/auth.js')
              await authHandler(req as any, wrappedRes)
              return
            }
            if (url === '/api/students') {
              // @ts-ignore
              const { default: studentsHandler } = await import('./api/students.js')
              await studentsHandler(req as any, wrappedRes)
              return
            }
            if (url === '/api/settings') {
              // @ts-ignore
              const { default: settingsHandler } = await import('./api/settings.js')
              await settingsHandler(req as any, wrappedRes)
              return
            }
            if (url === '/api/create-checkout-session') {
              // @ts-ignore
              const { default: checkoutHandler } = await import('./api/create-checkout-session.js')
              await checkoutHandler(req as any, wrappedRes)
              return
            }
            if (url === '/api/verify-payment') {
              // @ts-ignore
              const { default: verifyHandler } = await import('./api/verify-payment.js')
              await verifyHandler(req as any, wrappedRes)
              return
            }
            if (url === '/api/ai-tutor') {
              // @ts-ignore
              const { default: aiTutorHandler } = await import('./api/ai-tutor.js')
              await aiTutorHandler(req as any, wrappedRes)
              return
            }
          } catch (err: any) {
            console.error(`Error handling ${url}:`, err)
            wrappedRes.statusCode = 500
            wrappedRes.setHeader('Content-Type', 'application/json')
            wrappedRes.end(JSON.stringify({ error: err.message || 'Internal Server Error' }))
            return
          }
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    process.env[key] ??= value;
  }

  return {
    plugins: [react(), apiHandlerPlugin()],
    build: {
      target: 'esnext',
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('node_modules/canvas-confetti')) {
              return 'vendor-confetti';
            }
            if (id.includes('src/data/roundQuestions')) {
              return 'data-round-questions';
            }
            if (id.includes('src/data/patenteTranslationsBn')) {
              return 'data-translations';
            }
          },
        },
      },
    },
  };
});
