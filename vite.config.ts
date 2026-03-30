import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        devSourcemap: true
    },
    resolve: {
        dedupe: ['react', 'react-dom'],
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@fonts': path.resolve(__dirname, './src/assets/fonts'),
        },
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true
        }
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react/jsx-runtime']
    },
    server: {
        allowedHosts: true
    }
})
