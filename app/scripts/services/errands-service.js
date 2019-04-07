(function() {
  'use strict';

  angular
    .module('porttare.services')
    .factory('ErrandsService', ErrandsService);

  function ErrandsService(CommonService) {
    var service = {
      sendErrand: sendErrand
    };

    return service;

    function sendErrand(errandParams) {
      return CommonService.newObject(errandParams, '/api/customer/errands');
    }

  }
})();
