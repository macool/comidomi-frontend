(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('PlacesService', PlacesService);

  function PlacesService(CommonService) {
    var service = {
      getPlaces: getPlaces
    };
    return service;

    function getPlaces() {
      return CommonService.getObjects('/api/users/places/', 'places');
    }
  }
})();
