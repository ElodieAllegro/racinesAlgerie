import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  // Dossier public pour les assets statiques
  publicDir: 'public',

  build: {
    // Dossier de sortie
    outDir: 'dist',

    // Minification avec Terser
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
      }
    },

    // Minification CSS
    cssMinify: true,

    rollupOptions: {
      output: {
        // Naming optimisé des fichiers JS
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        // Naming optimisé des assets (images, fonts, CSS)
        assetFileNames: assetInfo => {
          const ext = path.extname(assetInfo.name).slice(1)
          if (/^(png|jpe?g|svg|gif|ico|avif|webp)$/i.test(ext)) {
            return `assets/images/[name]-[hash].[ext]`
          }
          if (/^(mp4|webm|ogg|mp3|wav|flac|aac)$/i.test(ext)) {
            return `assets/media/[name]-[hash].[ext]`
          }
          if (/^css$/i.test(ext)) {
            return `css/[name]-[hash].[ext]`
          }
          return `assets/[name]-[hash].[ext]`
        }
      }
    },

    // Inline des petits assets (< 4 KB)
    assetsInlineLimit: 4096,

    // Ne pas générer de sourcemaps en prod
    sourcemap: false,

    // Cibler es2018 pour compatibilité
    target: 'es2018',

    // Afficher la taille des fichiers gzipés
    reportCompressedSize: true
  },

  // Serveur de développement
  server: {
    port: 5173,
    open: true
  },

  // Preview (serveur de prod local)
  preview: {
    port: 4173,
    open: true
  }
})
