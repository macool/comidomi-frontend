(function(){
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('IntroController', IntroController);

  function IntroController($state,
                           $rootScope,
                           $localStorage,
                           $ionicSlideBoxDelegate) {
    var introVm = this;
    introVm.startApp = startApp;
    introVm.next = next;
    introVm.previous = previous;
    introVm.slideChanged = slideChanged;

    document.addEventListener('deviceready', traslucentStatusBar, false);

    function traslucentStatusBar() {
      // this view is dark. make status bar visible
      if (window.StatusBar) {
        window.StatusBar.backgroundColorByName('black');
        window.StatusBar.styleBlackTranslucent();
      }
    }

    function normalStatusBar() {
      $rootScope.$emit('porttare:styleDefaultStatusBar');
    }

    function startApp() {
      $localStorage.setItem('hasViewedTutorial','true');
      $state.go('prelogin').then(normalStatusBar);
    }

    function next() {
      $ionicSlideBoxDelegate.next();
    }

    function previous() {
      $ionicSlideBoxDelegate.previous();
    }

    function slideChanged(index) {
      introVm.slideIndex = index;
    }
  }
})();
