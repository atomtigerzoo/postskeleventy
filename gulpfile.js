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
const paths = {
  css: {
    source: './resources/css/main.css',
    dest: 'css/'
  },
  javascript: {
    source:
    [
      './resources/js/utilities/*.js',
      './resources/js/local/*.js'
    ],
    dest: 'javascript/'
  }
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
    return content.match(/[A-z0-9-:/]+/g) || [];
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
        cssImport({ from: `${paths.css.source}main` }),
        postcssNesting(),
        postcssCustomMedia(),
        tailwindcss('./tailwind.config.js'),
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
  src(paths.javascript.source)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(babel({
      presets: ['@babel/env'],
      sourceType: 'script'
    }))
    .pipe(concat('main.js'))
    .pipe(dest(paths.javascript.dest))
    .pipe(notify({
      message: 'Javascript Compile Success'
    }))
);


/**
 * Minify scripts
 * This will be ran as part of our preflight task
 */
const minifyJS = () => (
  src(`${paths.javascript.dest}main.js`)
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(dest(paths.javascript.dest))
    .pipe(notify({
      message: 'Javascript Minify Success'
    }))
);


/**
 * Watch files
 */
const watchFiles = (done) => {
  watch([
    'site/*.njk',
    'site/includes/**/*.njk',
  ], series(compileCSS));
  watch('./tailwind.config.js', series(compileCSS));
  watch('./resources/css/**/*.css', series(compileCSS));
  watch('./resources/js/**/*.js', series(compileJS));
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
      cssImport({ from: `${paths.css.source}main` }),
      postcssNesting(),
      postcssCustomMedia(),
      tailwindcss('./tailwind.config.js'),
      postcssPresetEnv({
        stage: 2,
        features: {
          'nesting-rules': true
        }
      }),
      purgecss({
        content: [
          'site/*.njk',
          'site/includes/**/*.njk',
        ],
        extractors: [{
          extractor: TailwindExtractor,
          extensions: ['html', 'njk'],
        }],
        /**
         * You can whitelist selectors to stop purgecss from removing them from your CSS.
         * see: https://www.purgecss.com/whitelisting
         *
         * Any selectors defined below will not be stripped from the main.min.css file.
         * PurgeCSS will not purge the main.css file, as this is useful for development.
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
    .pipe(dest('css/'))
    .pipe(notify({
      message: 'CSS & Tailwind [PREFLIGHT] Success'
    }))
);


/**
 * Minify CSS [PREFLIGHT]
 */
const minifyCSSPreflight = () => (
  src([
    './css/*.css',
    '!./css/*.min.css'
  ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest('./css'))
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
