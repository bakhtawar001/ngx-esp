const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  purge: {
    enabled: true,
    content: [
      './apps/**/*.html',
      './apps/**/*.component.ts',
      './apps/**/*.dialog.ts',
      './apps/**/*.page.ts',
      './libs/**/*.html',
      './libs/**/*.component.ts',
      './libs/**/*.dialog.ts',
      './libs/**/*.page.ts',
    ],
  },
  darkMode: false,
  theme: {
    container: (theme) => ({
      center: true,
      padding: {
        default: theme('spacing.4'),
        sm: theme('spacing.0'),
      },
    }),
    extend: {
      gridTemplateRows: {
        auto: 'auto 1fr',
      },
    },
  },
  variants: {
    padding: ['responsive', 'hover', 'focus', 'first', 'last'],
    margin: ['responsive', 'hover', 'focus', 'first', 'last'],
    backgroundColor: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
    borderStyle: ['hover'],
    boxShadow: ['hover'],
    borderColor: ['responsive', 'focus', 'hover', 'first', 'last'],
    borderWidth: ['responsive', 'focus', 'hover', 'first', 'last'],
    backgroundSize: ['responsive', 'hover', 'focus'],
    cursor: ['disabled'],
    maxWidth: ['responsive'],
    display: ['responsive', 'hover', 'group-hover'],
    minWidth: ['responsive'],
    flex: ['responsive'],
    flexShrink: ['responsive'],
    opacity: ['responsive', 'hover', 'focus', 'disabled'],
    position: ['responsive'],
    space: ['responsive'],
  },
  plugins: [],
};
