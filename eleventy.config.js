// Plugins
const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster');
const htmlmin = require('html-minifier');
const filtersDates = require('./src/filters/dates.js');
const filtersTimestamp = require('./src/filters/timestamp.js');

// Toggle minification of HTML code
const minifyHtml = false;

module.exports = (config) => {
  // Cache buster plugin
  const cacheBusterOptions = {
    outputDirectory: 'build',
    createResourceHash(outputDirectoy, url, target) {
      return Date.now();
    }
  };
  config.addPlugin(cacheBuster(cacheBusterOptions));

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

  // Want to use selfhosted fonts? Uncomment the following line:
  //config.addPassthroughCopy('src/site/fonts');

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
