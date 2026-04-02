import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── LIGHT MAGICAL REALISM PALETTE ────────────────────────────────────
      // Drawn from the luminous, equatorial light in Crawford's painting —
      // the waterfall whites, the pale sky, the warm gilded frame.
      //
      //  parchment    #FAF6EF  Warm canvas base — page background
      //  vellum       #F2EBE0  Slightly deeper cream — cards, panels
      //  whisper      #E8DED2  Soft warm border/divider tone
      //  ink          #2C1F14  Deep warm brown — primary text
      //  dusk         #6B4F3A  Mid-tone warm brown — secondary text
      //  blush        #D4958A  Dusty rose from the cave walls — primary accent
      //  'blush-light' #EBC4BC  Pale blush — hover states
      //  celestial    #8FAEC8  Soft periwinkle sky — cool accent
      //  'celestial-light' #C5D9EC  Pale sky blue — subtle highlights
      //  gold         #B8882A  Aged antique gold from the frame
      //  'gold-light' #D4A84B  Lighter gold for highlights
      //  ember        #C97A45  Warm terracotta from the orange sphere
      //  sage         #8FAF8A  Soft sage green — nature accent
      //  lavender     #B8A8CC  Muted lavender — dreamlike accent
      // ───────────────────────────────────────────────────────────────────────
      colors: {
        parchment:  '#FAF6EF',
        vellum:     '#F2EBE0',
        whisper:    '#E8DED2',
        ink:        '#2C1F14',
        dusk:       '#6B4F3A',
        blush:      '#D4958A',
        'blush-light': '#EBC4BC',
        'blush-deep': '#B87060',
        celestial:  '#8FAEC8',
        'celestial-light': '#C5D9EC',
        'celestial-deep': '#5A84A8',
        gold:       '#B8882A',
        'gold-light': '#D4A84B',
        'gold-pale': '#EDD9A3',
        ember:      '#C97A45',
        'ember-light': '#E8A878',
        sage:       '#8FAF8A',
        lavender:   '#B8A8CC',
            'lavender-light': '#D8CDE8',
            crimson: '#C42040',
            'crimson-light': '#E8728A',
            rose: '#F2A0B0'
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body:    ['var(--font-lora)', 'Georgia', 'serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'portal-gradient': 'radial-gradient(ellipse at top, #EBC4BC 0%, #F2EBE0 40%, #FAF6EF 100%)',
        'gold-shimmer':    'linear-gradient(135deg, #8A6010 0%, #B8882A 40%, #D4A84B 60%, #B8882A 100%)',
        'void-fade':       'linear-gradient(to bottom, #FAF6EF 0%, #F2EBE0 100%)',
        'nebula-glow':     'radial-gradient(ellipse at center, rgba(212,149,138,0.25) 0%, transparent 70%)',
        'celestial-glow':  'radial-gradient(ellipse at center, rgba(143,174,200,0.2) 0%, transparent 60%)',
        'hero-texture':    'radial-gradient(ellipse at 30% 20%, rgba(184,168,204,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(143,174,200,0.2) 0%, transparent 50%)',
      },
      boxShadow: {
        'gold':       '0 0 20px rgba(184,136,42,0.2), 0 0 60px rgba(184,136,42,0.08)',
        'blush':      '0 0 20px rgba(212,149,138,0.3), 0 0 60px rgba(212,149,138,0.1)',
        'inset-gold': 'inset 0 0 30px rgba(184,136,42,0.05)',
        'card':       '0 2px 20px rgba(44,31,20,0.08), 0 1px 4px rgba(44,31,20,0.04)',
        'card-hover': '0 8px 40px rgba(44,31,20,0.14), 0 0 20px rgba(184,136,42,0.1)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'shimmer':    'shimmer 3s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'fade-up':    'fadeUp 0.8s ease forwards',
        'fade-in':    'fadeIn 1s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
}
export default config
