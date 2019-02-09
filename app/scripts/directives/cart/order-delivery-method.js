(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('orderDeliveryMethod', orderDeliveryMethod);

  function orderDeliveryMethod(){
    var directive = {
      restrict: 'E',
      bindToController: true,
      controllerAs: 'orderDeliveryMethodVM',
      controller: orderDeliveryMethodController,
      link: orderDeliveryMethodLink,
      template: '{{ orderDeliveryMethodVM.deliveryMethodStr | translate }}',
      scope: {
        deliveryMethod: '='
      }
    };
    return directive;
  }

  function orderDeliveryMethodController(){}

  function orderDeliveryMethodLink(scope){
    var orderDeliveryMethodVM = scope.orderDeliveryMethodVM;

    scope.$watch('orderDeliveryMethodVM.deliveryMethod', function (){
      orderDeliveryMethodVM.deliveryMethodStr = getDeliveryMethodStr();
    });

    function getDeliveryMethodStr(){
      if (isShipping()) {
        return 'cart.deliveryPlaceholder';
      } else {
        return 'cart.pickupPlaceholder';
      }
    }

    function isShipping(){
      return orderDeliveryMethodVM.deliveryMethod === 'shipping';
    }
  }
})();
