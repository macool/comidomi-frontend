(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CustomerOrdersIndexController', CustomerOrdersIndexController);

  function CustomerOrdersIndexController(customerOrders) {
    var customerOrdersVm = this;

    customerOrdersVm.customerOrders = customerOrders;
    customerOrdersVm.inProgressOrders = [];
    customerOrdersVm.deliveredOrders = [];
    customerOrdersVm.currentTab= 'inProgress';
    customerOrdersVm.tabs = [
      {
        key: 'inProgress',
        onClick: switchTab
      },
      {
        key: 'delivered',
        onClick: switchTab
      },
    ];

    var orders = {
      inProgress: customerOrdersVm.inProgressOrders,
      delivered: customerOrdersVm.deliveredOrders
    };

    init();

    function init() {
      var allOrders = customerOrders || [];
      sortOrders(allOrders);
      customerOrdersVm.orders = orders[customerOrdersVm.currentTab];
    }

    function sortOrders (orders) {
      angular.forEach(orders, function(order){
        if (theRequestWasDelivered(order.provider_profiles)) { // jshint ignore:line
          customerOrdersVm.deliveredOrders.push(order);
        }else{
          customerOrdersVm.inProgressOrders.push(order);
        }
      });
    }

    function theRequestWasDelivered(provider){
      return provider.some(function (providerProfile){
        return providerProfile.customer_order_delivery.shipping_request.status === 'delivered'; // jshint ignore:line
      });
    }

    function switchTab (key){
      customerOrdersVm.orders = orders[key];
      customerOrdersVm.currentTab = key;
    }
  }
})();
