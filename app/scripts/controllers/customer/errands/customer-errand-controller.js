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
                                    CommonService,
                                    ProfileAddressesService,
                                    $ionicScrollDelegate,
                                    ProfileService) {

    var errVm = this;

    errVm.addresses = customerAddresses || [];
    errVm.selectAddress = selectAddressesModal;
    errVm.user = $auth.user;
    errVm.indexSelected = null;
    errVm.errand = {};
    errVm.submitProcess = submitProcess;
    errVm.newAddress = newAddress;

    var inputSelectOptions = {
      0: {
        onClick: newAddress,
        text: 'Agregar Dirección',
        address: null
      },
      1: {
        onClick: function(){},
        address: errVm.addresses[0]
      },
      default: {
        onClick: selectAddressesModal,
        text: 'Seleccionar Dirección',
        address: null
      }
    };

    errVm.inputOptions = inputSelectOptions[errVm.addresses.length] || inputSelectOptions.default;

    function selectAddressesModal() {
      $scope.vm = {
        addresses: errVm.addresses,
        clickAddress: clickAddress,
        addressSelected: errVm.inputOptions.address,
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
      errVm.indexSelected = null;
    }

    function clickAddress(address, index) {
      $scope.vm.addressSelected = address;
    }

    function addAddress(address) {
      errVm.inputOptions.address = address;
      closeModal();
    }

    function newAddress(){
      closeModal().then(function(){
        $scope.pfaVm = {
          closeModal: closeModal,
          processAddress: saveNewAddress,
          defaultInCurrentGeolocation: true
        };
        ModalService.showModal({
          parentScope: $scope,
          fromTemplateUrl: 'templates/profile/addresses/modal-form.html'
        });
      });
    }

    function saveNewAddress(data){
      ProfileAddressesService.createAddresses(data).then(function(response){
        var newCustomerAddress = response.customer_address; //jshint ignore:line
        errVm.addresses.push(newCustomerAddress);
        errVm.inputOptions.address = newCustomerAddress;
        closeModal();
      }, function(error){
        $scope.pfaVm.messages = error.errors;
      });
    }

    function submitProcess() {
      if (needsToAddPhoneNumberOrName()){
        closeModal().then(function(){
          $scope.userAddPhone = {
            closeModal: closeModal,
            submitModal: addPhoneNumber,
            updateProfileForm: {},
            userEdit: angular.copy(errVm.user),
            scrollToBottom: scrollCustomerProfileFormToBottom
          };
          ModalService.showModal({
            parentScope: $scope,
            fromTemplateUrl: 'templates/cart/add-phone-number.html',
          });
        });
      }else {
        sendErrand();
      }
    }

    function scrollCustomerProfileFormToBottom(){
      $ionicScrollDelegate.$getByHandle('customer-profile-form-scroll').scrollBottom(true);
    }

    function needsToAddPhoneNumberOrName(){
      return !errVm.user.phone_number || !errVm.user.name;  //jshint ignore:line
    }

    function addPhoneNumber(user) {
      $ionicLoading.show({
        template: '{{::("globals.updating"|translate)}}'
      });

      ProfileService.editProfile(user)
        .then()
        .finally(function () {
          $ionicLoading.hide().then(function(){
            closeModal().then(function(){
              sendErrand();
            });
          });
        });
    }

    function sendErrand() {
      var errandParams = {
        customer_address_id: errVm.inputOptions.address.id,  //jshint ignore:line
        description: errVm.errand.description
      };
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
      ErrandsService.sendErrand(errandParams)
        .then(function success() {
          CommonService.nextViewIsRoot();
          $state.go('app.services.providers').then(function() {
            closeModal();
            resetValues();
          });
        }, function error() {
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
