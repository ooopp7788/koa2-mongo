global.log = global.console.log;
const gulp = require('gulp'),
	  uglify = require('gulp-uglify'),
	  concat = require('gulp-concat'),
	  minifyCss = require('gulp-minify-css'),
	  rev = require('gulp-rev'),
	  pump = require('pump');
//自定义
const config = require('./config/gulpConfig');





//js任务 打包库级别文件
gulp.task('jsLibTask', function() {
	const sources = [
		'./src/js/prime/sources/jquery-1.1.2.js',
		'./src/js/prime/sources/doT.js',
		'./src/js/prime/sources/underscore.js',
		'./src/js/prime/sources/require.js',
		'./src/js/prime/sources/requireConfig.js',
		'./src/js/prime/sources/prime.js',
	]

	//默认返回是xxx-md5.js, 更改gulp-rev中的rev-path modules的index.js第11行，默认就为xxx_md5.js
	return gulp.src(sources)
		   .pipe(concat("prime.js"))
		   .pipe(uglify())
		   //.pipe(rev())
		   .pipe(gulp.dest('./src/js/prime/'))
		   //.pipe(rev.manifest())
		   .pipe(gulp.dest('./'));
});

gulp.task('pageJsTask', function(){
	return gulp.src(sources)
		.pipe(rev())
		.pipe(gulp.dest('./src/js/project/'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('./'));
})
//
//gulp.task('cssLibTask', function(){
//	const sources = [
//		'./style/common/common.css',
//		'./style/common/normalize.css',
//		'./style/common/prime.css'
//	]
//	return gulp.src(sources)
//		.pipe(concat("prime.css"))
//		.pipe(minifyCss())
//		.pipe(rev())
//		.pipe(gulp.dest('./style/common/'))
//		.pipe(rev.manifest())
//		.pipe(gulp.dest('./'));
//})




gulp.task('build', ['jsLibTask'], function(){

})




