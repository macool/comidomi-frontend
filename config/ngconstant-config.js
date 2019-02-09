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
          apiHost: 'http://localhost:3785',
          pusherKey: '287c19315060ae3bd2ec',
          gMapsKey: 'AIzaSyDbY9wkWTMUHeT_J2Uehq0-i0S1PCaybFE'
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
          apiHost: 'http://api.yoursite.com'
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
