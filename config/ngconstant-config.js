(function() {
  'use strict';

  var ngconstantConfig = {
    options: {
      space: '  ',
      wrap: '(function() {\n\n \'use strict\';\n\n {%= __ngModule %} \n\n })();',
      name: 'porttare.config',
      deps: false,
      dest: '<%= yeoman.app %>/<%= yeoman.scripts %>/config/constants-config.js'
    },
    development: {
      constants: {
        ENV: {
          name: 'development',
          apiHost: 'https://api.comidomi.ec',
          pusherKey: '287c19315060ae3bd2ec',
          gMapsKey: 'AIzaSyDoegRilS_knevV2csbxd4K-_Df1SsN0oo'
        }
      }
    },
    staging: {
      constants: {
        ENV: {
          name: 'staging',
          apiHost: 'https://porttare-backend.herokuapp.com',
          airbrakeHost: 'https://pangi.shiriculapo.com',
          airbrakeProjectId: process.env.AIRBRAKE_PROJECT_ID,
          airbrakeProjectKey: process.env.AIRBRAKE_PROJECT_KEY,
          gMapsKey: process.env.GOOGLE_MAPS_API_KEY,
          pusherKey: process.env.PUSHER_KEY,
          gcmSenderID: process.env.GCM_SENDER_ID
        }
      }
    },
    demo: {
      constants: {
        ENV: {
          name: 'demo',
          apiHost: 'https://demo-api.comidomi.com.ec',
          airbrakeHost: 'https://pangi.shiriculapo.com',
          gMapsKey: process.env.GOOGLE_MAPS_API_KEY,
          airbrakeProjectId: process.env.AIRBRAKE_PROJECT_ID,
          airbrakeProjectKey: process.env.AIRBRAKE_PROJECT_KEY,
          pusherKey: process.env.PUSHER_KEY,
          gcmSenderID: process.env.GCM_SENDER_ID
        }
      }
    },
    production: {
      constants: {
        ENV: {
          name: 'production',
          apiHost: 'https://api.comidomi.ec',
          airbrakeHost: 'https://pangi.shiriculapo.com',
          pusherKey: '5045d019acd66d1cc534',
          pusherCluster: 'us2',
          airbrakeProjectId: '5c6468150a1e1a7a9d01abdd',
          airbrakeProjectKey: '44efb53b680822cba2a41aa454f5ab1c',
          gMapsKey: 'AIzaSyDoegRilS_knevV2csbxd4K-_Df1SsN0oo'
        }
      }
    },
    test: {
      constants: {
        ENV: {
          name: 'test',
          apiHost: 'http://porttare-integration.herokuapp.com'
          // airbrakeProjectId: '5855956095ca4e44a000002a',
          // airbrakeProjectKey: 'ae5467f02e5a6d6443a81cf25c418e75'
        }
      }
    }
  };

  return module.exports = ngconstantConfig;
})();
