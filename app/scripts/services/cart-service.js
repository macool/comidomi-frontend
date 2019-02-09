(function(){
  'use strict';

  angular
    .module('porttare.services')
    .factory('CartService', CartService);

  function CartService($http, ENV, $q, ErrorHandlerService) {
    var service = {
      addItem: addItem,
      getCart: getCart,
      checkout : checkout,
      updateOrderItem: updateOrderItem,
      removeOrderItem:removeOrderItem,
      isCartEmpty: isCartEmpty,
      findCartItem: findCartItem,
      canAddItem: canAddItem
    };

    return service;

    function addItem(item) {
      return $http({
        method: 'POST',
        url: ENV.apiHost + '/api/customer/cart/items',
        data: item
      })
        .then(function success(response){
          return response.data;
        }, function error(response){
          return $q.reject(response.data);
        });
    }

    function removeOrderItem(orderItem) {
      return $http({
        method: 'DELETE',
        url: ENV.apiHost + '/api/customer/cart/items/'+ orderItem.id
      });
    }

    function getCart() {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/customer/cart'
      })
        .then(function success(response){
          return response.data;
        }).catch(ErrorHandlerService.handleCommonErrorGET);
    }

    function checkout(cartData) {
      return $http({
        method: 'POST',
        url: ENV.apiHost + '/api/customer/cart/checkout',
        data: cartData
      })
        .then(function success(response) {
          return response.data;
        }, function error(response) {
          return $q.reject(response.data);
        });
    }

    function updateOrderItem(cartItem){
      return $http({
        method: 'PUT',
        url: ENV.apiHost + '/api/customer/cart/items/' + cartItem.id,
        data: cartItem
      })
        .then(function success(response) {
          return response.data;
        }, function error(response) {
          return $q.reject(response.data);
        });
    }

    function isCartEmpty(customerOrder){
      return !customerOrder || !customerOrder.provider_profiles || customerOrder.provider_profiles.length == 0; //jshint ignore:line
    }

    function findCartItem(customerOrder, providerItem){
      var orderItem = null;
      if( !isCartEmpty(customerOrder) ){
        var orderItems = [];
        var providerProfile = customerOrder.provider_profiles //jshint ignore:line
                                              .find(function(profile){
                                                return profile.id === providerItem.provider_profile_id; //jshint ignore:line
                                              });
        if(providerProfile){
          orderItems = providerProfile.customer_order_items; //jshint ignore:line
        }
        orderItem = orderItems
                      .find(function(item){
                        return item.provider_item.id === providerItem.id;//jshint ignore:line
                      });
      }
      return orderItem;
    }

    function canAddItem(orderItem, addCount, providerItem){
      var currentCount = orderItem ? orderItem.cantidad : 0;
      var canAdd = ( currentCount + addCount  <= providerItem.cantidad);

      return canAdd;
    }
  }
})();
