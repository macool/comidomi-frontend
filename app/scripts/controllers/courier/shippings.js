(function () {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('ShippingController', ShippingController);

  function ShippingController(shippingMyRequests) {

    var shVm = this;

    var ICONS = {
      assigned: 'directions_bike',
      delivered: 'check_circle',
      in_progress: 'person_pin'
    };
    
    shVm.totalOrders = 0;
    shVm.getIconStatus = getIconStatus;

    init();

    function init() {
      shVm.orders = shippingMyRequests;
      shVm.totalOrders = shVm.orders.length;
    }

    function getIconStatus(order){
      return ICONS[order.status];
    }
  }
})();
