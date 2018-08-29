gulp = require 'gulp'
jade = require 'gulp-jade'
coffee = require 'gulp-coffee'
stylus = require 'gulp-stylus'
mainBowerFiles = require 'main-bower-files'
watch = require 'gulp-watch'

files =
  html: 'src/**/*.html'
  jade: 'src/**/*.jade'
  js: 'src/**/*.js'
  coffee: 'src/**/*.coffee'
  css: 'src/**/*.css'
  stylus: 'src/**/*.styl'

gulp.task 'default', ['html', 'js', 'css', 'bower']

gulp.task 'html', ->
  gulp
    .src files.html
    .pipe gulp.dest 'public'
  gulp
    .src files.jade
    .pipe jade()
    .pipe gulp.dest 'public'

gulp.task 'js', ->
  gulp
    .src files.js
    .pipe gulp.dest 'public'
  gulp
    .src files.coffee
    .pipe coffee()
    .pipe gulp.dest 'public'

gulp.task 'css', ->
  gulp
    .src files.css
    .pipe gulp.dest 'public'
  gulp
    .src files.stylus
    .pipe stylus()
    .pipe gulp.dest 'public'

gulp.task 'bower', ->
  gulp
    .src mainBowerFiles()
    .pipe gulp.dest 'public/lib'

gulp.task 'watch', ->
  gulp.start ['default']
  watch [files.html, files.jade], -> gulp.start ['html']
  watch [files.js, files.coffee], -> gulp.start ['js']
  watch [files.css, files.stylus], -> gulp.start ['css']
