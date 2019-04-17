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
        type: '@'
      },
      controller: [
        'CommonService',
        courierOrderCardController
      ],
      controllerAs: 'coCardVm',
      bindToController: true
    };

    return directive;
  }

  function courierOrderCardController(CommonService) {
    var coCardVm = this,
        THEMES = {
          customer_order_delivery: 'blue-mode',
          customer_errand: 'green-mode'
        };


    coCardVm.courierOrder = formatData(coCardVm.order);
    coCardVm.onClickOrder = onClickOrder;
    coCardVm.getIconStatus = CommonService.getStatusOrderIcon;

    function onClickOrder() {
      if (coCardVm.onClick && angular.isFunction(coCardVm.onClick)) {
        coCardVm.onClick(coCardVm.order);
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
            provider_image: null,
            subtotal: null,
            currency: 'USD',
            shipping_price: 0,
            kind: order.kind,
            theme: THEMES[order.kind],
            status: order.status,
            assigned_at: order.assigned_at
          };

      if (order.kind === 'customer_order_delivery') {
        var customer_order = {
          address_one: order.customer_order_delivery.customer_address_attributes.direccion_uno,
          address_two: order.customer_order_delivery.customer_address_attributes.direccion_dos,
          provider_name: order.provider_profile.nombre_establecimiento,
          provider_image: order.provider_profile.logotipo_thumbnail_url,
          subtotal: order.customer_order.subtotal_items_cents,
          currency: order.customer_order.subtotal_items_currency,
          shipping_price: order.customer_order_delivery.shipping_fare_price_cents,
        };
        order = angular.merge(defaultOrder, customer_order);
      }

      if (order.kind === 'customer_errand') {
        var customer_errand = {
          address_one: order.address_attributes.direccion_uno,
          address_two: order.address_attributes.direccion_dos,
          currency: order.customer_errand.shipping_fare_price_currency,
          shipping_price: order.customer_errand.shipping_fare_price_cents,
          provider_name: 'Encomienda'
        };
        order = angular.merge(defaultOrder, customer_errand);
      }

      return order;
    }
  }
})();
