(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('orderDeliveryNombre', orderDeliveryNombre);

  function orderDeliveryNombre(){
    var directive = {
      restrict: 'E',
      bindToController: true,
      controllerAs: 'orderDeliveryNombreVM',
      controller: orderDeliveryNombreController,
      link: orderDeliveryNombreLink,
      templateUrl: 'templates/directives/cart/order-delivery-nombre.html',
      scope: {
        delivery: '=',
        addresses: '='
      }
    };
    return directive;
  }

  function orderDeliveryNombreController(){}

  function orderDeliveryNombreLink(scope){
    var orderDeliveryNombreVM = scope.orderDeliveryNombreVM;

    scope.$watch('orderDeliveryNombreVM.addresses', function (newAddresses){
      if (newAddresses) {
        updateDeliveryAddressName();
      }
    }, true);

    scope.$watch('orderDeliveryNombreVM.delivery', function(newDelivery) {
      if (newDelivery) {
        updateDeliveryAddressName();
      }
    }, true);

    function updateDeliveryAddressName(){
      if (isShipping()) {
        orderDeliveryNombreVM.deliveryNombre = getDeliveryAddressName();
      } else {
        orderDeliveryNombreVM.deliveryNombre = '';
      }
    }

    function getDeliveryAddressName(){
      var currentAddress,
          addresses = orderDeliveryNombreVM.addresses,
          customerAddressId = orderDeliveryNombreVM.delivery.customer_address_id; // jshint ignore:line
      currentAddress = addresses.find(function (address) {
        return address.id === customerAddressId;
      });
      if (currentAddress) {
        return currentAddress.nombre;
      }
    }

    function isShipping(){
      return orderDeliveryNombreVM.delivery.delivery_method === 'shipping'; // jshint ignore:line
    }
  }
})();
