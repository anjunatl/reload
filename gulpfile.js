var gulp = require('gulp');

var concat = require('gulp-concat');
var gulpSequence = require('gulp-sequence');
var jshint = require('gulp-jshint');
var Server = require('karma').Server;
var uglify = require('gulp-uglify');


var js = [
  'src/reload.js',
  'src/*.js'
];
var dist = 'dist/';
var tests = 'tests/';
var examples = 'examples/';

gulp.task('build:prod', function() {
  return gulp.src(js)
    .pipe(concat('reload.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist));
});

gulp.task('build:dev', function() {
  return gulp.src(js)
    .pipe(concat('reload.js'))
    .pipe(gulp.dest(dist));
});

gulp.task('lint', function() {
  return gulp.src(js)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('test:run', function() {
  new Server({
    configFile: __dirname + "/" + tests + 'config/karma.conf.js',
    singleRun: true
  }).start();
});

gulp.task('default', ['lint', 'build:prod']);
gulp.task('test', gulpSequence('lint', 'build:prod', 'test:run'));