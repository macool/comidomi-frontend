(function () {
  'use strict';

  /* jshint validthis:true */
  /* jshint camelcase:false */

  angular
    .module('porttare.directives')
    .directive('courierOrderCard', courierOrderCard);

  function courierOrderCard() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/courier-order-card/courier-order-card.html',
      scope: {
        order: '=',
        onClick: '=',
      },
      controller: [
        courierOrderCardController
      ],
      controllerAs: 'coVm',
      bindToController: true
    };

    return directive;
  }

  function courierOrderCardController() {
    var coVm = this,
        THEMES = {
          customer_order_delivery: 'blue-mode',
          customer_errand: 'green-mode'
        };

    coVm.courierOrder = formatData(coVm.order);
    coVm.onClickOrder = onClickOrder;

    function onClickOrder() {
      if (coVm.onClick && angular.isFunction(coVm.onClick)) {
        coVm.onClick(coVm.order);
      }
    }

    function formatData(courierOrder) {
      var order = angular.copy(courierOrder) || {},
          customer = order.customer_order.customer_profile || {},
          defaultOrder = {
            customer_image: customer.image_url,
            customer_name: customer.name,
            customer_phone_number: customer.phone_number,
            address_one: null,
            address_two: null,
            provider_name: null,
            subtotal: null,
            currency: 'USD',
            shipping_price: 0,
            kind: order.kind,
            theme: THEMES[order.kind]
          };

      if (order.kind === 'customer_order_delivery') {
        var customer_order = {
          address_one: order.customer_order_delivery.customer_address_attributes.direccion_uno,
          address_two: order.customer_order_delivery.customer_address_attributes.direccion_dos,
          provider_name: order.provider_profile.nombre_establecimiento,
          subtotal: order.customer_order.subtotal_items_cents,
          currency: order.customer_order.subtotal_items_currency,
          shipping_price: order.customer_order_delivery.shipping_fare_price_cents
        };
        order = angular.merge(defaultOrder, customer_order);
      }

      if (order.kind === 'customer_errand') {
        var customer_errand = {
          address_one: order.address_attributes.direccion_uno,
          address_two: order.address_attributes.direccion_dos,
          currency: order.customer_errand.shipping_fare_price_currency,
          shipping_price: order.customer_errand.shipping_fare_price_cents
        };
        order = angular.merge(defaultOrder, customer_errand);
      }

      return order;
    }
  }
})();
