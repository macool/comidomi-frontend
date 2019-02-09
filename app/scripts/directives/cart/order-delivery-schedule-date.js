(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive(
      'orderDeliveryScheduleDate',
      orderDeliveryScheduleDate
    );

  function orderDeliveryScheduleDate(){
    var directive = {
      restrict: 'E',
      bindToController: true,
      controllerAs: 'orderDeliveryScheduleDateVM',
      controller: orderDeliveryScheduleDateController,
      templateUrl: 'templates/directives/cart/order-delivery-schedule-date.html',
      scope: {
        deliverAt: '='
      }
    };
    return directive;
  }

  function orderDeliveryScheduleDateController(){}
})();
