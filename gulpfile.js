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
    runSequence     = require('run-sequence'),
    run             = require('gulp-run'),
    browserSync     = require('browser-sync').create();

var fs          = require('fs');
var minify      = composer(uglify, console);
var log         = util.log;
var colors      = util.colors;

var plumberErrorHandler = { 
	errorHandler: notify.onError({
		title: 'Gulp',
		message: 'Error: <%= error.message%>'
	})
};

// bourbon > prefix > minify > rename > distribute
gulp.task('sass', function(cb) {
    var isProd = args.prod;

    pump([
        gulp.src(config.sourceFiles.scss),
        sass({
			includePaths: require('node-bourbon').includePaths
		}),
		autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'),
		gulpIf(isProd, minifycss()),
		rename({ suffix:'.min' }),
		gulp.dest( config.destination + '_css/')
    ], cb);
});

// es v6 > jshint > minify > rename > distribute
gulp.task('js', function (cb) {
    var isProd = args.prod;

    pump([
        gulp.src(config.sourceFiles.js),
        plumber(plumberErrorHandler),
        jshint({esversion: 6}),
        jshint.reporter('default', { verbose: true }),
        gulpIf(isProd, minify()),
        rename({ suffix:'.min' }),
        gulpIf(isProd, removeLogging({ namespace: ['console', 'window.console'] })),
        gulp.dest(config.destination + '_js/')
    ], cb);

});

// watch & compile all files > build
gulp.task('watch', function() {
	gulp.watch('./_src/**/*', ['build']);

});


// build > js/css/html/images
// run: `gulp --deploy` for production release
gulp.task('build', ['js', 'sass'], function() {

    var isProd      = args.prod;
    var sourceFiles = [
      config.sourceFiles.html,
      config.sourceFiles.json
    ];
    var htmlFilter = filter('**/*.html', {restore: true});

    // for assets folder
    pump([
      gulp.src(config.sourceFiles.img),
      gulp.dest(config.destination + '_assets')
    ])

    // if --prod flag is passed then minify html and remove code
    pump([
        gulp.src(sourceFiles),
        gulpIf(isProd, htmlFilter),
        gulpIf(isProd, htmlmin({collapseWhitespace: true})),
        gulpIf(isProd, htmlFilter.restore),
        gulp.dest(config.destination),
    ], function(err) {
        if (typeof err === 'undefined' && browserSync.active) {
            browserSync.reload();
        }
    });
});

// lists usage of gulp --prod and gulp --dev if no --prod or --dev flag is passed
gulp.task('default', function() {

    if (args.prod) {
        runSequence('build', 'watch');
        log('Site ready for production: ' + config.destination);
    } else if(args.dev) {
        startBrowserSync();
        runSequence('build', 'watch');
    } else {
        log(colors.blue.bold('\n USAGE: \n'),
            colors.red.bold('gulp --prod: '), 'Build release version of the PxS UI for customers to use \n',
            colors.red.bold('gulp --dev : '), 'Build devlopement (test/debug) version of the PxS UI'
        );
    }
});

// Helper functions
function startBrowserSync() {
    browserSync.init({
      server: {
        baseDir: "./_dist/"
      }
    });
}
