# Single Page HTML Template

A base template for beginning a single page website. Contains a number of useful bits for ensuring the highest potential for SEO on a site that has minimal (if any) content: OG tags, template for an opengraph image, Google Analtyics code, Schema JSON block, manifest JSON file, various favicon image sizes, tags for responsive styling, along with Gulp files for compiling SCSS & JS. 

---

## Setting up & running gulp
1. Navigate to `/gulp` directory

2. From terminal run 'npm install', this will install all the required dependencies listed in package.json _(you may need to be run as root/admin)_

3. After dependencies are installed gulp can be ran using any of the following commands (depending on what you need).

	`gulp sass`
	complile/lint/minfy scss files

	`gulp js`
	compile/lint/minify scripts in JS folder

	`gulp watch`
	watch all files in `_js/` and `_css/` directories for changes and run js/css linting and compiling. 
	
---
## Develpment Pipeline
1. Improve Gulp functions for `source` & `dist` directories to improve deployment of sites.

---
## Examples
• [Elemental Properties](https://elementalproperties.com.au/)
• [Meet Martha](http://meetmartha.com.au/)
• [Social State of Mind](https://socialstateofmind.com.au/)