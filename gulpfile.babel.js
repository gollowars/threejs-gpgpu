import gulp from 'gulp'
import lp from 'gulp-load-plugins'
const $ = lp()
import gulpWebpack from 'gulp-webpack'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import browserSync from 'browser-sync'
import path from 'path'
import vinylYamlData from 'vinyl-yaml-data'
import deepExtend from 'deep-extend-stream'
import autoprefixer from 'gulp-autoprefixer'
import spritesmith from 'gulp.spritesmith'
import merge from 'merge-stream'
import runSequcence from 'run-sequence'

import deployConf from './deploy.json'
import del from 'del'

import jeet from 'jeet'

const ConfigEnv = {
  dev: {dest: './public/', jade: {pretty: true}, name: 'dev'},
  prod: {dest: './build/', jade: {pretty: true}, name: 'prod'},
  stg: {dest: './build/', jade: {pretty: true}, name: 'stg'},
  preview: {dest: './build/', jade: {pretty: true}, name: 'preview'}
}


const getEnv = () => {
  return ConfigEnv[$.util.env.env || 'dev']
}

gulp.task('webpack', () => {
  let config = {
    watch: true,
    entry: {
      main: "./src/js/main.js",
      detectpc: "./src/js/detectpc.js",
      detectsp: "./src/js/detectsp.js"
    },
    output: {
      filename: '[name].js'
    },
    module: {
      loaders:[
        {test: /\.js$/, exclude: /node_modules|modules/, loaders: ['babel-loader', 'eslint-loader']},
        {test: /\.(glsl|vs|fs)$/, loader: 'webpack-glsl'}
      ]
    },
    worker: {
      output: {
        path: "public/",
        filename: '[id].worker.js'
      }
    },
    eslint: {
      configFile: './.eslintrc',
      ignorePath: './.eslintignore'
    },
    plugins: [
      // new webpack.optimize.UglifyJsPlugin()
    // ],
    ],
    devtool: ''
  }
  let _env = $.util.env.env
  let env = getEnv()

  if (_env == 'prod') {
    config.watch = false
    config.plugins = [
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin()
    ]
  } else {
    config.devtool = 'inline-source-map'
  }

  return gulp.src('')
    // .pipe(gulpWebpack(config))
    .pipe($.plumber())

    .pipe(webpackStream(config, null, (err, stats) => {
      if (!err) {
        $.util.log(stats.toString())
        browserSync.reload()
      }
    }))
    .pipe(gulp.dest(env.dest + 'js/'))
})

let locals;
gulp.task('data', () => {
  locals = {};
  return gulp.src('src/data/**/*.y{,a}ml')
    .pipe(vinylYamlData())
    .pipe(deepExtend(locals));
});

gulp.task('jade',['data'], () => {

  let env = getEnv()

  return gulp.src(['./src/pages/**/*.jade', '!./src/pages/layout/*.jade'])
    .pipe($.data( (file) => {
      let p = path.dirname(file.path).split('/src/').pop().split('/')
      let relativePath = p.reduce((x, y) => {
        return y == "pages" ? x : x + "../"
      }, "")
      return {"path": relativePath, "data":locals}
    }))
    .pipe($.jade(env.jade))
    .pipe(gulp.dest(env.dest))
    .pipe(browserSync.stream())
})

gulp.task('stylus', () => {
  let env = getEnv()
  return gulp.src(['./src/stylus/**/*.styl','!./src/stylus/**/_*.styl'])
    .pipe($.stylus({
      "include css": true,
      "use": [jeet()]
    }))
    .pipe($.autoprefixer({
      browsers: ["Android >= 4", "ios_saf >= 8"]
    }))
    .pipe(gulp.dest(env.dest + 'css/'))
    .pipe(browserSync.stream())
})


let spriteImageDirs = ['top','common','login','result','about','ranking','special','register','error','pc']
gulp.task('sprite',() => {

  let env = getEnv()
  let stream = []

  let streams = merge()

  for (var dir of spriteImageDirs) {
    let spriteData = gulp.src('./src/sprite/'+dir+'/*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/'+dir+'/'+'sprite.png',
      cssName: '_sprite-'+dir+'.styl',
      padding: 5
    }))

    let stream2 = spriteData.img
      .pipe(gulp.dest(env.dest + 'images/'+dir+'/'))

    let stream3 = spriteData.css
      .pipe(gulp.dest('./src/stylus/'))

    streams.add(stream2)
    streams.add(stream3)
  }
  // console.log(streams)
  return streams.isEmpty()
})



gulp.task('watch', () => {
  gulp.watch(['./src/pages/**/*.jade','./src/data/**/*.y{,a}ml'], ['jade'])
  gulp.watch('./src/stylus/**/*.styl', ['stylus'])
  gulp.watch(['./src/images/**/*', './src/libs/*.js', './src/sounds/*'], ['assets'])
  gulp.watch('./public/**/*.js', browserSync.reload)
})

gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: './public/'
    },
    open: false
  })
})

gulp.task('clean', (cb) => {
  let env = getEnv()
  return del([env.dest + 'images/**', env.dest + 'js/**', env.dest + 'css/**', env.dest + 'data/**'], cb)
})

gulp.task('assets', () => {
  let env = getEnv()
  return merge(
    gulp.src(['./src/sounds/*.mp3'])
      .pipe(gulp.dest(env.dest + 'sounds/')),
    gulp.src(['./src/libs/*', '!./src/libs/rx*'], {base: 'src/libs'})
      .pipe(gulp.dest(env.dest + 'js/')),
    gulp.src(['./src/images/**/*', '!./src/images/tmp', '!./src/images/tmp/**'])
      .pipe(gulp.dest(env.dest + 'images/'))
      .pipe($.preservetime()),
    gulp.src(['./src/json/**'])
      .pipe(gulp.dest(env.dest + 'data/'))
  )
})

gulp.task('concat-lib',['lib'], () => {
  let env = getEnv()
  return gulp.src([
      './src/js/lib/jquery.js',
      './src/js/lib/jquery.easing.min.js',
      './src/js/lib/logger.min.js',
      './src/js/lib/jquery.pjax.js'
    ])
    .pipe($.concat('lib.js'))
    .pipe($.uglify({preserveComments: 'some'}))
    .pipe(gulp.dest(env.dest + 'js/'))
})

gulp.task('lib',()=>{
  let env = getEnv()
  gulp.src(['./src/js/modernizr.js','./src/js/platform.js'])
  .pipe(gulp.dest(env.dest + 'js/'))
})


gulp.task('default', ['build', 'server', 'watch'])

gulp.task('build', _ => {
  runSequcence(
    'clean',
    ['concat-lib', 'assets'],
    'sprite',
    'stylus',
    'jade',
    'webpack'
  )
})

gulp.task('deploy-server', _ => {
  let env = getEnv()
  let conf = deployConf[env.name]
  let target = './build/**/*'

  if (env.name == 'dev') {
    target = './public/**/*'
  }

  return gulp.src(target)
    .pipe($.sftp(conf))
})

gulp.task('deploy-assets', () => {
  let env = getEnv()
  let conf = deployConf[env.name]

  return gulp.src(['./build/sounds/*', './build/js/*.js', './build/css/**/*.css', './build/images/**/*'], {base: 'build'})
    .pipe($.sftp(conf))
})

gulp.task('deploy', _ => {
  runSequcence(
    'build',
    'deploy-server'
  )  
})

gulp.task('test', () => {
  let env = getEnv()
  let conf = deployConf[env.name]
})