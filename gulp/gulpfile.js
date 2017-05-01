var gulp            = require('gulp'),
	sass          	= require('gulp-sass'),
	autoprefixer    = require('gulp-autoprefixer'),
	minifycss       = require('gulp-minify-css'),
	jshint 			= require('gulp-jshint'),
	concat 			= require('gulp-concat'),
	uglify			= require('gulp-uglify'),
	rename			= require('gulp-rename'),
	plumber			= require('gulp-plumber')
	notify			= require('gulp-notify');

var plumberErrorHandler = { 
	errorHandler: notify.onError({
		title: 'Gulp',
		message: 'Error: <%= error.message%>'
	})
};

gulp.task('sass', function() {
	return gulp.src(['../_css/*.scss'])
		.pipe( plumber(plumberErrorHandler) )
		.pipe( sass({
			includePaths: require('node-bourbon').includePaths
		}) )
		.pipe( autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4') )
		.pipe( minifycss() )
		.pipe( rename({ suffix:'.min' }))
		.pipe( gulp.dest('../_css/') )
});

gulp.task('js', function() {
	return gulp.src('../_js/*.js')
		.pipe( plumber(plumberErrorHandler) )
		.pipe( jshint() )
		.pipe( jshint.reporter('default', { verbose: true }) )
		.pipe( concat('./script.js') )
		.pipe( uglify() )
		.pipe( rename({ suffix:'.min' }))
		.pipe( gulp.dest('../_inc/') )
});	

gulp.task('watch', function() {
	gulp.watch('../_css/*.scss', ['sass']);
	gulp.watch('../_js/*.js', ['js']);
});

gulp.task('default', ['sass', 'js']);