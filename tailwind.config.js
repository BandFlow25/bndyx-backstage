/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../bndy-ui/dist/**/*.{js,ts,jsx,tsx}", // Include bndy-ui components
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--bndy-orange)',
        'primary-hover': 'var(--bndy-orange-hover)',
        secondary: 'var(--bndy-cyan)',
        'secondary-hover': 'var(--bndy-cyan-hover)',
        orange: {
          500: 'var(--bndy-orange)', // BNDY orange
          600: 'var(--bndy-orange-hover)',
        },
        cyan: {
          500: 'var(--bndy-cyan)',
          600: 'var(--bndy-cyan-hover)',
        },
        slate: {
          50: 'var(--slate-50)',
          100: 'var(--slate-100)',
          200: 'var(--slate-200)',
          300: 'var(--slate-300)',
          400: 'var(--slate-400)',
          500: 'var(--slate-500)',
          600: 'var(--slate-600)',
          700: 'var(--slate-700)',
          800: 'var(--slate-800)',
          900: 'var(--slate-900)',
        },
      },
      backgroundColor: {
        card: 'var(--card-bg)',
        sidebar: 'var(--sidebar-bg)',
        header: 'var(--header-bg)',
        input: 'var(--input-bg)',
      },
      borderColor: {
        DEFAULT: 'var(--card-border)',
        input: 'var(--input-border)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
      },
    },
  },
  plugins: [],
}