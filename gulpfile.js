var gulp = require('gulp'),
browserSync = require('browser-sync').create(),
modRewrite  = require('connect-modrewrite'),
sass = require('gulp-sass'),
uglyfly = require('gulp-uglyfly'),
htmlmin = require('gulp-htmlmin'),
jade = require('gulp-jade'),
autoprefixer = require('gulp-autoprefixer'),
concat = require('gulp-concat'),
concatCss = require('gulp-concat-css');

//serve
gulp.task('serve', function () {
	browserSync.init({
		server: {
			baseDir: "./build",
			middleware: [
                modRewrite([
                   '^[^\\.]*$ /index.html [L]'
            	])
			]
		}
	});
});
//concat-css
gulp.task('concat-css', function () {
  return gulp.src(['./node_modules/normalize.css/normalize.css',
  	'./node_modules/bootstrap/dist/css/bootstrap.min.css'])
    .pipe(concatCss("bundle.css"))
    .pipe(gulp.dest('./src/sass/bundle'));
});
//concat-libs
gulp.task('concat-js', function() {
  return gulp.src(['./node_modules/jquery/jquery.min.js',
  	'./node_modules/bootstrap/dist/js/bootstrap.min.js',
  	'./node_modules/angular/angular.min.js'])
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('./build/lib'));
});
//concat-ctrls
gulp.task('concat-app', function() {
  return gulp.src('./src/**/*.js')
    .pipe(concat('app.js'))
    .pipe(uglyfly())
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
});
//html
gulp.task('html', function () {
	gulp.src('./src/app/**/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('./build/templates'))
	.pipe(browserSync.stream());
});
//main-html
gulp.task('main', function(){
	gulp.src('./src/index.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('./build'))
	.pipe(browserSync.stream());
});
//jade
gulp.task('jade', function(){
	gulp.src('./src/app/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./src/app'))
});
gulp.task('jade-index', function(){
	gulp.src('./src/index.jade')
    .pipe(jade())
    .pipe(gulp.dest('./build'))
});
//sass
gulp.task('sass', function () {
	gulp.src('./src/sass/main.scss')
	.pipe(sass({outputStyle: 'compressed' }).on('error', sass.logError))
	.pipe(autoprefixer('last 5 versions'))
	.pipe(gulp.dest('./build/css'))
	.pipe(browserSync.stream());
});
//watch
gulp.task('watch', function () {
	gulp.watch('./src/index.html',['main']).on('change', browserSync.reload);
	gulp.watch('./src/index.jade',['jade-index']).on('change', browserSync.reload);
	gulp.watch('./src/app/**/**/*.js',['concat-app']).on('change', browserSync.reload);
	gulp.watch('./src/sass/**/*.scss',['sass']).on('change', browserSync.reload);
	gulp.watch('./src/**/**/*.html', ['html']).on('change', browserSync.reload);
});

gulp.task('default',
	['watch',
	'serve',
	'sass',
	'html',
	'main',
	'jade',
	'jade-index',
	'concat-css',
	'concat-js',
	'concat-app']);