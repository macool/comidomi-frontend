(function () {
  'use strict';

  return module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-jade-ng-template-cache');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.initConfig({
      copy: require('./config/copy-config'),
      jadengtemplatecache: require('./config/jade-config'),
      yeoman: require('./config/yeoman-config'),
      compass: require('./config/compass-config'),
      ngconstant: require('./config/ngconstant-config'),
      concurrent: require('./config/concurrent-config')
    });

    grunt.registerTask('build', [
      'ngconstant:staging',
      'concurrent:staging'
    ]);
  };
})();
