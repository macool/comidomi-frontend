(function () {
  'use strict';

  angular
    .module('porttare')
    .run(notificationHandlersConfig);

  function notificationHandlersConfig($state,
                                      $rootScope){
    var handlers = {
      'provider_new_order': providerNewOrder
    };

    $rootScope.$on('porttare:notification', function(e, data){
      if (data.additionalData.handler) {
        var handler = handlers[data.additionalData.handler];
        handler.call(this, data);
      }
    });

    function providerNewOrder(data){
      $state.go('provider.orders.show', {
        id: data.additionalData.order_id // jshint ignore:line
      });
    }
  }
})();
