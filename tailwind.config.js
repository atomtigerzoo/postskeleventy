module.exports = {
  theme: {},
  variants: {},
  plugins: [],
  purge: {
    content: ['./src/site/*.njk', './src/site/**/*.njk'],
    options: {
      safelist: ['container', 'mx-auto']
    }
  }
};
