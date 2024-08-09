/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      keyframes: {
        'scroll-in-left': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(0%)' },
            },
          'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        },  
        animation: {
          'scroll-in-left-1': 'scroll-in-left 2s ease-in-out',
          'scroll-in-left-2': 'scroll-in-left 2.25s ease-in-out',
          'scroll-in-left-3': 'scroll-in-left 2.5s ease-in-out',
          'scroll-in-left-4': 'scroll-in-left 2.75s ease-in-out',
          'scroll-in-left-5': 'scroll-in-left 3s ease-in-out',
          'gradient-x': 'gradient-x 5s ease infinite',
        },
    },
  },
  plugins: [],
}

