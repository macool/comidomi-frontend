(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('GeocodingService', GeocodingService);

  function GeocodingService($q){
    var geocoderClient,
        service = {
      geocode: geocode
    };
    return service;

    function geocode(options){
      var deferredGeocode = $q.defer();
      getGeocoder().geocode(options, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          deferredGeocode.resolve(results);
        } else {
          deferredGeocode.reject(status);
        }
      });
      return deferredGeocode.promise;
    }

    function getGeocoder(){
      if (geocoderClient) {
        return geocoderClient;
      }
      geocoderClient = new google.maps.Geocoder();
      return geocoderClient;
    }
  }
})();
