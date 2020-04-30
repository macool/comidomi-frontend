(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderOrdersController', ProviderOrdersController);

  function ProviderOrdersController(status,
                                    ProviderCustomerOrdersService,
                                    ErrorHandlerService,
                                    $scope) {
    var poVm = this;
    poVm.tab = status;
    poVm.emptyState = 'images/delivery-guy-bag.png';
    poVm.loaded = false;

    $scope.$on('$ionicView.enter', function() {
      if (status === 'submitted') {
        $scope.$emit('update-submitted-provider-orders');
      }
      init();
    });

    $scope.$watch(
      '$parent.providerMainVm.submittedProviderOrders',
      function(submittedProviderOrders){
        if (poVm.tab === 'submitted') {
          poVm.customerOrders = submittedProviderOrders;
        }
      }
    );

    function init(){
      if (status !== 'submitted') {
        getProviderCustomerOrdersStatus(poVm.tab);
      } else {
        poVm.loaded = true;
      }
    }

    function getProviderCustomerOrdersStatus(status){
      ProviderCustomerOrdersService
        .getProviderCustomerOrdersByStatus(status)
        .then(function success(customerOrders){
          poVm.customerOrders = customerOrders;
          poVm.loaded = true;
        }, ErrorHandlerService.handleCommonErrorGET);
    }
  }
})();
