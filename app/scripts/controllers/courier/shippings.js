(function() {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('ShippingController', ShippingController);

  function ShippingController(ShippingRequestService,
                              // shippingMyRequests,
                              CommonService,
                              $stateParams) {

    var shVm = this;

    shVm.totalOrders = 0;
    shVm.inProgressOrders = [];
    shVm.deliveredOrders = [];
    shVm.getIconStatus = CommonService.getStatusOrderIcon;
    shVm.switchTab = switchTab;
    shVm.currentOrderType = $stateParams.type || 'inProgress';
    shVm.showFilterTab = !!$stateParams.type;
    shVm.currentTab = 'new';
    shVm.loaded = false;
    shVm.tabs = [{
        key: 'inProgress',
        onClick: switchTab
      },
      {
        key: 'delivered',
        onClick: switchTab
      },
    ];

    shVm.mainTabs = [{
        key: 'new',
        sref: 'courier.orders.new'
      },
      {
        key: 'inProgress',
        sref: 'courier.orders.shippings'
      },
    ];

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
      shVm.orders = orders[shVm.currentOrderType];
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

    function switchTab(key) {
      shVm.orders = orders[key];
      shVm.currentOrderType = key;
    }
  }
})();
