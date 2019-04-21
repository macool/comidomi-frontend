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
                                    $ionicScrollDelegate,
                                    ProfileService) {

    var errVm = this;

    errVm.addresses = customerAddresses;
    errVm.user = $auth.user;
    errVm.errand = {};
    errVm.address = null;
    errVm.submitProcess = submitProcess;
    errVm.onSelectedAddress = onSelectedAddress;

    function onSelectedAddress(address) {
      errVm.address = address;
    }

    function closeModal() {
      return ModalService.closeModal();
    }

    function resetValues() {
      errVm.errand = {};
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
        customer_address_id: errVm.address.id,  //jshint ignore:line
        description: errVm.errand.description
      };
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
      ErrandsService.sendErrand(errandParams)
        .then(function success(resp) {
          $state.go('app.errands.show', {
            id: resp.customer_errand.id //jshint ignore:line
          }).then(function() {
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
