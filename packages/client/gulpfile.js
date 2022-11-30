const gulp = require('gulp')
const ts = require('gulp-typescript')
const del = require('del')

const isDev = process.argv[2] === '--dev'

function clean() {
  return del('./dist/**')
}

function buildJs(dir) {
  const module = dir === 'cjs' ? 'commonjs' : 'es2020'
  return () => {
    return gulp
      .src(['./src/**/*.{ts,tsx}'])
      .pipe(
        ts({
          module,
          target: 'es2020',
          skipLibCheck: true,
          sourceMap: true,
          moduleResolution: 'Node',
          declaration: true,
          noImplicitUseStrict: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true
        })
      )
      .pipe(gulp.dest(`./dist/${dir}`))
  }
}

if (isDev) {
  exports.default = function () {
    gulp.watch(
      './src/**/*.{ts,tsx}',
      gulp.series(buildJs('cjs'), buildJs('es'))
    )
  }
} else {
  exports.default = gulp.series(clean, buildJs('cjs'), buildJs('es'))
}
