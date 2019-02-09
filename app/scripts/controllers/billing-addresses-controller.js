(function () {
'use strict';

  angular
    .module('porttare.controllers')
    .controller('BillingAddressesController', BillingAddressesController);

  function BillingAddressesController(BillingAddressesService,
                                      ModalService,
                                      ErrorHandlerService,
                                      $scope,
                                      $ionicPopup,
                                      $ionicLoading,
                                      $auth) {
    var billingAddressesVm = this;
    var billingAddressesIndex;

    billingAddressesVm.showNewModal = showNewModal;
    billingAddressesVm.showEditModal = showEditModal;
    billingAddressesVm.closeModal = closeModal;
    billingAddressesVm.submitModal = submitModal;
    getBillingAddresses();

    function getBillingAddresses() {
      BillingAddressesService.getBillingAddresses().then(function(billingAddresses){
        billingAddressesVm.billingAddresses = billingAddresses;
      }, ErrorHandlerService.handleCommonErrorGET);
    }

    function showNewModal() {
      billingAddressesVm.billingAddress = {};
      billingAddressesVm.billingAddress.email = $auth.user.email;
      billingAddressesVm.billingAddress.ciudad = $auth.user.ciudad;
      if ($auth.user.provider_profile){ // jshint ignore:line
        billingAddressesVm.billingAddress.ruc = $auth.user.provider_profile.ruc;// jshint ignore:line
        billingAddressesVm.billingAddress.razon_social = $auth.user.provider_profile.razon_social;// jshint ignore:line
        billingAddressesVm.billingAddress.telefono = $auth.user.provider_profile.telefono;// jshint ignore:line
      }
      showNewEditModal();
    }

    function showEditModal(item, index) {
      billingAddressesIndex = index;
      billingAddressesVm.billingAddress = angular.copy(item);
      showNewEditModal();
    }

    function showNewEditModal(){
      ModalService.showModal({
        parentScope: $scope,
        fromTemplateUrl: 'templates/billing-addresses/new-edit.html',
        focusFirstInput: false
      });
    }

    function closeModal() {
      ModalService.closeModal();
      billingAddressesVm.messages = {};
    }

    function submitModal(){
      if(billingAddressesVm.form.$valid){
        billingAddressesVm.billingAddress.id ? updateBillingAddress():saveBillingAddress();// jshint ignore:line
      }
    }

    function saveBillingAddress(){
      $ionicLoading.show({
        template: '{{::("globals.saving"|translate)}}'
      });
      BillingAddressesService.createBillingAddress(billingAddressesVm.billingAddress).then(function success(resp){
        $ionicLoading.hide().then(function(){
          billingAddressesVm.billingAddresses.push(resp.customer_billing_address); //jshint ignore:line
          $ionicPopup.alert({
            title: 'Éxito',
            template: '{{::("billingAddress.successSave"|translate)}}'
          }).then(function(){
            closeModal();
          });
        });
      }, error);
    }

    function  updateBillingAddress(){
      $ionicLoading.show({
        template: '{{::("globals.updating"|translate)}}'
      });
      BillingAddressesService.updateBillingAddress(billingAddressesVm.billingAddress).then(function success(resp){
        $ionicLoading.hide().then(function(){
          billingAddressesVm.billingAddresses[billingAddressesIndex] = resp.customer_billing_address; //jshint ignore:line
          $ionicPopup.alert({
            title: 'Éxito',
            template: '{{::("billingAddress.successUpdate"|translate)}}'
          }).then(function(){
            closeModal();
          });
        });

      }, error);
    }

    function error(res){
      billingAddressesVm.messages = res.status===422 ? res.data.errors:undefined;
      $ionicLoading.hide();
    }

  }
})();
