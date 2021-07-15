/*
 * GULP CONFIG
 *
 * Desciption:  Clean gulpfile for web development workflow containing
 *              - compiling/optimization of sass, javascript and images from assets to dist and vendors
 *              - browsersync
 *              - cache-busting
 *              - modernizr
 *              - vendor handling through glulp-vendors.json
 *
 * Usage:       - `gulp` (to run the whole process)
 *              - `gulp watch` (to watch for changes and compile if anything is being modified)
 *              - `modernizr -c assets/scripts/modernizr-config.json -d assets/scripts` to generate the modernizr.js file from the config-file
 *              - add vendor-requirements to gulp-vendors.json, they will be compiled/bundled by `gulp` (restart `gulp watch`)
 *
 * Author:      David Voglgsang
 *
 * Version:     1.0
 *
*/


/* SETTINGS
/===================================================== */
// local domain used by browsersync
var browsersync_proxy = "development.vm";

// default asset paths
var assets = {
  css: ['assets/styles/frontend.scss'],
  css_watch: ['assets/styles/*.scss'],
  javascript: ['assets/scripts/*.js'],
  images: ['assets/images/*.*'],
  fonts: ['assets/fonts/*.*'],
  backend_css: ['assets/styles/backend/style.scss'],
  backend_javascript: ['assets/scripts/backend/scripts.js']
}

// vendors are loaded from gulp-vendors.json
var vendors = require('./gulp-vendors.json');


/* DEPENDENCIES
/===================================================== */
// general
const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
const order = require("gulp-order");
const browserSync = require('browser-sync').create();
// css
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
// cache busting
const rev = require('gulp-rev');
// js
const uglify = require('gulp-uglify');
// images
const imagemin = require('gulp-imagemin');
// error handling with notify & plumber
const notify = require("gulp-notify");
const plumber = require('gulp-plumber');
// watch
const watch = require('gulp-watch');
// delete
const del = require('del');


/* TASKS
/===================================================== */

/* CLEAN
/––––––––––––––––––––––––*/
// delete compiled files/folders (before running the build)
// css
gulp.task('clean:css', function() { return del(['dist/*.css', 'dist/rev-manifest.json'])});
gulp.task('clean:cachebust', function() { return del(['dist/style-*.min.css'])});
gulp.task('clean:javascript', function() { return del(['dist/*.js'])});
gulp.task('clean:images', function() { return del(['dist/images'])});
gulp.task('clean:fonts', function() { return del(['dist/fonts'])});
gulp.task('clean:backend_css', function() { return del(['dist/style_backend.min.css'])});
gulp.task('clean:backend_javascript', function() { return del(['dist/script_backend.min.js'])});

/* BROWSERSYNC
/––––––––––––––––––––––––*/
// initialize Browser Sync
gulp.task('browsersync', function() {
  browserSync.init({
    proxy: browsersync_proxy,
    notify: false,
    open: false,
    snippetOptions: {
      whitelist: ['/wp-admin/admin-ajax.php'],
      blacklist: ['/wp-admin/**']
    }
  });
});


/* CSS
/––––––––––––––––––––––––*/
// from:    assets/styles/main.css
// actions: compile, minify, prefix, rename
// to:      dist/style.min.css
gulp.task('css', gulp.series('clean:css', function() {
  return gulp
    .src(assets['css'].concat(vendors['css']))
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(concat('style.min.css'))
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', { cascade: false }))
    .pipe(cleanCSS())
    .pipe(rename('dist/style.min.css'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
}));
// BACKEND FILE
gulp.task('backend_css', gulp.series('clean:backend_css', function() {
  return gulp
    .src(assets['backend_css'])
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(concat('style_backend.min.css'))
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', { cascade: false }))
    .pipe(cleanCSS())
    .pipe(rename('dist/style_backend.min.css'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
}));


/* CSS CACHE BUSTING
/––––––––––––––––––––––––*/
// from:    dist/style.min.css
// actions: create busted version of file
// to:      dist/style-[hash].min.css
gulp.task('cachebust', gulp.series('clean:cachebust', 'css', function() {
  return gulp
    .src('dist/style.min.css')
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest({merge: true}))
    .pipe(gulp.dest('dist'))
}));


/* JAVASCRIPT
/––––––––––––––––––––––––*/
// from:    assets/scripts/
// actions: concatinate, minify, rename
// to:      dist/script.min.css
// note:    modernizr.js is concatinated first in .pipe(order)
gulp.task('javascript', gulp.series('clean:javascript', function() {
  return gulp
    .src(assets['javascript'].concat(vendors['javascript']))
    .pipe(order([
      'assets/scripts/*.js'
    ], { base: './' }))
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(concat('script.min.js'))
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(uglify())
    .pipe(rename('dist/script.min.js'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
}));
// BACKEND FILE
gulp.task('backend_javascript', gulp.series('clean:backend_javascript', function() {
  return gulp
    .src(assets['backend_javascript'])
    .pipe(order([
      'assets/scripts/backend/*.js'
    ], { base: './' }))
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(concat('script_backend.min.js'))
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(uglify())
    .pipe(rename('dist/script_backend.min.js'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
}));


/* IMAGES
/––––––––––––––––––––––––*/
// from:    assets/images/
// actions: minify
// to:      dist/images
gulp.task('images', gulp.series('clean:images', function() {
  return gulp
    .src(assets['images'].concat(vendors['images']))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
}));


/* FONTS
/––––––––––––––––––––––––*/
// from:    assets/fonts/
// actions: move (no processing at all, just keeping stuff in place)
// to:      dist/fonts/
gulp.task('fonts', gulp.series('clean:fonts', function() {
  return gulp
    .src(assets['fonts'])
    .pipe(gulp.dest('dist/fonts'))
}));


/* WATCH
/––––––––––––––––––––––––*/
// watch for modifications in
// styles, scripts, images, php files, html files
gulp.task('watch', gulp.parallel('browsersync', function() {
  watch(assets['css_watch'], gulp.series('css', 'cachebust'));
  watch(assets['javascript'], gulp.series('javascript'));
  watch(assets['images'], gulp.series('images'));
  watch(assets['fonts'], gulp.series('fonts'));
  watch(assets['backend_css'], gulp.series('backend_css'));
  watch(assets['backend_javascript'], gulp.series('backend_javascript'));
  watch('*.php', browserSync.reload);
  watch('*.html', browserSync.reload);
}));



/* DEFAULT
/––––––––––––––––––––––––*/
// default gulp tasks executed with `gulp`
gulp.task('default', gulp.series('css', 'cachebust', 'javascript', 'images', 'fonts', 'backend_css', 'backend_javascript'));
