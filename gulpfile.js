"use strict";
const gulp = require('gulp');
const prefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cssmin = require('gulp-minify-css');
const include = require('gulp-include');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const scssGlob = require('gulp-sass-glob');
const svgSprite = require('gulp-svg-sprite');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const yargs = require('yargs');
const hideBin = require('yargs/helpers').hideBin;
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const concat = require('gulp-concat');

const argv = yargs(hideBin(process.argv)).argv;
const isDevelopment = argv.dev == 1 ? 'development' : 'production';
const webpackConfig = {
    output: {
      filename: 'main.js',
    },
    mode: isDevelopment,
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
           })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: [{
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime']
            }
        }],
        },
      ],
    },
  };

const settings = {
    prefixer: ['last 3 versions'],
    in_path: './app',
    out_path: './www'
};

const path = {
    build: {
        js: settings.out_path + '/js/',
        css: settings.out_path + '/',
        fonts: settings.out_path + '/fonts/',
        svg: settings.out_path + '/images/svg/'
    },
    src: {     
        js: settings.in_path + '/js/**/*.js', 
        style: settings.in_path + '/scss/**/*.scss',
        fonts: settings.in_path + '/fonts/**/*.{woff,woff2}',
        svg: settings.in_path + '/svg/*.svg'
    }
};


const css = () => {
    return gulp.src(path.src.style)
        .pipe(include())
        .pipe(plumber({
            errorHandler: (err) => {
                notify.onError({
                    title: "Ошибка в CSS",
                    message: "<%= error.message %>"
                })(err);
            }
        }))
        .pipe(scssGlob())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer({
            browsers: settings.prefixer
        }))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
};

const js = () => {
    return gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(plumber({
            errorHandler: (err) => {
            notify.onError({
                title: "Ошибка в JS",
                message: "<%= error.message %>"
            })(err);
            }
        }))
        .pipe(gulp.dest(path.build.js));
}

const svg = () => {
    return gulp.src(path.src.svg)
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            },
        }
    ))
    .pipe(gulp.dest(path.build.svg));
}

const fonts = () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
}


const watchFiles = () => {
    gulp.watch(path.src.style, css);
    gulp.watch(path.src.js, js);
    gulp.watch(path.src.svg, svg);
    gulp.watch(path.src.fonts, fonts);
}

exports.build = gulp.series(
    gulp.parallel([css, js, svg, fonts])    
);

exports.default = gulp.series(
    gulp.parallel([css, js, svg, fonts]),
    gulp.parallel(watchFiles)
);
