(function () {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('ShippingController', ShippingController);

  function ShippingController(shippingMyRequests, CommonService) {

    var shVm = this;

    shVm.totalOrders = 0;
    shVm.getIconStatus = CommonService.getStatusOrderIcon;

    init();

    function init() {
      shVm.orders = shippingMyRequests;
      shVm.totalOrders = shVm.orders.length;
    }
  }
})();
