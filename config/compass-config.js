(function() {
  'use strict';

  var compassConfig = {
    options: {
      sassDir: '<%= yeoman.app %>/<%= yeoman.styles %>',
      cssDir: '.temp/<%= yeoman.styles %>',
      generatedImagesDir: '.temp/<%= yeoman.images %>/generated',
      imagesDir: '<%= yeoman.app %>/<%= yeoman.images %>',
      javascriptsDir: '<%= yeoman.app %>/<%= yeoman.scripts %>',
      fontsDir: '<%= yeoman.app %>/<%= yeoman.styles %>/fonts',
      importPath: '<%= yeoman.app %>/bower_components',
      httpImagesPath: '/<%= yeoman.images %>',
      httpGeneratedImagesPath: '/<%= yeoman.images %>/generated',
      httpFontsPath: '/<%= yeoman.styles %>/fonts',
      relativeAssets: false,
      assetCacheBuster: false,
      bundleExec: true,
      raw: 'Sass::Script::Number.precision = 10\n',
      specify: '<%= yeoman.app %>/<%= yeoman.styles %>/main.scss'
    },
    dist: {
      options: {
        outputStyle: 'compressed',
        force: true,
        cssDir: '<%= yeoman.dist %>/<%= yeoman.styles %>',
        generatedImagesDir: '<%= yeoman.dist %>/<%= yeoman.images %>/generated'
      }
    },
    test: {
      options: {
        force: true
      }
    },
    staging: {
      options: {
        outputStyle: 'compressed',
        force: true,
        cssDir: '<%= yeoman.app %>/<%= yeoman.styles %>',
        generatedImagesDir: '<%= yeoman.dist %>/<%= yeoman.images %>/generated'
      }
    },
    server: {
      options: {
        debugInfo: true
      }
    }
  };

  return module.exports = compassConfig;
})();
