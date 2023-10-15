import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // By default, Vite doesn't include shims for NodeJS necessary for segment analytics lib to work.
    // https://github.com/vitejs/vite/discussions/5912
    global: {},
  },
  resolve: {
    // https://stackoverflow.com/questions/70938763/build-problem-with-react-vitejs-and-was-amplify
    alias: {
      './runtimrConfig': './runtimeConfig.browser',
    },
  },
});
