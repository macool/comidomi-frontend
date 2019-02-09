'use strict';

angular
  .module('porttare.config')
  .config(coreRoutes);

function coreRoutes($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    controller: 'LoginController',
    controllerAs: 'loginVm',
    templateUrl: 'templates/login/login.html',
    resolve: {
      auth: function(AuthorizationService){
        return AuthorizationService.accessIfUserNotAuth();
      }
    }
  })
  .state('register', {
    url: '/register',
    controller: 'RegisterController',
    controllerAs: 'registerVm',
    templateUrl: 'templates/register/register.html',
    resolve: {
      auth: function(AuthorizationService){
        return AuthorizationService.accessIfUserNotAuth();
      }
    }
  })
  .state('reset', {
    url: '/reset',
    controller: 'ResetController',
    controllerAs: 'resetVm',
    templateUrl: 'templates/reset/reset.html',
    resolve: {
      auth: accessIfUserAuth
    }
  })
  .state('send', {
    url: '/send',
    controller: 'ResetController',
    controllerAs: 'resetVm',
    templateUrl: 'templates/reset/send.html',
    resolve: {
      auth: function(AuthorizationService){
        return AuthorizationService.accessIfUserNotAuth();
      }
    }
  })
  .state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro/intro.html',
    controller: 'IntroController',
    controllerAs: 'introVm',
    resolve: {
      auth: function(AuthorizationService){
        return AuthorizationService.accessIfUserNotAuth();
      }
    }
  })
  .state('prelogin', {
    url: '/prelogin',
    templateUrl: 'templates/prelogin/prelogin.html',
    controller: 'PreController',
    controllerAs: 'preVm',
    resolve: {
      auth: function(AuthorizationService){
        return AuthorizationService.accessIfUserNotAuth();
      }
    }
  })
  .state('error', {
    url: '/error',
    templateUrl: 'templates/error/error.html',
    controller: 'ErrorController',
    controllerAs: 'errVm'
  })
  .state('termsAndCond', {
    url: '/terms-and-conditions',
    templateUrl: 'templates/terms-and-cond/terms-and-cond.html',
    controller: 'TermsAndCondController',
    controllerAs: 'terCondVm',
    resolve: {
      tosHTML: function (TosService) {
        return TosService.getTOSContent();
      }
    }
  })
  .state('disabledUserError', {
    url: '/disabled-user',
    templateUrl: 'templates/error/disabled-user-error.html'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise(function ($injector, $location) {
    if (isResetPassword($location.absUrl())) {
      return '/reset';
    } else {
      return '/prelogin';
    }
  });

  function isResetPassword(href) {
    var param = href.match(/reset_password=([^&]+)/);
    return (param && param[1] === 'true') ? true : false;
  }

  function accessIfUserAuth($auth, $state, APP, $ionicLoading) {
    return $auth.validateUser()
      .then(function userAuthorized() {
        return $state.go(APP.successState).then(function(){
          $ionicLoading.hide();
        });
      }, function userNotAuthorized() {
        return;
    });
  }

}
