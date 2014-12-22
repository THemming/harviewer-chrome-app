var gulp = require('gulp');
var zip = require('gulp-zip');
var exec = require('child_process').exec;
var del = require('del');
var Q = require('q');

gulp.task('package', ['build'], function (done) {
    gulp.src('target/app/**')
        .pipe(zip('harviewer.zip'))
        .pipe(gulp.dest('target'))
        .on('end', function () {
            done();
        });
});

gulp.task('build-harviewer', ['clean-harviewer'], function (done) {
    exec('bash ../../requirejs/build/build.sh app.build.js', {
        cwd: 'harviewer/webapp/scripts'
    }, function (err, stdout, stderr) {
        console.error(stderr);
        done();
    });
});

gulp.task('clean', ['clean-harviewer', 'clean-chrome-app']);

gulp.task('clean-harviewer', function (done) {
    del('harviewer/webapp-build', function () {
        done();
    });
});

gulp.task('clean-chrome-app', function (done) {
    del(['target'], function () {
        done();
    });
});

gulp.task('build', ['clean-chrome-app', 'build-harviewer'], function () {
    var chromeAppDeferred = Q.defer();
    gulp.src('chrome-app/**')
        .pipe(gulp.dest('target/app'))
        .on('end', function () {
            chromeAppDeferred.resolve();
        });

    var harviewerDeferred = Q.defer();
    gulp.src('harviewer/webapp-build/**')
        .pipe(gulp.dest('target/app/harviewer'))
        .on('end', function () {
            harviewerDeferred.resolve();
        });

    return Q.allSettled([
        chromeAppDeferred.promise,
        harviewerDeferred.promise
    ]);
});
