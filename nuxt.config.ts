// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // Disable SSR for Tauri compatibility
  devtools: { enabled: true },
  vite: {
    clearScreen: false, // Improve Tauri CLI output visibility
    envPrefix: ['VITE_', 'TAURI_'], // Enable environment variables
    server: {
      strictPort: true, // Tauri requires a consistent port
    },
  },
  ignore: ['**/src-tauri/**'], // Avoid file watching issues
})
