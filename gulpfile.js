const gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  browserify = require('browserify'),
  through = require('through2'),
  clean = require('gulp-clean'),
  del = require('del'),
  minst = require('minimist'),
  gulpif = require('gulp-if'),
  ts = require('gulp-typescript'),
  tsp = ts.createProject('tsconfig.json', { outDir: 'lib/' }),
  typedoc = require('gulp-typedoc'),
  ghPages = require('gulp-gh-pages');

const remove = function (paths) {
  return del(paths || [
    'lib/src/',
  ]);
};

/**
 * Removes directories
 */
gulp.task('remove:lib', () => {
  return remove(['lib/*.js']);
});

gulp.task('remove:lib.src', ['copy:lib.src'], () => {
  return remove();
})
/**
 * Copy the compiled javascript sources
 */
gulp.task('copy:src', () => {
  return gulp.src('src/*.js')
    .pipe(gulp.dest('lib/'));
});

gulp.task('copy:lib.src', ['compile'], () => {
  return gulp.src('lib/src/*.js')
    .pipe(gulp.dest('lib/'))
})
/**
 * Clean up
 */
gulp.task('clean', ['copy'], () => {
  return gulp.src('src/*.js')
    .pipe(clean());
});
/**
 * Compile the source
 */
gulp.task('compile', () => {
  return tsp.src()
    .pipe(ts(ts(tsp)))
    .js
    .pipe(gulp.dest('lib/'));
});
/**
 * Compile the javascript source for the web
 */
gulp.task('browserify', ['remove:lib.src'], () => {
  return gulp.src('./index.js')
    .pipe(through.obj((file, enc, next) => browserify(file.path)
      .bundle((error, result) => { file.contents = result; next(null, file); })))
    .pipe(gulp.dest('./dist'));
});
/**
 * Test the source
 */
gulp.task('test', () => {
  return gulp.src('tests/*.js', { read: false })
    .pipe(mocha({ reporter: 'spec' }));
});
/**
 * Create the documenation
 */
gulp.task("typedoc", ['browserify'], function () {
  return gulp
    .src(["src/**/*.ts"])
    .pipe(typedoc({
      module: "commonjs",
      target: "es5",
      out: "documenation/",
      name: "tomo"
    }));
});
/**
 * Publish the documenation
 */
gulp.task('ghpages', ['typedoc'], function() {
  return gulp.src('./documenation/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['pre-build']);
gulp.task('pre-build', ['compile', 'copy:lib.src', 'remove:lib.src', 'browserify']);
gulp.task('build', ['build', 'typedoc', 'ghpages']);