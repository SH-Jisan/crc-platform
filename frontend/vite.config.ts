import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 🔥 নতুন ইমপোর্ট

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react() as any,
        tailwindcss() as any, // 🔥 এখানে প্লাগইনটি অ্যাড করো
    ],
})