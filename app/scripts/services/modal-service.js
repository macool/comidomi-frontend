(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('ModalService', ModalService);

  function ModalService($q, $ionicModal) {

    var service = {
      showModal: showModal,
      closeModal: closeModal
    };

    var arrayModalInstance = [];

    return service;

    function showModal(options){

      var myOptions = {
        focusFirstInput: false,
        animation: 'slide-in-up',
        backdropClickToClose: true,
        hardwareBackButtonClose: true
      };
      var modalInstance = {
        scope: null
      };

      angular.extend(myOptions, options);

      modalInstance.scope = myOptions.parentScope;

      return $ionicModal.fromTemplateUrl(myOptions.fromTemplateUrl, {
        scope: modalInstance.scope,
        animation: myOptions.animation,
        focusFirstInput: myOptions.focusFirstInput,
        backdropClickToClose: myOptions.backdropClickToClose
      }).then(function(modal){
        modalInstance.scope.modal = modal;
        arrayModalInstance.push(modalInstance);
        modalInstance.scope.modal.show();
        return modal;
      });
    }

    function closeModal(){
      var currentModalInstance = arrayModalInstance.pop() || {};
      if (currentModalInstance.scope && currentModalInstance.scope.modal) {
        return currentModalInstance.scope.modal.remove().then(function () {
          currentModalInstance.scope = null;
        });
      } else {
        return $q.resolve();
      }
    }
  }
})();
