(function () {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('ProviderController', ProviderController);

  function ProviderController(providerCategories,
                              ProviderService,
                              $ionicPopup,
                              $state,
                              $auth,
                              $filter,
                              $ionicLoading,
                              $ionicScrollDelegate) {
    var providerVm = this;
    initProvider();

    var stateRedirect = 'provider.items.index';
    providerVm.submit = submit;
    providerVm.step = 1;
    providerVm.paymentMethods = [];
    providerVm.matrizProvider = {};
    providerVm.touchedPayments = false;
    providerVm.removeImage = removeImage;
    providerVm.providerCategories = providerCategories;

    function initProvider(){
      providerVm.provider = {};
      providerVm.provider.representante_legal = $auth.user.name;
      providerVm.provider.email = $auth.user.email;
    }

    function removeImage(){
      providerVm.provider.logotipo = null;
    }

    function createProvider() {
      $ionicLoading.show({
        template: 'enviando...'
      });

      var objectToSend = providerVm.provider;
      objectToSend.formas_de_pago = providerVm.paymentMethods;

      ProviderService.createNewProvider(objectToSend)
        .then(function success(provider) {
          //update auth user
          $auth.user.provider_profile = provider.provider_profile;
          $ionicLoading.hide();
          $state.go(stateRedirect).then(function(){
            $ionicPopup.alert({
              title: '¡felicidades, te hemos registrado!',
              template: 'Tu perfil será revisado. Te notificaremos cuando activemos tu perfil.'
            });
          });
        },
        function error(responseError) {
          providerVm.errors = responseError.errors;
          $ionicLoading.hide();
          providerVm.step = 1;
        });
    }

    function submit() {
      if(providerVm.step === 2){
        createProvider();
      }
      providerVm.step += 1;
      $ionicScrollDelegate.scrollTop();
    }
  }
})();
