(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('GeolocationService', GeolocationService);

  function GeolocationService($cordovaGeolocation, $q) {

    var posOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };

    var service = {
      getCurrentPosition: getCurrentPosition
    };

    return service;

    function getCurrentPosition() {
      return $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function success(res){
          return res;
        }, function error(err) {
          // TODO translate me?
          var message = 'Imposible obtener la ubicación del usuario.';
          switch (err.code) {
            case 1:
              message += '\nLa solicitud de geolocalización fue denegada.';
              break;
            case 2:
              message += '\nNo se pudo ubicar este dispositivo.';
              break;
            case 3:
              message += '\nLa petición de geolocalización caducó.';
              break;
          }
          return $q.reject(message);
        });
    }

  }
})();
