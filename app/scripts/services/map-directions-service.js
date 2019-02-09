(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('MapDirectionsService', MapDirectionsService);

  function MapDirectionsService($q){
    var service = {
      renderRoute: renderRoute
    };
    return service;

    function renderRoute(options){
      var map = options.map,
          origin = options.origin,
          target = options.target,
          waypoints = options.waypoints;

      var deferredRender = $q.defer(),
          directionsService = new google.maps.DirectionsService(),
          directionsDisplay = new google.maps.DirectionsRenderer();

      directionsDisplay.setMap(map);
      directionsService.route({
        language: 'es',
        origin: origin,
        destination: target,
        waypoints: waypoints,
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode.DRIVING
      }, directionsResponse);

      return deferredRender.promise;

      function directionsResponse(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          deferredRender.resolve(response.routes);
        } else {
          deferredRender.reject(status);
        }
      }
    }
  }
})();
