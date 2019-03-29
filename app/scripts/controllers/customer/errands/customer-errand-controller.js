(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CustomerErrandController', CustomerErrandController);

  function CustomerErrandController($scope,
                                    ModalService,
                                    $auth,
                                    customerAddresses) {
    var customerErrandVm = this;

    customerErrandVm.selecAddress = showAddressesModal;
    customerErrandVm.user = $auth.user;
    customerErrandVm.indexSelected = null;

    console.log(customerAddresses);

    function showAddressesModal(){
      $scope.vm = {
        user: customerErrandVm.user,
        addresses: customerAddresses,
        clickAddress: clickAddress,
        indexSelected: customerErrandVm.indexSelected,
        closeModal: function(){
          return ModalService.closeModal();
        }
      };
      console.log($scope.cartVm);

      ModalService.showModal({
        parentScope: $scope,
        backdropClickToClose: true,
        fromTemplateUrl: 'templates/customer/errands/choose-address.html',
      });
    }

    function clickAddress(address, index){
      address.active = !address.active;
      $scope.vm.indexSelected = index;
    };
  }
})();
