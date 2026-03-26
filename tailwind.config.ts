import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ARC 1 Void Theme Design Tokens (accessible as Tailwind classes)
        'arc-accent':    '#818CF8',
        'arc-success':   '#4ADE80',
        'arc-warning':   '#FBBF24',
        'arc-danger':    '#F87171',
        'arc-bg':        '#050508',
        'arc-bg-2':      '#0C0C0E',
        'arc-bg-3':      '#18181B',
        'arc-border':    'rgba(255,255,255,0.08)',
        'arc-text':      '#FFFFFF',
        'arc-text-2':    '#A1A1AA',
        'arc-text-muted':'#52525B',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
