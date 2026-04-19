import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/HabitGarden/', // 🔥 EXACT repo name (case sensitive)
})