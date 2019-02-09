'use strict';

angular
  .module('porttare.services')
  .factory('ProductsService', ProductsService);

function ProductsService($http, ENV, $ionicPopup, $q) {
  var service = {
    getProducts: getProducts,
    getProduct: getProduct,
    getProviderProducts: getProviderProducts
  };

  return service;

  function getProducts(params) {
    return $http({
      method: 'GET',
      url: ENV.apiHost + '/api/products',
      params: params
    }).then(function(results){
      return results.data;
    });
  }

  function getProviderProducts(paramsData) {
    return $http({
      method: 'GET',
      url: ENV.apiHost + '/api/categories/' + paramsData.categoryId + '/providers/' + paramsData.providerId
    }).then(function success(res) {
      return res.data;
    }, function error(res) {
      return $q.reject(res.data);
    });
  }

  function getProduct(paramsData) {
    return $http({
      method: 'GET',
      url: ENV.apiHost + '/api/categories/' + paramsData.categoryId + '/providers/' + paramsData.providerId + '/items/' + paramsData.id
    }).then(function success(res) {
      return res.data.provider_item; // jshint ignore:line
    }, function error(res) {
      return $q.reject(res.data);
    });
  }
}
