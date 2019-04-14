(function() {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('ShippingController', ShippingController);

  function ShippingController(ShippingRequestService,
                              CommonService) {

    var shVm = this;

    shVm.totalOrders = 0;
    shVm.inProgressOrders = [];
    shVm.deliveredOrders = [];
    shVm.getIconStatus = CommonService.getStatusOrderIcon;
    shVm.loaded = false;

    var orders = {
      inProgress: shVm.inProgressOrders,
      delivered: shVm.deliveredOrders
    };

    init();

    function init() {
      ShippingRequestService.getMyShippingRequests().then(function(orders) {
        initOrders(orders);
      });
    }

    function initOrders(data) {
      var allOrders = data || [];
      sortOrders(allOrders);
      shVm.orders = orders.inProgress;
      shVm.totalOrders = allOrders.length;
      shVm.loaded = true;
    }

    function sortOrders(orders) {
      angular.forEach(orders, function(order) {
        if (order.status === 'delivered') {
          shVm.deliveredOrders.push(order);
        } else {
          shVm.inProgressOrders.push(order);
        }
      });
    }
  }
})();
