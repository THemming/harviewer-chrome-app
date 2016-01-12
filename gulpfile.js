const gulp = require('gulp');
const zip = require('gulp-zip');
const exec = require('child_process').exec;
const del = require('del');

gulp.task('package', ['build'], done => {
    gulp.src('target/app/**')
        .pipe(zip('harviewer.zip'))
        .pipe(gulp.dest('target'))
        .on('end', done);
});

gulp.task('build-harviewer', ['clean-harviewer'], done => {
    exec('npm i', {
        cwd: 'harviewer'
    }, (err, stdout, stderr) => {
        console.error(stderr);
        exec('node ../../node_modules/.bin/r.js -o app.build.js', {
            cwd: 'harviewer/webapp/scripts'
        }, (err, stdout, stderr) => {
            console.error(stderr);
            done();
        });
    });
});

gulp.task('clean', ['clean-harviewer', 'clean-chrome-app']);

gulp.task('clean-harviewer', done => {
    del('harviewer/target', done);
});

gulp.task('clean-chrome-app', done => {
    del(['target'], done);
});

gulp.task('build', ['clean-chrome-app', 'build-harviewer'], () => {
    const chromeApp = new Promise(resolve => {
        gulp.src('chrome-app/**')
            .pipe(gulp.dest('target/app'))
            .on('end', resolve);
    });

    const harviewer = new Promise(resolve => {
        gulp.src('harviewer/target/**')
            .pipe(gulp.dest('target/app/harviewer'))
            .on('end', resolve);
    });

    return Promise.all([chromeApp, harviewer]);
});
