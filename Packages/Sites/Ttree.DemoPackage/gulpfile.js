var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
  ' */\n',
  ''
].join('');

// Compile SASS files from /sass into /css
gulp.task('sass', function () {
  return gulp.src('Resources/Private/Styles/agency.scss')
    .pipe(sass())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('Resources/Public/Styles'))
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function () {
  return gulp.src('Resources/Public/Styles/agency.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('Resources/Public/Styles/'))
});

// Minify JS
gulp.task('minify-js', function () {
  return gulp.src('Resources/Public/JavaScript/agency.js')
    .pipe(uglify())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('js'))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function () {
  gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
    .pipe(gulp.dest('Resources/Public/JavaScript/Vendor/Bootstrap'));

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('Resources/Public/JavaScript/Vendor/Jquery'));

  gulp.src([
    'node_modules/font-awesome/**',
    '!node_modules/font-awesome/**/*.map',
    '!node_modules/font-awesome/.npmignore',
    '!node_modules/font-awesome/*.txt',
    '!node_modules/font-awesome/*.md',
    '!node_modules/font-awesome/*.json'
  ])
    .pipe(gulp.dest('Resources/Public/JavaScript/Vendor/FontAwesome'))
})

// Run everything
gulp.task('default', ['sass', 'minify-css', 'minify-js', 'copy']);

// Dev task
gulp.task('dev', ['sass', 'minify-css', 'minify-js'], function () {
  gulp.watch('Resources/Private/Styles/*.scss', ['sass']);
  gulp.watch('Resources/Public/Styles/*.css', ['minify-css']);
  gulp.watch('Resources/Public/JavaScript/*.js', ['minify-js']);
});

