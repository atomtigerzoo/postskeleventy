/*
    The main Gulp file
    */

/*
  Settings, paths, etc..
*/
const {
  gulp, src, dest, watch, series, parallel
} = require('gulp');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');

// Styles
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
const tailwindcss = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const postcssCustomMedia = require('postcss-custom-media');
const postcssNesting = require('postcss-nesting');


// Scripts
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');


/**
 * File paths
 */
const basepath = './src/site/includes/';
const paths = {
  css: {
    source: `${basepath}css/styles.css`,
    dest: './src/site/temp/css/'
  },
  js: {
    source: `${basepath}js/*.js`,
    dest: './src/site/temp/js/'
  },
  tailwindconfig: './tailwind.config.js'
};


/**
 * Errors function
 */
const onError = (err) => {
  notify.onError({
    title: 'Gulp Error - Compile Failed',
    message: 'Error: <%= error.message %>'
  })(err);

  this.emit('end');
};


/**
 * Tailwind extractor
 */
class TailwindExtractor {
  static extract(content) {
    return content.match(/[\w-/:]+(?<!:)/g) || [];
  }
}


/**
 * Transpile CSS & Tailwind
 */
const compileCSS = () => (
  src(paths.css.source)
    .pipe(
      plumber({ errorHandler: onError })
    )
    .pipe(
      postcss([
        cssImport({ from: `${paths.css.source}styles` }),
        postcssNesting(),
        postcssCustomMedia(),
        tailwindcss(paths.tailwindconfig),
        postcssPresetEnv({
          stage: 2,
          features: {
            'nesting-rules': true
          }
        })
      ])
    )
    .pipe(dest(paths.css.dest))
    .pipe(notify({
      message: 'Tailwind Compile Success'
    }))
);


/**
 * Concatinate and compile scripts
 */
const compileJS = () => (
  src(paths.js.source)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(babel({
      presets: ['@babel/env'],
      sourceType: 'script'
    }))
    .pipe(concat('scripts.js'))
    .pipe(dest(paths.js.dest))
    .pipe(notify({
      message: 'Javascript Compile Success'
    }))
);


/**
 * Minify scripts
 * This will be ran as part of our preflight task
 */
const minifyJS = () => (
  src(`${paths.js.dest}scripts.js`)
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(dest(paths.js.dest))
    .pipe(notify({
      message: 'Javascript Minify Success'
    }))
);


/**
 * Watch files
 */
const watchFiles = (done) => {
  watch([
    'src/site/*.njk',
    `${basepath}/**/*.njk`,
  ], series(compileCSS));
  watch(paths.tailwindconfig, series(compileCSS));
  watch(`${basepath}css/**/*.css`, series(compileCSS));
  watch(`${basepath}js/**/*.js`, series(compileJS));
  done();
};


/**
 * CSS Preflight
 *
 * Compile CSS & Tailwind [PREFLIGHT]
 */
const compileCSSPreflight = () => (
  src(paths.css.source)
    .pipe(postcss([
      cssImport({ from: `${paths.css.source}styles` }),
      postcssNesting(),
      postcssCustomMedia(),
      tailwindcss(paths.tailwindconfig),
      postcssPresetEnv({
        stage: 2,
        features: {
          'nesting-rules': true
        }
      }),
      purgecss({
        content: [
          'src/site/*.njk',
          `${basepath}**/*.njk`,
        ],
        extractors: [{
          extractor: TailwindExtractor,
          extensions: ['html', 'njk'],
        }],
        /**
         * You can whitelist selectors to stop purgecss from removing them from your CSS.
         * see: https://www.purgecss.com/whitelisting
         *
         * Any selectors defined below will not be stripped from the styles.min.css file.
         * PurgeCSS will not purge the styles.css file, as this is useful for development.
         *
         * @since 1.0.0
         */
        whitelist: [
          'body',
          'html',
          'h1',
          'h2',
          'h3',
          'p',
          'blockquote',
          'intro'
        ],
      })
    ]))
    .pipe(dest(paths.css.dest))
    .pipe(notify({
      message: 'CSS & Tailwind [PREFLIGHT] Success'
    }))
);


/**
 * Minify CSS [PREFLIGHT]
 */
const minifyCSSPreflight = () => (
  src([
    `${paths.css.dest}*.css`,
    `!${paths.css.dest}*.min.css`
  ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest(paths.css.dest))
    .pipe(notify({
      message: 'Minify CSS [PREFLIGHT] Success'
    }))
);


/**
 * [BUILD] task
 * Run this once you're happy with your site and you want to prep the files for
 * production.
 *
 * This will run the Preflight tasks to minify our CSS and scripts, as well as
 * pass the CSS through PurgeCSS to remove any unused CSS.
 *
 * Always double check that everything is still working. If something isn't
 * displaying correctly, it may be because you need to add it to the PurgeCSS
 * whitelist.
 */
exports.build = series(compileCSSPreflight, minifyCSSPreflight, minifyJS);


/**
 * [DEFAULT] task
 * This should always be the last in the gulpfile
 * This will run while you're building the theme and automatically compile any
 * changes. This includes any html changes you make so that the PurgeCSS file
 * will be updated.
 */
exports.default = series(compileCSS, compileJS, watchFiles);
