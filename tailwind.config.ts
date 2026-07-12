import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#EBEEF3',
        surface: '#FFFFFF',
        'surface-2': '#F3F5F9',
        ink: '#141A24',
        muted: { foreground: '#6A7486' },
        line: '#DDE2EA',
        accent: { DEFAULT: '#4338CA', soft: '#EAE8FD' },
        lime: '#B6E82E',
        amber: '#F0A32B',
        ok: '#18A957',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
