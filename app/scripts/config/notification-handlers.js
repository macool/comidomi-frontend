(function() {
  'use strict';

  angular
    .module('porttare')
    .run(notificationHandlersConfig);

  function notificationHandlersConfig($state,
                                      $rootScope) {
    var handlers = {
      'provider_new_order': providerNewOrder,
      'new_shipping_request': newShippingRequest,
      'shipping_request_updated': shippingRequestUpdated
    };

    $rootScope.$on('porttare:notification', function(e, data) {
      if (data.notification_handler) { // jshint ignore:line
        var handler = handlers[data.notification_handler]; // jshint ignore:line
        handler.call(this, data);
      }
    });

    function providerNewOrder(data) {
      $state.go('provider.orders.show', {
        id: data.additionalData.order_id // jshint ignore:line
      });
    }

    function newShippingRequest(data) {
      if (data.wasTapped) {
        $state.go('courier.orders.new');
      }
    }

    function shippingRequestUpdated(data) {
      data = data || {};
      if (data.shipping_request && data.wasTapped) {
        var order = data.shipping_request || {};
        goToOrder(order);
      }else{
        var notification = data.notification || {},
          title = notification.title;
        if (title) {
          $rootScope.$broadcast('shipping_request_updated:show-flash-notification', {
            data: data,
            message: title,
            onClick: goToOrder,
          });
        }
      }
    }

    function goToOrder(data) {
      if (data && data.shipping_request) { // jshint ignore:line
        var order = data.shipping_request; // jshint ignore:line
        if (order.kind === 'customer_errand') {
          $state.go('app.errands.show', {
            id: order.id,
            customerErrand: order
          });
        }
        if (order.kind === 'customer_order') {
          $state.go('provider.orders.show', {
            id: order.id,
            customerOrder: order
          });
        }
      }
    }
  }
})();
