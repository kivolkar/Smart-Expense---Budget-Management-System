/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
        },
        accent: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        surface: {
          DEFAULT: '#1e1e2e',
          hover: '#2a2a3d',
        },
        background: '#0f0f1a',
        'text-primary': '#e2e8f0',
        'text-muted': '#94a3b8',
        border: '#2e2e42',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.15)',
      },
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
      },
      spacing: {
        'touch': '44px',
        'sidebar': '240px',
        'sidebar-collapsed': '64px',
      },
    },
  },
  plugins: [],
}
