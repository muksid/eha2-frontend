import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jsconfigPaths from 'vite-jsconfig-paths'
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr'
import tailwindcss from "@tailwindcss/vite";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths(), svgr(),
  eslint(), tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://172.17.110.54:3399', // адрес Laravel сервера
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
