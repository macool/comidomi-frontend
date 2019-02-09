(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('CustomerOrdersService', CustomerOrdersService);

  function CustomerOrdersService($http, ENV, ErrorHandlerService) {
    var service = {
      getCustomerOrders: getCustomerOrders,
      getCustomerOrder: getCustomerOrder
    };

    return service;

    function getCustomerOrders() {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/customer/orders'
      }).then(function (response) {
        return response.data.customer_orders; // jshint ignore:line
      });
    }

    function getCustomerOrder(customerOrderId) {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/customer/orders/' + customerOrderId
      }).then(function (response) {
        return response.data.customer_order; // jshint ignore:line
      }).catch(
        ErrorHandlerService.handleCommonErrorGET
      );
    }

  }
})();
