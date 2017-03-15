global.log = global.console.log;
const gulp = require('gulp'),
	  uglify = require('gulp-uglify'),
	  concat = require('gulp-concat'),
	  minifyCss = require('gulp-minify-css'),
	  pump = require('pump');

const sources = [
	'sources/jquery-1.1.2.js',
	'sources/doT.js',
	'sources/underscore.js',
	'sources/require.js',
	'sources/requireConfig.js',
	"sources/prime.js"
]

// const path = __dirname + 'sources/';
// for(var i = 0; i < sources.length; i++){
// 	sources[i] = path+sources;
// }



//js任务
gulp.task('jsTask', function() {
	return gulp.src(sources)
		   .pipe(concat("prime.js"))
		   //.pipe(uglify())
		   .pipe(gulp.dest('./'));
  

});


//跑起来
gulp.task('build', ['jsTask'], function(){

})




