var config          = require('./gulp.config')();
var gulp            = require('gulp'),
    util            = require('gulp-util'),
    gulpIf          = require('gulp-if'),
    args            = require('yargs').argv,
    filter          = require('gulp-filter'),
    sass          	= require('gulp-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    minifycss       = require('gulp-minify-css'),
    jshint 			= require('gulp-jshint'),
    rename			= require('gulp-rename'),
    plumber			= require('gulp-plumber'),
    notify			= require('gulp-notify'),
    uglify 			= require('uglify-es'),
    composer 		= require('gulp-uglify/composer'),
    pump 			= require('pump'),
    htmlmin 		= require('gulp-htmlmin'),
    removeLogging   = require("gulp-remove-logging"),
	del             = require("del"),
    browserSync     = require('browser-sync').create();

var minify      = composer(uglify, console);
var log         = util.log;
var colors      = util.colors;

var plumberErrorHandler = { 
	errorHandler: notify.onError({
		title: 'Gulp',
		message: 'Error: <%= error.message%>'
	})
};

// Clean Function
gulp.task('clean', function(done) {
	del('_dist', done);
});

// bourbon > prefix > minify > rename > distribute
gulp.task('sass', function(done) {
    var isProd = args.prod;

    pump([
        gulp.src(config.sourceFiles.scss),
        sass({
			includePaths: require('node-bourbon').includePaths
		}),
		autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'),
		gulpIf(isProd, minifycss()),
		rename({ suffix:'.min' }),
		gulp.dest( config.destination + '_css/'),
	    browserSync.stream({once: true})
    ], done);
});

// es v6 > jshint > minify > rename > distribute
gulp.task('js', function (done) {
    var isProd = args.prod;

    pump([
        gulp.src(config.sourceFiles.js),
        plumber(plumberErrorHandler),
        jshint({esversion: 6}),
        jshint.reporter('default', { verbose: true }),
        gulpIf(isProd, minify()),
        rename({ suffix:'.min' }),
        gulpIf(isProd, removeLogging({ namespace: ['console', 'window.console'] })),
        gulp.dest(config.destination + '_js/'),
	    browserSync.stream({once: true})
    ], done);

});

// Move All assets to _dist
gulp.task('move-assets', function(done) {
	// for assets folder
	pump([
		gulp.src(config.sourceFiles.img),
		gulp.dest(config.destination + '_assets'),
		browserSync.stream({once: true})
	], done);
});

// Run final output of prod on HTML files
gulp.task('output-prod', function(done) {
	var isProd      = args.prod;
	var sourceFiles = [
		config.sourceFiles.html,
		config.sourceFiles.json
	];
	var htmlFilter = filter('**/*.html', {restore: true});

	// if --prod flag is passed then minify html and remove code
	pump([
		gulp.src(sourceFiles),
		gulpIf(isProd, htmlFilter),
		gulpIf(isProd, htmlmin({collapseWhitespace: true})),
		gulpIf(isProd, htmlFilter.restore),
		gulp.dest(config.destination)
	], function(err) {
		if (typeof err === 'undefined' && browserSync.active) {
			browserSync.stream({once: true})
		}
	});

	done();
});

// Serve BrwoserSync if Dev
gulp.task('serve', function(done) {
	browserSync.init({
		server: {
			baseDir: './_dist/'
		},
		port: 3000,
		notify: false
	}, done);
});

// build > js/css/html/images
gulp.task('build', gulp.series('js', 'sass', 'move-assets', 'output-prod', function(done) {
    done();
}));

// lists usage of gulp --prod and gulp --dev if no --prod or --dev flag is passed
gulp.task('default', gulp.series('build', 'serve', function(done) {

    if (args.prod) {
        log('Site ready for production: ' + config.destination);
    } else if(args.dev) {
		log('Site is now being served by BrowserSync');
	    gulp.watch('_src/**/*', gulp.series('build') );
	}  else {
        log(colors.blue.bold('\n GULP USAGE: \n'),
            colors.red.bold('gulp --prod: '), 'Build release version \n',
            colors.red.bold('gulp --dev : '), 'Build devlopement (test/debug) && launch BrowserSync'
        );
    }
    done();
}));

