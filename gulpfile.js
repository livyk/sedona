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
const webp = require('gulp-webp');

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
    .pipe(gulp.dest('build/css'))
});

gulp.task('minify-css', function () {
  return gulp.src("source/styles/**/*.scss")
  .pipe(plumber({errorHandler: notify.onError(function (err) {
      return {
        title: 'Styles',
        message: err.message
      }
    })}))
  .pipe(sass())
  .pipe(postcss([autoprefixer()]))
  .pipe(minfy())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css'))
})

gulp.task("sprite-svg", function () {
  return gulp.src("source/img/sprite-svg/*.svg")
  .pipe(imagemin([imagemin.svgo({
    plugins: [
      { removeViewBox: false },
      { removeAttrs: { attrs: '(fill|stroke)' } },
    ]
  })]))
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
});

gulp.task("images", function() {
  return gulp.src(["source/img/**/*.{png,jpg,svg}", "!source/img/sprite-svg/*"])
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo({
      plugins: [
        { removeViewBox: false },
      ]
    })
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("favicon", function() {
  return gulp.src("source/favicon/*")
  .pipe(gulp.dest("build"));
});

gulp.task("webp", function() {
  return gulp.src("source/img/**/*.{png,jpg}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"));
});

gulp.task('js', function () {
  return gulp.src("source/js/*.js", { base: 'source' })
  .pipe(gulp.dest("build"))
});

gulp.task('copy', function () {
  return gulp.src([
    "source/fonts/*.{woff,woff2}",
    "source/*.html",
    "source/favicon/*"
  ], { base: 'source' })
  .pipe(gulp.dest("build"));
});

gulp.task('watch', function () {
  gulp.watch("source/styles/**/*.scss", gulp.series('styles'));
  gulp.watch(["source/img/**/*.{png,jpg,svg}", "!source/img/sprite-svg/*"], gulp.series('images'));
  gulp.watch("source/img/**/*.{png, jpg}", gulp.series('webp'));
  gulp.watch("source/img/sprite-svg/*.svg", gulp.series('sprite-svg'));
  gulp.watch("source/js/*.js", gulp.series('js'));
  gulp.watch(["source/fonts/**/*.{woff, woff2}", "source/*.html"], gulp.series('copy'))
});

gulp.task("connect", function () {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
  browserSync.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task("build", gulp.series("clean", gulp.parallel("styles", "webp", "images", "js", "sprite-svg", "copy", "favicon")));
gulp.task("serve", gulp.parallel("connect", "watch"));
