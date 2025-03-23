/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'oklch(55% 0.15 240)', // Teinte principale plus vive
          hover: 'oklch(50% 0.15 240)',
          light: 'oklch(90% 0.05 240)',
          border: {
            light: 'oklch(55% 0.15 240 / 0.2)',
            hover: 'oklch(55% 0.15 240 / 0.3)'
          }
        },
        warning: {
          DEFAULT: 'oklch(55% 0.2 30)', // Teinte rouge plus vive
          hover: 'oklch(50% 0.2 30)',
          light: 'oklch(90% 0.05 30)',
          border: {
            light: 'oklch(55% 0.2 30 / 0.2)',
            hover: 'oklch(55% 0.2 30 / 0.3)'
          }
        },
        secondary: {
          DEFAULT: 'oklch(55% 0.15 200)', // Teinte douce et neutre plus vive
          hover: 'oklch(50% 0.15 200)',
          light: 'oklch(90% 0.05 200)',
          border: {
            light: 'oklch(55% 0.15 200 / 0.2)',
            hover: 'oklch(55% 0.15 200 / 0.3)'
          }
        },
        tertiary: {
          DEFAULT: 'oklch(55% 0.18 320)', // Teinte complémentaire plus vive
          hover: 'oklch(50% 0.18 320)',
          light: 'oklch(90% 0.07 320)',
          border: {
            light: 'oklch(55% 0.18 320 / 0.2)',
            hover: 'oklch(55% 0.18 320 / 0.3)'
          }
        },
        light: {
          page: 'oklch(97% 0.01 240)',
          surface: 'oklch(98% 0.005 240)',
          card: 'oklch(100% 0 0)',
          border: 'oklch(90% 0.02 240)',
          text: {
            primary: 'oklch(25% 0.02 240)',
            secondary: 'oklch(45% 0.02 240)',
          }
        },
        dark: {
          DEFAULT: 'oklch(20% 0 0)',
          '50': 'oklch(98% 0.005 240)',
          '100': 'oklch(95% 0.01 240)',
          '200': 'oklch(90% 0.015 240)',
          '300': 'oklch(85% 0.02 240)',
          '400': 'oklch(70% 0.02 240)',
          '500': 'oklch(55% 0.02 240)',
          '600': 'oklch(40% 0.02 240)',
          '700': 'oklch(30% 0.02 240)',
          '800': 'oklch(20% 0.02 240)',
          '900': 'oklch(15% 0.01 240)',
          '950': 'oklch(10% 0.005 240)',
        }
      },
      backgroundColor: {
        dark: {
          primary: 'oklch(20% 0 0)',
          secondary: 'oklch(25% 0 0)',
          accent: 'oklch(30% 0 0)'
        }
      },
      textColor: {
        dark: {
          primary: 'oklch(100% 0 0)',
          secondary: 'oklch(80% 0 0)',
          accent: 'oklch(90% 0 0)'
        }
      }
    },
  },
  plugins: [],
}