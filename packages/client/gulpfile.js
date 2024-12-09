const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');

// Use environment variables or a configuration file for environment-specific settings
const isDev = process.env.NODE_ENV === 'development';

// Common TypeScript options to reduce duplication
const tsOptions = {
  target: 'es2020',
  skipLibCheck: true,
  sourceMap: true,
  moduleResolution: 'Node',
  declaration: true,
  noImplicitUseStrict: true,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true
};

function clean() {
  // Clear the distribution directory
  return del('./dist/**');
}

function buildJs(moduleType) {
  // Determine the module format based on the provided type
  const module = moduleType === 'cjs' ? 'commonjs' : 'es2020';

  // Return a function for Gulp to run
  return () => {
    return gulp.src(['./src/**/*.{ts,tsx}'])
      .pipe(ts({ ...tsOptions, module }))
      .on('error', (error) => console.error('TypeScript Error:', error))
      .pipe(gulp.dest(`./dist/${moduleType}`));
  };
}

// Define the development and production tasks
const devTask = () => gulp.watch('./src/**/*.{ts,tsx}', gulp.series(buildJs('cjs'), buildJs('es')));
const prodTask = gulp.series(clean, buildJs('cjs'), buildJs('es'));

// Export the appropriate task based on the environment
exports.default = isDev ? devTask : prodTask;
