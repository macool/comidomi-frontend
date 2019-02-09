(function () {
'use strict';

  angular
    .module('porttare')
    .config(ionicConfig);

  function ionicConfig($ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.scrolling.jsScrolling(true);
    $ionicConfigProvider.backButton.icon(backButtonIcon());
    $ionicConfigProvider.backButton.text(false);

    function backButtonIcon() {
      if (window.ionic.Platform.isIOS()) {
        return 'ion-ios-arrow-back';
      } else {
        return 'ion-android-arrow-back';
      }
    }
  }
})();
