var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var argv = require('yargs').default('platform_uri', '').default('output_directory', './dist').argv;

// Dev
gulp.task('refresh', function () {
    browserSync.init({
        server: {
            baseDir: './',
            index: 'debug.html',
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        },
        ghostMode: false,
        open: false
    });

    gulp.watch(['build/**/*.*', 'debug.html']).on('change', browserSync.reload);
});

// Dist

gulp.task('dist-loader', function() {
    return gulp.src('js/loader.js')
        .pipe(plugins.uglify())
        .pipe(plugins.rename('loader.min.js'))
        .pipe(gulp.dest(`${argv.output_directory}/js`));
});

gulp.task('dist-html', function () {
    return gulp.src('default.html')
        .pipe(plugins.replace('{{cdnurl}}', argv.cdnurl))
        .pipe(plugins.replace('{{platform_uri}}', argv.platform_uri))
        .pipe(plugins.rename(argv.tenant + '.' + argv.player))
        .pipe(gulp.dest(`${argv.output_directory}/players/`));
});

gulp.task('dist-img', function() {
    return gulp.src('img/*.*')
        .pipe(gulp.dest('./dist/img'));
});

<<<<<<< HEAD
// Test files (they are the same but have different urls and are not gzipped)

gulp.task('test-loader', function() {
    return gulp.src('js/loader.js')
        .pipe(plugins.uglify())
        .pipe(plugins.rename('loader.min.js'))
        .pipe(gulp.dest('./test/js'));
});

gulp.task('test-html', function () {
    return gulp.src('default.html')
        .pipe(plugins.replace('{{cdnurl}}', argv.test_cdnurl))
        .pipe(plugins.replace('{{platform_uri}}', argv.test_platform_uri))
        .pipe(plugins.rename(argv.test_tenant + '.' + argv.player))
        .pipe(gulp.dest('./test/players/'));
});

gulp.task('test-img', function() {
    return gulp.src('img/*.*')
        .pipe(gulp.dest('./test/img'));
});



gulp.task('build-dist', ['dist-loader', 'dist-html', 'dist-img']);
gulp.task('build-test', ['test-loader', 'test-html', 'test-img']);

gulp.task('dist', ['dist-loader', 'dist-html', 'dist-img']);

