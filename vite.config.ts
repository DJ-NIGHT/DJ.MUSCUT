import { defineConfig, loadEnv } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const standalone = mode === 'standalone'
  const plugins: any[] = [react(), tailwindcss()]
  if (standalone) plugins.push(viteSingleFile())
  try {
    // @ts-ignore
    const m = await import('./.vite-source-tags.js')
    if (!standalone) plugins.push(m.sourceTags())
  } catch {}

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_'])
  const processEnvDefines: Record<string, string> = {}
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value)
  }

  return {
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
    ...(standalone
      ? {
          build: {
            outDir: 'dist-standalone',
            assetsInlineLimit: 100000000,
            chunkSizeWarningLimit: 100000,
          },
        }
      : {}),
  }
})
