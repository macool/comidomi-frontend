(function(){
  'use strict';

  angular
    .module('porttare.services')
    .factory('CustomerOrderDeliveryService', CustomerOrderDeliveryService);

  function CustomerOrderDeliveryService(CommonService) {
    var service = {
      updateCustomerOrderDelivery: updateCustomerOrderDelivery,
    };

    return service;

    function updateCustomerOrderDelivery(customerOrderDelivery){
      return CommonService.editObject(customerOrderDelivery, '/api/customer/cart/deliveries/');
    }

  }
})();
