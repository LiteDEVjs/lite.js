//GULP Modules
const {src, dest, watch, parallel, series} = require('gulp')
const scss = require('gulp-sass')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify-es').default
const autoprefixer = require('gulp-autoprefixer')
const image = require('gulp-imagemin')
const del = require('del')
const fileinclude = require('gulp-file-include')
//Main LiteBox Modules
const settings = require('./litebox/config/settings.js')
//Settings Path
const settingsPath = settings.path

function html(){
   return src(_routesBuild(settingsPath.routesPath))
      .pipe(fileinclude())
      .pipe(dest(`${settingsPath.mainSourceRoot}/`))
      .pipe(browserSync.stream())
}

function styles(){
   return src(`${settingsPath.mainSourceRoot}/${settingsPath.mainIndexRoot}/styles.scss`)
      .pipe(scss({
         outputStyle: 'compressed'
      }))
      .pipe(concat('style.min.css'))
      .pipe(autoprefixer({
         overrideBrowserslist:[
            'last 10 version'
         ],
         grid: true
      }))
      .pipe(dest(`${settingsPath.mainSourceRoot}/${settingsPath.assetsRoot}/css/`))
      .pipe(browserSync.stream())
}

function script(){
   return src([
      `${settingsPath.mainSourceRoot}/index.js`,
      `${settingsPath.mainSourceRoot}/${settingsPath.configRoot}/settings.js`,
      `${settingsPath.mainSourceRoot}/${settingsPath.mainIndexRoot}/modules/*.js`,
      `${settingsPath.mainSourceRoot}/${settingsPath.mainIndexRoot}/*.js`,
   ])
      .pipe(concat('script.min.js'))
      .pipe(uglify())
      .pipe(dest(`${settingsPath.mainSourceRoot}/${settingsPath.assetsRoot}/js/`))
      .pipe(browserSync.stream())
}

function images(){
   return (src([`${settingsPath.mainSourceRoot}/${settingsPath.assetsRoot}/images/**/*`]))
      .pipe(image([
         image.gifsicle({interlaced: true}),
         image.mozjpeg({quality: 75, progressive: true}),
         image.optipng({optimizationLevel: 5}),
         image.svgo({
            plugins: [
               {removeViewBox: true},
               {cleanupIDs: false},
            ]
         })
      ]))
      .pipe(dest(`${settingsPath.buildProdRoot}/${settingsPath.assetsRoot}/images/`))
}

function cleanDist(){
   return del(`${settingsPath.buildProdRoot}`)
}

function browsersync(){
   browserSync.init({
      server: {
         baseDir: `${settingsPath.mainSourceRoot}/`,
      }
   })
}

function build(){
   return src([
      `${settingsPath.mainSourceRoot}/${settingsPath.assetsRoot}/css/style.min.css`,
      `${settingsPath.mainSourceRoot}/${settingsPath.assetsRoot}/js/script.min.js`,
      `${settingsPath.mainSourceRoot}/${settingsPath.assetsRoot}/fonts/**/*`,
      `${settingsPath.mainSourceRoot}/*.html`
   ], {base: `${settingsPath.mainSourceRoot}`})
      .pipe(dest(`${settingsPath.buildProdRoot}`))
}

function watching(){
   //Слежка за scss 
   watch([
      `${settingsPath.mainSourceRoot}/${settingsPath.scssRoot}/*.scss`, 
      `${settingsPath.mainSourceRoot}/${settingsPath.mainIndexRoot}/sections/**/*.scss`, 
      `${settingsPath.mainSourceRoot}/${settingsPath.mainIndexRoot}/*.scss`, 
      `${settingsPath.mainSourceRoot}/${settingsPath.mainIndexRoot}/ui-kit/*.scss`,
      `${settingsPath.mainSourceRoot}/${settingsPath.configRoot}/*.scss`,
      `${settingsPath.mainSourceRoot}/${settingsPath.routesRoot}/**/*.scss`,
      `${settingsPath.mainSourceRoot}/${settingsPath.routesRoot}/**/**/**/*.scss`, 
   ], styles)
   //Слежка за html-inlude
   watch([
      `${settingsPath.mainSourceRoot}/${settingsPath.mainIndexRoot}/sections/**/*.html`, 
      `${settingsPath.mainSourceRoot}/${settingsPath.mainIndexRoot}/*.html`,
      `${settingsPath.mainSourceRoot}/${settingsPath.routesRoot}/**/*.html`, 
      `${settingsPath.mainSourceRoot}/${settingsPath.routesRoot}/**/**/**/*.html`, 
   ], html)
   //Слежка за html и сразу автообновление
   watch([`${settingsPath.mainSourceRoot}/*.html`]).on(`change`, browserSync.reload)
   //Слежка за js
   watch([
      `${settingsPath.mainSourceRoot}/index.js`, 
      `${settingsPath.mainSourceRoot}/${settingsPath.mainIndexRoot}/modules/*.js`, 
      `${settingsPath.mainSourceRoot}/${settingsPath.mainIndexRoot}/*.js`, 
      `!${settingsPath.mainSourceRoot}/${settingsPath.assetsRoot}/js/script.min.js`,
   ], script)
}

function _routesBuild(routes){
   const src = [
      `${settingsPath.mainSourceRoot}/${settingsPath.mainIndexRoot}/index.html`,
   ]

   for (let route of routes){
      src.push(`${settingsPath.mainSourceRoot}/${settingsPath.routesRoot}/${route.name}/${route.name}.html`)
   }

   return src
}

exports.styles = styles
exports.watching = watching
exports.browsersync = browsersync
exports.script = script
exports.images = images
exports.cleanDist = cleanDist
exports.html = html
exports.build = series(cleanDist, images, build)
exports.default = parallel(html, styles, script, browsersync, watching)