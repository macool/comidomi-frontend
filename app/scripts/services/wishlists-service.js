(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('WishlistsService', WishlistsService);

  function WishlistsService($http, $q, ENV) {

    var service = {
      getWishlists: getWishlists,
      createWishlist: createWishlist,
      updateWishlist: updateWishlist,
      removeWishlist: removeWishlist
    };
    return service;

    function getWishlists() {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/customer/wishlists'
      }).then(function success(res) {
        return res.data;
      }, function error(res) {
        return $q.reject(res.data);
      });
    }

    function createWishlist(data) {
      return $http({
        method: 'POST',
        url: ENV.apiHost + '/api/customer/wishlists',
        data: data
      }).then(function success(res) {
        return res.data;
      }, function error(res) {
        return $q.reject(res.data);
      });
    }

    function removeWishlist(wishlistId) {
      return $http({
        method: 'DELETE',
        url: ENV.apiHost + '/api/customer/wishlists/' + wishlistId
      }).then(function success(res) {
        return res.data;
      }, function error(res) {
        return $q.reject(res.data);
      });
    }

    function updateWishlist(data) {
      return $http({
        method: 'PUT',
        url: ENV.apiHost + '/api/customer/wishlists/' + data.id,
        data: data
      }).then(function success(res) {
        return res.data;
      }, function error(res) {
        return $q.reject(res.data);
      });
    }
  }
})();
