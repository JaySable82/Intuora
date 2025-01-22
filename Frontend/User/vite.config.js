import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root:'./',
  plugins: [react()],
  build: {
    outDir: 'build', // Output directory
},
server:{
  port:5173
}
});
