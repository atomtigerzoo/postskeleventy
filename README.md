# 🦴 PostSkeleventy

A skeleton boilerplate built with Eleventy and TailwindCSS v2.

View a preview of a default build here: https://postskeleventy.netlify.app/

[![Netlify Status](https://api.netlify.com/api/v1/badges/21491f6b-2445-4988-9718-4d1376364530/deploy-status)](https://app.netlify.com/sites/postskeleventy/deploys)

## Features

- Build sites faster, with the power of Eleventy, TailwindCSS and PostCSS
- Gulp build pipeline to watch, concatenate and compile styles and scripts
- HTML minifier
- Purgecss for removing unused CSS
- ES6 support with Babel
- An example blog, with categories and featured images

## Requirements

node.js, Git, _(to be completed)_

## Installation

From within a terminal, shell or commandline clone this repository with git to your computer:

```
git clone https://github.com/atomtigerzoo/postskeleventy.git
```

Enter the directory with `cd postskeleventy` and install all packages with:

```
npm install
```

Inside the project folder run `npm run dev` from within the terminal, to start a development server and let Gulp watch your files. 
Eleventy has baked in hot reloading and will watch the files for changes.

### Windows environment variables

For those of you on Windows, [see Daniel Schildt's potential fix](https://github.com/josephdyer/skeleventy/issues/2#issuecomment-465754702) for the environment helper. It is already built in into this project starter.

## Folder Structure

The folder `src/site` contains all templates, pages and content - which Eleventy will watch and parse into HTML for us.

Within this folder, you have a `data` folder, where you'll find a `site.json` file. Inside is everything for general site config e.g. language, url, name, author, email, social media... etc. You can extend it to your likening.

Also inside the `data` folder lies `navigation.json`, which Eleventy loops over to generate the navigation. The `helpers.js` contains the environment variable.

Uncompiled PostCSS _(you can also just write normal CSS if you like)_ and Javascript resides in the `includes/css` and `includes/js` folder. Gulp will be watching these folders for any changes and compile those while running dev or build. *After creating new partials or files, you should restart the server to have them all inside the watch process!*

While in development mode, PostSkeleventy will use `/src/site/temp/` as temporary folder for CSS and JS - just ignore this folder. Those files will be copied over to the `build` folder for display. Both files will be pretty chunky in filesize in development, due to it containing all of Tailwinds utility classes. Once you run the build command, PostSkeleventy will then reference the minified version of the stylesheet `/css/styles.min.css`.

PurgeCSS (when running build) cross references all of Tailwinds utility classes with your templates/HTML and will remove all the unused CSS and classes.

## Self-hosted fonts

If you would like to use self-hosted webfonts within your project, then go ahead an uncomment the following line in `eleventy.config.js`:

	//config.addPassthroughCopy('src/site/fonts');

This will copy the folder `src/site/fonts/` - where you can keep your fonts - and all its content to the build folder. Feel free to rename the folder and path to your likings.

## Configuration and settings

Folder paths, passthrough files and formats can be found in `eleventy.config.js`.

### Site and blog author settings

Please see the file `src/site/data/site.json` for some settings and defaults.

### Navigation

The navigation links can be found inside `src/site/data/navigation.json`. 
This is used in `src/site/includes/components/nav.njk` for example but can be used in other places too.

### Minify HTML on build

You can minify your HTML with the build process by setting `const minifyHtml = false;` to `true` inside the file `eleventy.config.js`.

## Ready to build and deploy?

Run `npm run build` inside the project folder to build/copy your all files, minify scripts and styles and run Purgecss.

After the build you can run `npm run serve` to get a preview on `http://localhost:5000`.

Now copy the whole content of the `build` folder to the hosting provider of your choice.

Please notice that the `build` folder is not included in the git tracking - delete the line in `.gitignore` if you want to track this folder too.

---

## License

MIT

This is a fork from [Skeleventy](https://github.com/josephdyer/skeleventy), a project from Joseph Dyer.

Feel free to adapt this as you wish! Go build some cool stuff - seriously it's the future!
