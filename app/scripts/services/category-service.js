(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('CategoryService', CategoryService);

  function CategoryService($http, ENV) {

    var service = {
      getCategoryProviders: getCategoryProviders
    };

    return service;

    function getCategoryProviders(categoryId) {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/categories/' + categoryId + '/providers'
      });
    }

  }
})();
