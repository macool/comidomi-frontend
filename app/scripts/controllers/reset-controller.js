(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ResetController', ResetController);

  function ResetController( $ionicLoading,
                            $auth,
                            $ionicPopup,
                            $state,
                            $rootScope,
                            $window,
                            APP) {

    var resetVm = this;
    resetVm.updatePassword = updatePassword;
    resetVm.resetPassword = resetPassword;
    resetVm.updatePasswordForm = {};
    resetVm.resetPasswordForm = {};
    resetVm.messages = {};
    var successState = APP.successState;
    var loginState = 'login';

    $rootScope.$on('auth:password-change-error', function (event, data) {
      resetVm.messages = data.errors;
    });

    $rootScope.$on('auth:password-change-success', function () {
      $window.location.href = '/' + $state.href(successState);
    });

    function resetPassword() {
      $ionicLoading.show({
        template: 'enviando...'
      });

      $auth.requestPasswordReset(resetVm.resetPasswordForm)
        .then(function () {
          $state.go(loginState).then(function () {
            $ionicLoading.show({
              template: 'Se enviaron las intrucciones al correo.',
              noBackdrop: true,
              duration: 2000
            });
          });
        })
        .catch(function (err) {
          var messsage = err.data ? err.data.errors[0] :
            'Hubo un error enviando la información.';
          $ionicPopup.alert({
            title: 'Error',
            template: messsage
          });
        })
        .finally(function () {
          $ionicLoading.hide();
        });
    }

    function updatePassword() {
      $ionicLoading.show({
        template: 'cargando...'
      });
      $auth.updatePassword(resetVm.updatePasswordForm)
        .finally(function () {
          $ionicLoading.hide();
        });
    }

  }
})();
