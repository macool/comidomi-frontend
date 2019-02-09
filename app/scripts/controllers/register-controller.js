(function(){
'use strict';

  angular
    .module('porttare.controllers')
    .controller('RegisterController', RegisterController);

  function RegisterController($ionicLoading,
                              $auth,
                              $ionicPopup,
                              $state,
                              $scope,
                              SessionService,
                              APP) {
    var registerVm = this;
    registerVm.register = register;
    registerVm.loginWithFB = SessionService.loginWithFB;

    function register() {
      if (!registerVm.registerForm.$invalid) {
        $ionicLoading.show({
          template: '{{::("globals.loading"|translate)}}'
        });
        $auth.submitRegistration(registerVm.user)
          .then(function() {
            $state.go(APP.placesState).then(function(){
              registerVm.user = {};
              registerVm.registerForm.$setPristine();
              registerVm.registerForm.$setUntouched();
              $ionicLoading.hide();
            });
          }, function () {
            $ionicLoading.hide();
          });
      }else{
        $ionicPopup.alert({
          title: 'Alerta',
          template: 'Error en el formulario'
        });
      }
    }

    $scope.$on('auth:registration-email-error', function(event, response){
      registerVm.errors = response.errors;
    });

  }
})();
