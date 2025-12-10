/** @type {import('tailwindcss').Config} */
/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = {
  darkMode: ['class'],
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        sesi: {
          blue: {
            DEFAULT: '#0047BB', // Official FIEMS Blue
            hover: '#003388',
            light: '#4d94ff'
          },
          green: {
            DEFAULT: '#009540', // Official FIEMS Green
            hover: '#007a33',
            light: '#45a247'
          },
          dark: '#003366',
          gray: '#F3F4F6'
        },
        backgroundImage: {
          'gradient-meridian': 'linear-gradient(to right, #45a247, #283c86)',
          'gradient-lush': 'linear-gradient(to right, #a8e063, #56ab2f)',
          'gradient-quepal': 'linear-gradient(to right, #38ef7d, #11998e)',
          'gradient-visions': 'linear-gradient(to right, #1CB5E0, #000046)',
          'gradient-cristal': 'linear-gradient(to left, #155799, #159957)',
          'gradient-lagoon': 'linear-gradient(to left, #191654, #43C6AC)',
          'gradient-frost': 'linear-gradient(to left, #004e92, #000428)',
          'gradient-telegram': 'linear-gradient(to left, #f2fcfe, #1c92d2)',
          // Official SESI/FIEMS Brand Gradients
          'gradient-sesi': 'linear-gradient(to right, #0047BB, #009540)',
          'gradient-sesi-subtle': 'linear-gradient(to right, #0047BB20, #00954020)'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
