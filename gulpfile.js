'use strict';

const {src, dest} = require('gulp');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const removeComments = require('gulp-strip-css-comments');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const nano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const rigger = require('gulp-rigger');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const beautify = require('gulp-cssbeautify');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();

const path = {
    build: {
        html: 'dist/',
        css: 'dist/css/',
        js: 'dist/js/',
        images: 'dist/images/',
        icons: 'dist/icons/',
        fonts: 'dist/fonts/'
    },
    src: {
        html: 'src/**/*.html',
        css: 'src/scss/**/*.scss',
        js: 'src/js/**/*.js',
        images: 'src/images/**/*.{jpg, jpeg, png, svg, gif, ico, webp, webmanifest, xml, json}',
        icons: 'src/icons/**/*',
        fonts: 'src/fonts/**/*.{eot, ttf, woff, woff2, svg}'
    },
    watch: {
        html: 'src/**/*.html',
        css: 'src/scss/**/*.scss',
        js: 'src/js/**/*.js',
        images: 'src/images/**/*.{jpg, jpeg, png, svg, gif, ico, webp, webmanifest, xml, json}',
        icons: 'src/icons/**/*',
        fonts: 'src/fonts/**/*.{eot, ttf, woff, woff2, svg}'
    },
    clean: './dist/'
}

function server() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        },
        browser: 'google chrome',
    });
}

function html() {
    return src(path.src.html, {base: 'src/'})
        .pipe(plumber())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
          }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({stream: true}));
}

function css() {
    return src(path.src.css, {base: 'src/scss/'})
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: 'Css ERROR',
                    message: 'ERROR <%= error.message %>'
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(beautify())
        .pipe(dest(path.build.css))
        .pipe(nano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({stream: true}));
}

function js() {
    return src(path.src.js, {base: 'src/js/'})
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: 'JavaScript ERROR',
                    message: 'ERROR <%= error.message %>'
                })(err);
                this.emit('end');
            }
        }))
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min',
            extname: '.js'
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));
}

function images() {
    return src(path.src.images, {base: 'src/images/'})
        .pipe(imagemin())
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({stream: true}));
}

function icons() {
    return src(path.src.icons, {base: 'src/icons/'})
        .pipe(dest(path.build.icons))
        .pipe(browserSync.reload({stream: true}));
}

function fonts() {
    return src(path.src.fonts, {base: 'src/fonts/'})
        .pipe(browserSync.reload({stream: true}));
}

function clean() {
    return del(path.clean)
}

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.images], images)
    gulp.watch([path.watch.icons], icons)
    gulp.watch([path.watch.fonts], fonts)
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, icons, fonts))
const watch = gulp.parallel(build, watchFiles, server)

exports.html = html
exports.css = css
exports.js = js
exports.images = images
exports.icons = icons
exports.fonts = fonts
exports.clean = clean
exports.build = build
exports.watch = watch 
exports.default = watch