(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CustomerOrdersIndexController', CustomerOrdersIndexController);

  function CustomerOrdersIndexController(customerOrders) {
    var customerOrdersVm = this;
    customerOrdersVm.customerOrders = customerOrders;
  }
})();
