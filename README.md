[![Netlify Status](https://api.netlify.com/api/v1/badges/21491f6b-2445-4988-9718-4d1376364530/deploy-status)](https://app.netlify.com/sites/postskeleventy/deploys)

# 🦴 PostSkeleventy

A skeleton boilerplate built with Eleventy and TailwindCSS.

## Features

- Build sites faster, with the power of Eleventy, TailwindCSS and PostCSS
- Gulp build pipeline to watch, concatenate and compile styles and scripts
- HTML minifier
- Purgecss for removing unused CSS
- ES6 support with Babel
- SEO friendly pages (including open graph and twitter meta)
- A simple blog, with categories and featured images

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

The folder `site` contains all templates, pages and content - which Eleventy will watch and parse into HTML for us.

Within this folder, you have a `globals` folder, where you'll find a `site.json` file. Inside is everything for general site config e.g. url, name, author, email, social media... etc. You can extend it to your likening.

Also inside the `globals` folder lies `navigation.json`, which Eleventy loops over to generate the navigation. The `helpers.js` contains the environment variable.

Uncompiled PostCSS _(you can also just write normal CSS if you like)_ and Javascript resides in the `resources` folder. Gulp will be watching these folders for any changes and compile those while running dev or build. *After creating new partials or files, you should restart the server to have them all inside the watch process!*

While in development mode, PostSkeleventy will use `/css/main.css` as the stylesheet. This will be pretty chunky in filesize, due to it containing all of Tailwinds utility classes. Once you run the build command, PostSkeleventy will then reference the minified version of the stylesheet `/css/main.min.css`.

PurgeCSS (when running build) cross references all of Tailwinds utility classes with your templates/HTML and will remove all the unused CSS and classes.

## Ready to build and deploy?

Run `npm run build` inside the project folder to build/copy your all files, minify scripts and styles and run Purgecss.

After the build you can run `npm run serve` to get a preview on `http://localhost:5000`.

Now copy the whole content of the `build` folder to the hosting provider of your choice.

---

## License

MIT

This is a fork from [Skeleventy](https://github.com/josephdyer/skeleventy), a project from Joseph Dyer.

Feel free to adapt this as you wish! Go build some cool stuff - seriously it's the future!
