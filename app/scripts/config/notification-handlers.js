(function () {
  'use strict';

  angular
    .module('porttare')
    .run(notificationHandlersConfig);

  function notificationHandlersConfig($state,
                                      $rootScope){
    var handlers = {
      'provider_new_order': providerNewOrder,
      'new_shipping_request': newShippingRequest
    };

    $rootScope.$on('porttare:notification', function(e, data){
      if (data.notification_handler) { // jshint ignore:line
        var handler = handlers[data.notification_handler]; // jshint ignore:line
        handler.call(this, data);
      }
    });

    function providerNewOrder(data){
      $state.go('provider.orders.show', {
        id: data.additionalData.order_id // jshint ignore:line
      });
    }

    function newShippingRequest(data){
      if (data.wasTapped) {
        $state.go('courier.orders.new');
      }
    }
  }
})();
