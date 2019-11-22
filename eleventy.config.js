const htmlmin = require('html-minifier');
const filtersDates = require('./src/filters/dates.js');
const filtersTimestamp = require('./src/filters/timestamp.js');

// Toggle minification of HTML code
const minifyHtml = false;

module.exports = (config) => {
  // Add a readable date formatter filter to Nunjucks
  config.addFilter('dateDisplay', filtersDates);

  // Add a HTML timestamp formatter filter to Nunjucks
  config.addFilter('htmlDateDisplay', filtersTimestamp);

  // Minify our HTML
  config.addTransform('htmlmin', (content, outputPath) => {
    if (minifyHtml && outputPath.endsWith('.html')) {
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
  config.addCollection('blog', collection => (
    collection.getFilteredByTag('blog').reverse()
  ));

  // Layout aliases
  config.addLayoutAlias('default', 'layouts/default.njk');
  config.addLayoutAlias('post', 'layouts/post.njk');

  // Include our static assets
  config.addPassthroughCopy('src/site/images');
  config.addPassthroughCopy({ 'src/site/temp/css': 'css' });
  config.addPassthroughCopy({ 'src/site/temp/js': 'js' });

  return {
    dir: {
      input: 'src/site',
      output: 'build',
      includes: 'includes',
      data: 'data'
    },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', 'txt'],
    passthroughFileCopy: true
  };
};
