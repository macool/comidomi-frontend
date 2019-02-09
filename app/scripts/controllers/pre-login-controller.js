'use strict';

angular
  .module('porttare.controllers')
  .controller('PreController', PreController);

function PreController($auth,
                      $state,
                      $ionicPopup,
                      $localStorage,
                      SessionService,
                      $location,
                      APP) {
  var preVm = this;
  preVm.loginWithFB = SessionService.loginWithFB;
  var successState = APP.successState;

  function load(){
    if (!$localStorage.getItem('hasViewedTutorial')) {
      $state.go('intro');
    }
    $auth.validateUser().then(function(){
      $state.go(successState);
    }).catch(function () {
      var url = $location.absUrl();
      if(url.match(/error=access_denied&error_code=([^&]+)/)){
        $ionicPopup.alert({
          title: 'Error',
          template: '{{::("login.unauthorized"|translate)}}'
        });
      }
    });
  }

  load();

}
