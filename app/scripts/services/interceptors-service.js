'use strict';

angular
  .module('porttare.services')
  .factory('InterceptorsService', InterceptorsService);

function InterceptorsService($injector, $q) {
  var service = {
    responseError: responseError
  };
  var currentAlert;

  return service;

  function responseError(rejection) {
    if (rejection.status === 401 && !isIgnoredUrl(rejection.config.url)) {
      clearHistory();
      closeCurrentAlert();
      createAlert(rejection.data);
    }
    return $q.reject(rejection);
  }

  function isIgnoredUrl(url){
    var ignoredURIs = [
      'api/auth/user/sign_in',
      'api/auth/user/validate_token'
    ];
    return ignoredURIs.some(function(ignoredURI){
      return url.match(ignoredURI);
    });
  }

  function createAlert(data) {
    var errorsStr;
    if (data.errors) {
      errorsStr = data.errors.join(', ');
    }

    $injector.get('$ionicHistory').clearHistory();

    currentAlert = $injector.get('$ionicPopup').alert({
      title: 'Ups!',
      template: errorsStr || '{{ ::("globals.somethingWentWrong" | translate)}}'
    });
    currentAlert.then(dismissedAlert);
  }

  function unsetCurrentAlert() {
    currentAlert = null;
  }

  function closeCurrentAlert() {
    if (currentAlert) {
      currentAlert.close();
    }
  }

  function clearHistory(){
    $injector.get('$ionicHistory').clearHistory();
  }

  function dismissedAlert(){
    unsetCurrentAlert();
    $injector.get('$auth').validateUser().then(function(){
      $injector.get('$state').go('app.categories.index');
    }, function(){
      $injector.get('$state').go('prelogin');
    });
  }
}
