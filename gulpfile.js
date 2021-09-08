import gulp from 'gulp';
import prefixer from 'gulp-autoprefixer';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import cssmin from 'gulp-minify-css';
import include from 'gulp-include';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import scssGlob from 'gulp-sass-glob';
import svgSprite from 'gulp-svg-sprite';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';

const webpackConfig = {
    output: {
      filename: 'main.js',
    },
    mode: 'development',
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
    bitrixTemplate: 'main',
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
    src: { //Пути откуда брать исходники        
        style: settings.in_path + '/scss/**/*.scss',
        fonts: settings.in_path + '/fonts/**/*.{woff,woff2}',
        svg: settings.in_path + '/svg/*.svg'
    }
};


export const css = () => {
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

export const js = () => {
    return gulp.src('./app/js/app.js')
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

export const svg = () => {
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

export const fonts = () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
}


export const watchFiles = () => {
    gulp.watch(path.src.style, css);
    gulp.watch('./app/js/app.js', js);
    gulp.watch(path.src.svg, svg);
    gulp.watch(path.src.fonts, fonts);
}

export default gulp.series(
    gulp.parallel([css, js, svg, fonts]),
    gulp.parallel(watchFiles)
);