(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('orderItemsTotal', orderItemsTotal);

  function orderItemsTotal() {
    var directive = {
      restrict: 'E',
      bindToController: true,
      controllerAs: 'orderItemsTotalVM',
      controller: orderItemsTotalController,
      link: orderItemsTotalLink,
      templateUrl: 'templates/directives/cart/order-items-total.html',
      scope: {
        orderItems: '=',
        currency: '@'
      }
    };
    return directive;
  }

  function orderItemsTotalController() {}

  function orderItemsTotalLink(scope){
    // jshint validthis:true
    var orderItemsTotalVM = scope.orderItemsTotalVM;

    scope.$watch('orderItemsTotalVM.orderItems', function (newOrderItems){
      if (newOrderItems) {
        calculateTotal();
      }
    }, true);

    function calculateTotal() {
      var orderItems = orderItemsTotalVM.orderItems;
      var totalCents = orderItems.reduce(function(totalMemo, orderItem) {
        var subtotalCents = orderItem.provider_item_precio_cents * orderItem.cantidad; // jshint ignore:line
        return totalMemo + subtotalCents;
      }, 0);
      orderItemsTotalVM.totalCents = totalCents;
    }
  }
})();
