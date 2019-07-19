const gulp = require('gulp');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
var concatCss = require('gulp-concat-css');

const conf = require('../conf/gulp.conf');

gulp.task('styles', styles);

var sassPaths = [conf.path.src('/styles/index.scss'), conf.path.src('/app/directives/**/*.scss')]
function styles() {
  return gulp.src(sassPaths)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'})).on('error', conf.errorHandler('Sass'))
    .pipe(concatCss('index.css'))
    .pipe(postcss([autoprefixer()])).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.path.tmp()))
    .pipe(browserSync.stream());
}
