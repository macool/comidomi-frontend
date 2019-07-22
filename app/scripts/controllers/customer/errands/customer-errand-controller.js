(function() {
  'use strict';
  /*jshint camelcase:false */

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
                                    $ionicHistory,
                                    $ionicScrollDelegate,
                                    ProfileService) {

    var errVm = this;

    errVm.addresses = customerAddresses;
    errVm.user = $auth.user;
    errVm.errand = {};
    errVm.address = customerAddresses.length === 1 ? customerAddresses[0] : null;
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
      ErrandsService.sendErrand(errandParams)
        .then(function success(resp) {
          console.log(resp);
          closeModal();
          $scope.checkout = {
            closeModal: closeModal,
            order: resp.customer_errand,
            feedbackText: 'modals.errand_checkout.feedback',
            goToProviders: {
              onClick: goToProviders,
              text: 'modals.errand_checkout.goToProviders',
            },
            goToOrder:{
              onClick: goToOrder,
              text: 'modals.errand_checkout.goToOrder',
            },
            total: {
              text: 'modals.errand_checkout.total',
              value: resp.customer_errand.shipping_fare_price_cents
            }
          };
          ModalService.showModal({
            parentScope: $scope,
            fromTemplateUrl: 'templates/modal-actions/checkout.html',
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

    function goToOrder(order) {
      nextViewIsRoot();
      $state.go('app.errands.show', {
        id: order.id,
        customerOrder: order
      }).then(function () {
          $auth.user.customer_order = null;
          resetValues();
          closeModal();
        });
    }

    function goToProviders() {
      nextViewIsRoot();
      $state.go('app.services.providers', {}).then(function () {
        $auth.user.customer_order = null;
        resetValues();
        closeModal();
      });
    }

    function nextViewIsRoot(){
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
    }
  }
})();
