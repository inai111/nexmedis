import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define:{
    'import.meta.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL)??'localhost',
  }
})
