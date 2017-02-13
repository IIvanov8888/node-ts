var gulp = require('gulp'),
  rename = require('gulp-rename'),
  ts = require('gulp-typescript'),
  pug = require('gulp-pug'),
  del = require('del');


var paths = {
  css: ['./src/client/css/css.css']
};

gulp.task("index", function() {
  return gulp.src('./src/server/*.pug')
    .pipe(gulp.dest('./server'));
});

gulp.task("clean", function() {
  del(['app', 'server']);
});

gulp.task('addfiles', ['index']);

gulp.task('css', function() {
  var local = gulp.src(paths.css)
    .pipe(rename('site.css'))
    .pipe(gulp.dest('./public/css/'));
  //.pipe(gulp.dest('/Users/guyhuinen/Documents/workspace/boardz/trends/static/css'));
  return;
});


var TSServer = ts.createProject('./src/server/tsconfig.json');

gulp.task('TSServer', function() {

  var tsResult = gulp.src(['./src/server/**/*.ts', 'typings/**/*.d.ts'])
    .pipe(ts(TSServer));

  tsResult.dts.pipe(gulp.dest('server'));
  return tsResult.js
    .pipe(gulp.dest("server"));
});

gulp.task('default', ['css', 'index'], function() {
  gulp.watch([
    "./src/server/**/*.*"
  ], ['css']);
});
