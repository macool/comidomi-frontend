(function() {
  'use strict';

  var concurrentConfig = {
    ionic: {
      tasks: [],
      options: {
        logConcurrentOutput: true
      }
    },
    server: [
      'compass:server',
      'copy:styles',
      'copy:vendor',
      'copy:fonts',
      'jadengtemplatecache'
    ],
    test: [
      'compass:test',
      'copy:styles',
      'copy:vendor',
      'copy:fonts',
      'jadengtemplatecache'
    ],
    dist: [
      'compass:dist',
      'copy:styles',
      'copy:vendor',
      'copy:fonts',
      'jadengtemplatecache'
    ],
    staging: [
      'compass:staging',
      'copy:styles',
      'copy:vendor',
      'copy:fonts',
      'jadengtemplatecache'
    ]
  };

  return module.exports = concurrentConfig;
})();
