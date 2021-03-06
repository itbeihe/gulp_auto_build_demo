var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var csso = require('gulp-csso');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var rename = require("gulp-rename");
var imageResize = require('gulp-image-resize');
var less = require('gulp-less');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var cru = require('gulp-css-rework-url');
//var run = require('gulp-run');
var jshint = require('gulp-jshint');

gulp.task('retina',function(){
    return gulp.src('static/source/img/*-2x.{png,jpg}')
        .pipe(imageResize({
            width : '50%',
            height : '50%'
        })).pipe(rename(function(path){
            path.basename = path.basename.replace('-2x','');
        }))
        .pipe(gulp.dest('static/source/img/'));
});

gulp.task('sprite',['retina'],function () {
    // 配置图片优化相关选项
    var spriteData = gulp.src('static/source/img/*.png').pipe(spritesmith({
        retinaSrcFilter: ['static/source/img/*-2x.png'],
        algorithm: 'top-down',
        imgName: 'sprite.png',
        retinaImgName: 'sprite-2x.png',
        cssName: 'sprite.css'
    }));
    // 压缩图片，并输出图片流
    var imgStream = spriteData.img
        .pipe(imagemin())
        .pipe(gulp.dest('static/dist/img/'));
    // 输出css
    var cssStream = spriteData.css
        .pipe(cru({
            prefix:'../../img/'
        }))
        //.pipe(csso())
        .pipe(gulp.dest('static/source/css/common/'));

    return merge(imgStream, cssStream);
});

// 编译less文件为css文件
gulp.task('less',function(){
    return gulp.src('static/source/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('static/source/css/'));
});

// 构建css文件
gulp.task('css',['sprite','less'],function(){
    var commonCss = gulp.src(['static/source/css/common/*.css','static/source/css/lib/*.css'])
        .pipe(concat('main.css'))
        .pipe(gulp.dest('static/dist/css/common/'))
        .pipe(cssmin())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('static/dist/css/common/'));

    var pageCss = gulp.src('static/source/css/page/*.css')
        .pipe(gulp.dest('static/dist/css/page/'))
        .pipe(cssmin())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('static/dist/css/page/'));
    return merge(commonCss, pageCss);
});

// 构建js文件
gulp.task('js',function(){
    var commonJsStream = gulp.src(['static/source/js/lib/*.js','static/source/js/common/*.js'])
        .pipe(concat('common.js'))
        .pipe(gulp.dest('static/dist/js/common/'))
        .pipe(uglify())
        .pipe(rename('common.min.js'))
        .pipe(gulp.dest('static/dist/js/common/'));

    var pageJsStream = gulp.src('static/source/js/page/*.js')
        .pipe(gulp.dest('static/dist/js/page/'))
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('static/dist/js/page/'));

    return merge(commonJsStream, pageJsStream);
});

// 代码检查
gulp.task('lint', function() {
    return gulp.src('static/source/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('zip', function () {
    // git 提取当前版本与上一个版本的差异
    //run('git diff HEAD HEAD~ --name-only| xargs zip update.zip ').exec();
});

gulp.task('build',['css','js']);
gulp.task('default',['build']);

gulp.task('dev',function(){

});