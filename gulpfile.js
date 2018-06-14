const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const minfy = require('gulp-csso');
const rename = require('gulp-rename');
const svgstore = require('gulp-svgstore');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');
const notify = require('gulp-notify');

gulp.task('clean', function () {
  return del('build');
});

gulp.task('styles', function () {
  return gulp.src("source/styles/**/*.scss")
    .pipe(plumber({errorHandler: notify.onError(function (err) {
        return {
          title: 'Styles',
          message: err.message
        }
      })}))
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('build/css'))
    .pipe(minfy())
    .pipe(rename('style.min.css'))
});

gulp.task("sprite", function () {
  return gulp.src("source/img/icon-*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
});

gulp.task("images", function() {
  return gulp.src("source/img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task('svg', function () {
  return gulp.src("source/img/*.svg", {base: 'source'})
  .pipe(gulp.dest("build"));
});

gulp.task('copy', function () {
  return gulp.src([
    "source/fonts/*.{woff,woff2}",
    "source/*.html"
  ], {base: 'source'})
  .pipe(gulp.dest("build"));
});

gulp.task('watch', function () {
  gulp.watch("source/styles/**/*.scss", gulp.series('styles'));
  gulp.watch("source/img/**/*.{png,jpg,gif}", gulp.series('images'));
  gulp.watch("source/img/icon-*.svg", gulp.series('svg'));
  gulp.watch(["source/fonts/**/*.{woff, woff2}", "source/*.html", 'source/img/*.svg'], gulp.series('copy'))
});

gulp.task("connect", function () {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
  browserSync.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task("build", gulp.series("clean", "styles", "svg", "images", "copy"));
gulp.task("serve", gulp.series("build", gulp.parallel("connect", "watch")));
