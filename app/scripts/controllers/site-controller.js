(function(){
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('SiteController', SiteController);

  function SiteController($rootScope,
                          $ionicLoading,
                          $auth,
                          ProfileService) {
    var siteVm = this,
        currentUser = null;

    siteVm.userName = null;
    siteVm.userImageURL = null;
    siteVm.providerImageURL = null;

    $rootScope.$on('auth:login-success', userLoggedIn);
    $rootScope.$on('auth:validation-success', userLoggedIn);

    $rootScope.$on('$stateChangeSuccess', finishedLoading);
    $rootScope.$on('$stateChangeError', finishedLoading);

    $rootScope.$on('$stateChangeStart', function(){
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
    });

    $rootScope.$on('currentUserUpdated',function(event, updatedCurrentUser){
      currentUser = updatedCurrentUser;
      updateProperties();
    });

    $rootScope.$on('currentProfileProviderUpdated',function(event, updatedCurrentProfileProvider){
      currentUser.provider_profile = updatedCurrentProfileProvider;//jshint ignore:line
      updatePropertiesProfileProvider();
    });

    function finishedLoading(){
      return $ionicLoading.hide();
    }

    function userLoggedIn(){
      currentUser = $auth.user;
      updateProperties();
      updatePropertiesProfileProvider();
    }

    function userName () {
      if (currentUser) {
        var attributes = [
          'name',
          'nickname',
          'email'
        ];
        var presentAttribute = attributes.find(function(attribute) {
          return !angular.element.isEmptyObject(
            angular.element.trim(currentUser[attribute])
          );
        });
        return currentUser[presentAttribute];
      }
    }

    function providerImageUrl (){
      if (currentUser.provider_profile) {//jshint ignore:line
        return currentUser.provider_profile.logotipo_url;//jshint ignore:line
      }
    }

    function getUserImageURL(){
      return ProfileService.getUserImageURL(currentUser);
    }

    function updateProperties(){
      siteVm.userName = userName();
      siteVm.userImageURL = getUserImageURL();
    }

    function updatePropertiesProfileProvider(){
      siteVm.providerImageURL = providerImageUrl();
    }
  }
})();
