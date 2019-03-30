(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CustomerErrandController', CustomerErrandController);

  function CustomerErrandController($scope,
                                    ModalService,
                                    $auth,
                                    customerAddresses,
                                    ErrandsService) {
    var errVm = this;

    errVm.selecAddress = showAddressesModal;
    errVm.user = $auth.user;
    errVm.indexSelected = null;
    errVm.errand = {};
    errVm.submitProcess = submitProcess;

    console.log(customerAddresses);

    function showAddressesModal(){
      $scope.vm = {
        user: errVm.user,
        addresses: customerAddresses,
        clickAddress: clickAddress,
        indexSelected: errVm.indexSelected,
        addAddress: addAddress,
        closeModal: function(){
          return ModalService.closeModal();
        }
      };

      ModalService.showModal({
        parentScope: $scope,
        backdropClickToClose: true,
        fromTemplateUrl: 'templates/customer/errands/choose-address.html',
      });
    }

    function clickAddress(address, index){
      $scope.vm.indexSelected = index;
      errVm.indexSelected = index;
    };

    function addAddress(){
      errVm.addressSelected = customerAddresses[errVm.indexSelected];
      console.log(errVm.addressSelected.direccion_uno);
      return ModalService.closeModal();
    };

    function submitProcess(){
      errVm.errand.customer_address_id = errVm.addressSelected.id;
      console.log('errVm.errandForm: ', errVm.errand);
      ErrandsService.sendErrand(errVm.errand);
    }
  }
})();
