(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('CategoriesService', CategoriesService);

  function CategoriesService($http, ENV) {

    var service = {
      getCategories: getCategories
    };

    return service;

    function getCategories() {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/categories'
      });
    }

  }
})();
