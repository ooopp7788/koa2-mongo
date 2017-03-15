(function () {
	var gulp = require('gulp');
	var plumber = require('gulp-plumber');
	var stylus = require('gulp-stylus');
	var concat = require('gulp-concat');
	var uglify = require('gulp-uglify');
	var util = require('gulp-util');
	var rename = require("gulp-rename");
	var imagemin = require('gulp-imagemin')
	var clean = require('gulp-clean');
	var watch = require('gulp-watch');
	var pump = require('pump');


	gulp.task('clean', function () {
		gulp.src('./public/dist', {read: false})
			.pipe(clean());
	});


	//处理stylus
	gulp.task('stylus', ['font'], function () {
		gulp.src(['./public/static/css/**/*.styl'])
			.pipe(plumber())
			.pipe(stylus({
				compress: true
			}))
			.pipe(rename(function (path) {
				path.basename += ".min";
			}))
			.pipe(gulp.dest('./public/dist/css'));

		//开发环境编译
		gulp.src(['./public/static/css/**/*.styl'])
			.pipe(plumber())
			.pipe(stylus({
				compress: true
			}))
			.pipe(gulp.dest('./public/static/css'));
	});

	//watch stylus
	gulp.task('watch', function () {
		watch('./public/static/css/**/*.styl', function () {
			gulp.src(['./public/static/css/**/*.styl']).pipe(stylus({
				compress: true
			})).pipe(gulp.dest('./public/static/css'));
		});
	});

	// //打包js
	// gulp.task('js', function () {
	// 	//合并常用库文件
	// 	pump([
	// 		gulp.src([
	// 			'./public/static/js/lib/jquery.1.11.1.min.js',
	// 			'./public/static/js/plugin/jquery.cookie.js',
	// 			'./public/static/js/plugin/jquery.md5.js',
	// 			'./public/static/js/plugin/jquery.easing.js',
	// 			'./public/static/js/plugin/jquery.transit.min.js',
	// 			'./public/static/js/plugin/jquery.lazyload.min.js',
	// 			'./public/static/js/plugin/jquery.xdomainrequest.min.js',
	// 			'./public/static/js/plugin/store.min.js',
	// 			'./public/static/js/plugin/ZeroClipboard.min.js'
	// 		]),
	// 		uglify(),
	// 		concat('library.min.js'),
	// 		gulp.dest('./public/dist/js')
	// 	]);

	// 	//合并公共文件
	// 	pump([
	// 		gulp.src(['./public/static/js/core.js', './public/static/js/ready.js']),
	// 		uglify(),
	// 		concat('main.min.js'),
	// 		gulp.dest('./public/dist/js')
	// 	]);

	// 	//压缩其余文件
	// 	pump([
	// 		gulp.src(['./public/static/js/**/*.js']),
	// 		uglify(),
	// 		rename(function (path) {
	// 			if (path.basename.search(/\.min/) == -1) {
	// 				path.basename += ".min";
	// 			}
	// 		}),
	// 		gulp.dest('./public/dist/js')
	// 	])
	// });


	//压缩图片
	gulp.task('images', function () {
		gulp.src('./public/static/img/**/*.*')
			.pipe(imagemin({
				optimizationLevel: 5,
				progressive: true
			}))
			.pipe(gulp.dest('./public/dist/img'))
	});

	//xml
	gulp.task('xml', function () {
		gulp.src('./public/static/xml/*.xml', {base: './public/static'})
			.pipe(gulp.dest('./public/dist/'));
	});

	//字体文件
	gulp.task('font', function () {
		gulp.src('./public/static/font/*.*', {base: './public/static'})
			.pipe(gulp.dest('./public/dist/'));
	});
	//flash
	gulp.task('flash', function () {
		gulp.src('./public/static/flash/*.*', {base: './public/static'})
			.pipe(gulp.dest('./public/dist/'));
	});

	gulp.task('build', ['stylus', 'js', 'images', 'xml', 'flash'], function () {
		//return gulp.run('clean');
	});

})();
