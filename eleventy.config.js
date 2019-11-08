const htmlmin = require('html-minifier');
const filtersDates = require('./filters/dates.js');
const filtersTimestamp = require('./filters/timestamp.js');

module.exports = (eleventyConfig) => {
  // Add a readable date formatter filter to Nunjucks
  eleventyConfig.addFilter('dateDisplay', filtersDates);

  // Add a HTML timestamp formatter filter to Nunjucks
  eleventyConfig.addFilter('htmlDateDisplay', filtersTimestamp);

  // Minify our HTML
  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      const minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Collections
  eleventyConfig.addCollection('blog', collection => (
    collection.getFilteredByTag('blog').reverse()
  ));

  // Layout aliases
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk');
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');

  // Include our static assets
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('javascript');
  eleventyConfig.addPassthroughCopy('images');

  return {
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,

    dir: {
      input: 'site',
      output: 'dist',
      includes: 'includes',
      data: 'globals'
    }
  };
};
