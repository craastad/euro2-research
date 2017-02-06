import gulp from 'gulp';
import less from 'gulp-less';
import LessCleaner from 'less-plugin-clean-css';
import LessAutoprefixer from 'less-plugin-autoprefix';
import devServer from 'gulp-webserver';
import minifyHTML from 'gulp-htmlmin';
import ghPages from 'gulp-gh-pages';

gulp.task('less', () => gulp
  .src('./src/style.less')
  .pipe(less({
    plugins: [
      new LessCleaner({ advanced: true }),
      new LessAutoprefixer({ browsers: ['not ie <= 8', '> 1%'] })
    ]
  }))
  .pipe(gulp.dest('./dist')));

gulp.task('html', () => gulp
  .src('./src/index.html')
  .pipe(minifyHTML({
    collapseWhitespace: true,
    collapseInlineTagWhitespace: false,
    removeAttributeQuotes: true,
    removeComments: true,
    removeRedundantAttributes: true
  }))
  .pipe(gulp.dest('./dist')));

gulp.task('vendor', () => gulp
  .src('./node_modules/bootstrap/**/*')
  .pipe(gulp.dest('./dist/bootstrap')));

gulp.task('build', ['less', 'html', 'vendor', 'copy']);

gulp.task('watch', ['build'], () => gulp
  .watch('./src/*', ['build'])
  .on('change', ({ path, type }) => console.log(`File ${path} was ${type}, building...`)));

gulp.task('default', ['watch']);

gulp.task('serve', () => gulp
  .src('./dist')
  .pipe(devServer({
    livereload: true,
    directoryListing: false,
    open: 'index.html'
  })));

gulp.task('copy', () => gulp
    .src('./src/assets/*')
    .pipe(gulp.dest('dist/assets'))
);

gulp.task('deploy', function() {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});