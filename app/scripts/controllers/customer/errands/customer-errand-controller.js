(function() {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CustomerErrandController', CustomerErrandController);

  function CustomerErrandController($scope,
    ModalService,
    $auth,
    $state,
    customerAddresses,
    ErrandsService,
    $ionicLoading,
    $ionicPopup,
    CommonService) {
    var errVm = this,
      addresss = customerAddresses;

    errVm.selecAddress = showAddressesModal;
    errVm.user = $auth.user;
    errVm.indexSelected = null;
    errVm.errand = {};
    errVm.submitProcess = submitProcess;

    function showAddressesModal() {
      $scope.vm = {
        user: errVm.user,
        addresses: addresss,
        clickAddress: clickAddress,
        indexSelected: errVm.indexSelected,
        addAddress: addAddress,
        closeModal: closeModal
      };

      ModalService.showModal({
        parentScope: $scope,
        backdropClickToClose: true,
        fromTemplateUrl: 'templates/customer/errands/choose-address.html',
      });
    }

    function closeModal() {
      return ModalService.closeModal();
    }

    function resetValues() {
      errVm.errand = {};
      errVm.addressSelected = null;
      errVm.indexSelected = null;
    }

    function clickAddress(address, index) {
      $scope.vm.indexSelected = index;
      errVm.indexSelected = index;
    };

    function addAddress() {
      errVm.addressSelected = customerAddresses[errVm.indexSelected];
      return ModalService.closeModal();
    };

    function submitProcess() {
      var errandParams = {
        customer_address_id: errVm.addressSelected.id,
        description: errVm.errand.description
      };
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
      ErrandsService.sendErrand(errandParams)
        .then(function success(response) {
          CommonService.nextViewIsRoot();
          $state.go('app.services.providers').then(function() {
            closeModal();
            resetValues();
          });
        }, function error(res) {
          $ionicLoading.hide();
          var message = '{{::("globals.pleaseTryAgain"|translate)}}';
          $ionicPopup.alert({
            title: 'Error',
            template: message
          });
        });
    }
  }
})();
