(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('PusherService', PusherService);

  function PusherService($q, $auth, ENV) {
    var serviceLoaded = false,
        loadDeferred,
        headersDeferred,
        pusherClient;

    var service = {
      load: loadLibrary,
      listen: listenChannel,
      unlisten: unlistenChannel
    };

    return service;

    function listenChannel(channelName, eventName, callback) {
      var channel = pusherClient.subscribe(channelName);
      channel.bind(eventName, callback);
    }

    function unlistenChannel(channelName) {
      pusherClient.unsubscribe(channelName);
    }

    function loadLibrary() {
      if (serviceLoaded) {
        return updateAuthHeaders();
      } else {
        loadDeferred = $q.defer();
        appendPusherScript();
        return loadDeferred.promise;
      }
    }

    function appendPusherScript() {
      var pusherURI = 'https://js.pusher.com/3.2/pusher.min.js';
      var script = document.createElement('script');
      script.src = pusherURI;
      script.type = 'text/javascript';
      script.onload = pusherLoaded;
      document.getElementsByTagName('head')[0].appendChild(script);
    }

    function pusherLoaded() {
      serviceLoaded = true;
      newPusherClient();
    }

    function updateAuthHeaders() {
      return getAuthHeaders().then(function (headers) {
        pusherClient.config.auth = headers;
      });
    }

    function newPusherClient() {
      getAuthHeaders().then(function (headers) {
        pusherClient = new Pusher(ENV.pusherKey, {
          encrypted: true,
          auth: headers,
          authEndpoint: ENV.apiHost + '/api/pusher_auth', // jshint ignore:line
        });
        loadDeferred.resolve();
      });
    }

    function getAuthHeaders() {
      headersDeferred = $q.defer();
      $auth.validateUser().then(function () {
        var authHeaders = $auth.retrieveData('auth_headers'); // jshint ignore:line
        authHeaders.Accept = 'application/json';
        headersDeferred.resolve({ headers: authHeaders });
      });
      return headersDeferred.promise;
    }
  }
})();
