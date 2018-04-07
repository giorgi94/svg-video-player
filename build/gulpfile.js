var path = require('path');
// var make_hash = require('./hashmaker');

var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload');

var imagemin = require('gulp-imagemin'),
    fontmin = require('gulp-fontmin'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify');


var pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    coffee = require('gulp-coffee');


var PATH = path.join(__dirname, '..')
var NODE_ENV = process.env.NODE_ENV || 'development';


var isdev = NODE_ENV === 'development';

var use_sourcemaps = true,
    use_connect = true,
    use_uglify = true,
    use_babel = true;

// var hash = isdev ? '' : '-' + make_hash(20, 'gulp');
var hash = ""

var abspath = (p) => {
    if(typeof p === 'string') {
        return path.join(PATH, p);
    }
    return p.map((val)=>path.join(PATH, val));
}


// Minify

gulp.task('minify/img', () => {
    gulp.src(abspath('assets/img/**/*'))
        .pipe(imagemin())
        .pipe(gulpif(isdev,
            gulp.dest(abspath('dist/img')),
            gulp.dest(abspath('static/img'))
        ));
});

gulp.task('minify/fonts', () => {
    gulp.src(abspath('assets/fonts/**/*'))
        .pipe(imagemin())
        .pipe(gulpif(isdev,
            gulp.dest(abspath('dist/fonts')),
            gulp.dest(abspath('static/fonts'))
        ));
});

// Pug -> Html

gulp.task('pug', () => {
    gulp.src(abspath('pug/index.pug'))
        .pipe(pug({
            pretty:true
        }).on('error', console.log))
        .pipe(gulp.dest(abspath('dist')))
        .pipe(gulpif(use_connect, connect.reload()));
});

// Styles

gulp.task('sass', () => {
    gulp.src(abspath('assets/video.sass'))
        .pipe(rename({
            suffix: hash
        }))
        .pipe(gulpif(use_sourcemaps, sourcemaps.init()))
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', console.log))
        .pipe(gulpif(use_sourcemaps, sourcemaps.write()))
        .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 7'))
        .pipe(gulp.dest(abspath('dist/static')))
        .pipe(gulpif(use_connect, connect.reload()));
});

// Scripts

gulp.task('coffee', () => {
    gulp.src(abspath('coffee/video.coffee'))
        .pipe(gulpif(use_sourcemaps, sourcemaps.init()))
        .pipe(coffee().on('error', console.log))
        // .pipe(gulpif(use_babel, babel()))
        // .pipe(gulpif(use_uglify, uglify()))
        .pipe(gulpif(use_sourcemaps, sourcemaps.write()))
        .pipe(gulp.dest(abspath('dist/static')))
        .pipe(gulpif(use_connect, connect.reload()));
});

// Server

gulp.task('build', ['pug', 'sass', 'coffee'])
gulp.task('minify', ['minify/img', 'minify/fonts'])

gulp.task('connect', ()=>{
    connect.server({
        root: abspath([
            'dist',
        ]),
        port: 8080,
        livereload: true,
    })
})



gulp.task('watch', ()=>{
    gulp.watch(abspath('pug/*.pug'), ['pug'])
    gulp.watch(abspath('assets/*.sass'), ['sass'])
    gulp.watch(abspath('coffee/*.coffee'), ['coffee'])
})



gulp.task('default', ['connect', 'watch'])
