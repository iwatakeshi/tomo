var gulp   = require('gulp'),
    clean  = require('gulp-clean'),
    del    = require('del'),
    minst  = require('minimist'),
    gulpif = require('gulp-if'),
    ts     = require('gulp-typescript'),
    tsp    = ts.createProject('tsconfig.json', {outDir:'lib/'});
    
const remove = function(paths){
  return del(paths || [
    'lib/src/',
  ]);
};

/**
 * Removes directories
 */
gulp.task('remove:lib',function(){
  return remove(['lib/*.js']);
});

gulp.task('remove:lib.src',['copy:lib.src'], function() {
  return remove();
})

gulp.task('copy:src', function () {
  return gulp.src('src/*.js')
    .pipe(gulp.dest('lib/'));
});

gulp.task('copy:lib.src', ['compile'], function(){
  return gulp.src('lib/src/*.js')
  .pipe(gulp.dest('lib/'))
})

gulp.task('clean', ['copy'], function(){
  return gulp.src('src/*.js')
    .pipe(clean());
});

gulp.task('compile', function() {
  return tsp.src()
    .pipe(ts(ts(tsp)))
    .js
    .pipe(gulp.dest('lib/'));
});

gulp.task('default', ['build']);

gulp.task('build', ['compile', 'copy:lib.src', 'remove:lib.src']);