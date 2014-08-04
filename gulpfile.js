var gulp = require('gulp'),
  less = require('gulp-less'),
  concat = require('gulp-concat')

var lessFiles = 'src/main/less/**/*.less'
var isWatch

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
  if (!isWatch) {
    throw err
  }
}

gulp.task('less', function () {
  gulp.src(lessFiles)
    .pipe(less().on('error', handleError))
    .pipe(concat('oppija-raamit.css'))
    .pipe(gulp.dest('src/main/webapp/oppija-raamit/css'))
});

gulp.task('watch', function() {
  isWatch = true
  gulp.watch([lessFiles],['less'])
});

gulp.task('compile', ['less'])
gulp.task('dev', ['compile', 'watch'])
gulp.task('default', ['dev'])