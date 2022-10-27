"use strict";
const gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourceMaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    include = require('gulp-include'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    scssGlob = require('gulp-sass-glob'),
    svgSprite = require('gulp-svg-sprite'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    yargs = require('yargs'),
    hideBin = require('yargs/helpers').hideBin,
    VueLoaderPlugin = require('vue-loader').VueLoaderPlugin,
    gulpIf = require('gulp-if'),
    gulpStylelint = require('gulp-stylelint'),
    eslint = require('gulp-eslint'),
    fileinclude = require('gulp-file-include'),
    concat = require('gulp-concat');

const argv = yargs(hideBin(process.argv)).argv;
const mode = argv.dev == 1 ? 'development' : 'production';
const webpackConfig = {
    output: {
        filename: 'main.js',
    },
    mode: mode,
    devtool: (() => (argv.dev === 1 ? 'source-map' : 'nosources-source-map'))(),
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new VueLoaderPlugin()
    ],
    resolve: {
        extensions: ['.js', '.json', '.vue'],
    },
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
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
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
        svg: settings.out_path + '/images/svg/',
        html: 'static/',
        htmlModal: settings.out_path + '/ajax/form/'
    },
    src: {
        js: settings.in_path + '/js/**/*.{js,vue}',
        style: settings.in_path + '/scss/**/*.scss',
        fonts: settings.in_path + '/fonts/**/*.{woff, woff2, ttf, otf}',
        svg: settings.in_path + '/svg/*.svg',
        html: `${settings.in_path}/html/**/*.html`,
        htmlModal: `${settings.in_path}/html/modals/**/*.html`
    }
};


const css = () => {
    return gulp.src(path.src.style)
        .pipe(sourceMaps.init())
        .pipe(include())        
        .pipe(scssGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(prefixer({
            browsers: settings.prefixer
        }))
        .pipe(gulpIf(mode == 'production', cssmin()))
        .pipe(gulpIf(mode == 'development', sourceMaps.write()))
        .pipe(gulp.dest(path.build.css))
};

const scssLint = () => {
    return gulp.src(path.src.style)
    .pipe(gulpStylelint({
        reporters: [
          {formatter: 'string', console: true}
        ]
      }));
}

const js = () => {
    return gulp.src(path.src.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.formatEach('compact', process.stderr))
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

const jsLint = () => {
    return gulp.src([path.src.js, '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

const svg = () => {
    return gulp.src(path.src.svg)
        .pipe(svgSprite({
                svg: {
                    xmlDeclaration: false,
                    doctypeDeclaration: false,
                    namespaceIDs: false,
                    dimensionAttributes: false
                },
                mode: {
                    stack: {
                        sprite: "../sprite.svg"
                    }
                },
            }
        ))
        .pipe(gulp.dest(path.build.svg));
}

const html = () => {
    return gulp.src([
        path.src.html,
        `!${settings.in_path}/html/components/**/*.html`,
        `!${settings.in_path}/html/modals/**/*.html`
    ])
        .pipe(fileinclude({prefix: '@@'}))
        .pipe(gulp.dest(path.build.html))
}

const htmlModal = () => {
    return gulp.src([path.src.htmlModal,])
        .pipe(fileinclude())
        .pipe(gulp.dest(path.build.htmlModal))
}

const fonts = () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
}

const buildTasks = [
    css,
    js,
    svg,
    fonts,
    html,
    htmlModal
];


const watchFiles = () => {
    gulp.watch(path.src.style, css);
    gulp.watch(path.src.js, js);
    gulp.watch(path.src.svg, svg);
    gulp.watch(path.src.fonts, fonts);
    gulp.watch(path.src.html, html);
    gulp.watch(path.src.html, htmlModal);
}

exports.build = gulp.series(
    gulp.parallel(buildTasks)
);

exports.testScss = gulp.series([scssLint]);
exports.testJS = gulp.series([jsLint]);

exports.default =  gulp.series(
    gulp.parallel(buildTasks),
    gulp.parallel(watchFiles)
);
