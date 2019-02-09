(function () {
'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderMainController', ProviderMainController);

  function ProviderMainController(providerOrders,
                                  $scope,
                                  $timeout,
                                  APP,
                                  ProviderCustomerOrdersService,
                                  ErrorHandlerService){
    var providerMainVm = this,
        timeout,
        cachedSubmittedOrdersAt = moment();

    providerMainVm.submittedProviderOrders = providerOrders;

    scheduleGetOrders();

    $scope.$on('$destroy', function(){
      $timeout.cancel(timeout);
    });

    $scope.$on('update-submitted-provider-orders', function() {
      if (isCacheStale()) {
        getOrders();
      }
    });

    function getOrders(){
      return ProviderCustomerOrdersService
        .getProviderCustomerOrdersByStatus('submitted')
        .then(function success(customerOrders){
          cachedSubmittedOrdersAt = moment();
          providerMainVm.submittedProviderOrders = customerOrders;
        }, ErrorHandlerService.handleCommonErrorGET);
    }

    /**
      @note will schedule itself after running
    **/
    function scheduleGetOrders(){
      timeout = $timeout(function(){
        getOrders().finally(scheduleGetOrders);
      }, APP.timeoutDefault);
    }

    function isCacheStale(){
      return moment().diff(cachedSubmittedOrdersAt, 'seconds') > 10;
    }
  }
})();
