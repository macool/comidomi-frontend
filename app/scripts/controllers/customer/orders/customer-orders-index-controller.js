(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CustomerOrdersIndexController', CustomerOrdersIndexController);

  function CustomerOrdersIndexController(CustomerOrdersService,
                                        ErrorHandlerService) {
    var customerOrdersVm = this;

    customerOrdersVm.loaded = false;
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
      CustomerOrdersService.getCustomerOrders().then(function(customerOrders){
        var allOrders = customerOrders || [];
        customerOrdersVm.customerOrders = customerOrders;
        sortOrders(allOrders);
        customerOrdersVm.orders = orders[customerOrdersVm.currentTab];
        customerOrdersVm.loaded = true;
      },ErrorHandlerService.handleCommonErrorGET);
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
