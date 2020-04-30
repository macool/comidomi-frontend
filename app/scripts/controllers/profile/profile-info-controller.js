(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProfileInfoController', ProfileInfoController);

  function ProfileInfoController($auth,
                                 ModalService,
                                 ProfileService,
                                 $ionicLoading,
                                 $ionicPopup,
                                 $scope) {
    var piVm = this;

    var options = [
      {
        icon: 'person_pin_circle',
        text: 'Direcciones',
        sref: 'app.profile.addresses.index'
      },
      {
        icon: 'insert_drive_file',
        text: 'Facturación',
        sref: 'app.billing.addresses'
      }
    ];

    piVm.tab = 'info';
    piVm.showNewModal = showNewModal;
    piVm.closeModal = closeModal;
    piVm.submitProcess = submitProcess;
    piVm.messages = {};
    piVm.hasImageFile = hasImageFile;

    init();

    function init(){
      piVm.user = $auth.user;
      piVm.canChangePassword = piVm.user.provider === 'email';
      piVm.options = options;
    }

    function showNewModal() {
      piVm.user = $auth.user;

      piVm.userEdit = angular.copy(piVm.user);
      ModalService.showModal({
        parentScope: $scope,
        fromTemplateUrl: 'templates/profile/info/edit.html'
      });
    }

    function closeModal() {
      piVm.messages = {};
      ModalService.closeModal();
    }

    function submitProcess(user){
      ProfileService.editProfile(user)
        .then(function(resp) {
          piVm.user = resp.data.data;
          $scope.$emit('currentUserUpdated', piVm.user);

          var options = {
            mainText: 'modals.success.billing.updated.mainText',
            secondaryText: 'modals.success.billing.updated.secondaryText',
            continue: {
              onClick: function(){
                closeModal();
              },
              text: 'modals.success.billing.updated.btnContinue',
            }
          };
          showSuccessModal(options);
        })
        .finally(function () {
          $ionicLoading.hide();
        });
    }

    $scope.$on('auth:account-update-error', function(ev, reason) {
      if (reason && reason.errors) {
        piVm.messages = reason.errors;
      }
      $ionicPopup.alert({
        title: 'Error',
        template:'{{::("globals.pleaseTryAgain"|translate)}}'
      });
    });

    function hasImageFile(user){
      return ProfileService.hasImageFile(user);
    }

    function showSuccessModal(options) {
      closeModal();
      $scope.action = options;
      ModalService.showModal({
        parentScope: $scope,
        fromTemplateUrl: 'templates/modal-actions/success.html',
      });
    }
  }
})();
