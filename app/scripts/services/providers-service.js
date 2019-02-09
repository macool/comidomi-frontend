(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('ProvidersService', ProvidersService);

  function ProvidersService($http, ENV, CommonService) {

    var service = {
      getProviders: getProviders
    };

    return service;

    function getProviders(){
      return CommonService.getObjects(
        '/api/customer/service_providers',
        'provider_profiles'
      );
    }
  }
})();
