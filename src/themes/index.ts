/**
 * ARC 1 Admin Theme System
 * Provides design tokens for the admin panel UI.
 * All components call getTheme('void') to access these tokens.
 */

export interface AdminTheme {
  // Brand
  accent: string;
  accentHover: string;
  accentDim: string;
  accentBorder: string;

  // Semantic
  success: string;
  successDim: string;
  successBorder: string;
  warning: string;
  warningDim: string;
  warningBorder: string;
  danger: string;
  dangerDim: string;
  dangerBorder: string;
  info: string;    // violet
  infoDim: string;
  infoBorder: string;
  gold: string;
  goldDim: string;
  goldBorder: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDimmed: string;
  textOnAccent: string;

  // Backgrounds (layered)
  bgPrimary: string;   // page background
  bgSecondary: string; // card background
  bgTertiary: string;  // input / nested
  bgElevated: string;  // raised elements

  // Borders
  borderDefault: string;
  borderSubtle: string;
  borderStrong: string;

  // Typography
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
}

const VOID_THEME: AdminTheme = {
  // Brand — Blue (matches HTML arc: #4f8ef7)
  accent:       '#4f8ef7',
  accentHover:  '#7ab3ff',
  accentDim:    'rgba(79,142,247,0.07)',
  accentBorder: 'rgba(79,142,247,0.19)',

  // Semantic
  success:       '#3ecf8e',
  successDim:    'rgba(62,207,142,0.07)',
  successBorder: 'rgba(62,207,142,0.19)',
  warning:       '#f5a623',
  warningDim:    'rgba(245,166,35,0.07)',
  warningBorder: 'rgba(245,166,35,0.19)',
  danger:        '#f06b8a',
  dangerDim:     'rgba(240,107,138,0.07)',
  dangerBorder:  'rgba(240,107,138,0.19)',
  info:          '#9b6ef5',
  infoDim:       'rgba(155,110,245,0.07)',
  infoBorder:    'rgba(155,110,245,0.19)',
  gold:          '#e8c170',
  goldDim:       'rgba(232,193,112,0.07)',
  goldBorder:    'rgba(232,193,112,0.19)',

  // Text (blue-tinted, matching HTML)
  textPrimary:   '#f0f2ff',
  textSecondary: '#b8bdd8',
  textMuted:     '#7880a0',
  textDimmed:    '#454d68',
  textOnAccent:  '#ffffff',

  // Backgrounds — richer layering
  bgPrimary:   '#05060a',
  bgSecondary: '#0c1018',
  bgTertiary:  '#111620',
  bgElevated:  '#161d2a',

  // Borders
  borderDefault: 'rgba(255,255,255,0.09)',
  borderSubtle:  'rgba(255,255,255,0.04)',
  borderStrong:  'rgba(255,255,255,0.16)',

  // Typography — Outfit as primary (matches HTML)
  fontDisplay: '"Outfit", "Space Grotesk", sans-serif',
  fontBody:    '"Outfit", sans-serif',
  fontMono:    '"JetBrains Mono", monospace',
};

const THEMES: Record<string, AdminTheme> = {
  void: VOID_THEME,
};

export function getTheme(name: string = 'void'): AdminTheme {
  return THEMES[name] ?? VOID_THEME;
}
