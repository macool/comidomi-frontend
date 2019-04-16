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
      'customer_request_updated': customerRequestUpdated
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

    function customerRequestUpdated(data) {
      data = parseRawNotificationData(data);

      if (data.customer_resource && data.wasTapped) {
        goToOrder(data);
      } else {
        var notification_description = data.notification_description || {},
            title = notification_description.title,
            subtitle = notification_description.body;
        if (title) {
          $rootScope.$broadcast('shipping_request_updated:show-flash-notification', {
            data: data,
            message: title,
            messageDescription: subtitle,
            onClick: goToOrder,
          });
        }
      }
    }

    function goToOrder(data) {
      if (data && data.customer_resource) { // jshint ignore:line
        var order = data.customer_resource; // jshint ignore:line
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

    function parseRawNotificationData(data) {
      data = data || {};
      if (data.customer_resource) {
        data.customer_resource = JSON.parse(data.customer_resource);
      }
      if (data.notification_description) {
        data.notification_description = JSON.parse(data.notification_description);
      }
      return data;
    }
  }
})();
