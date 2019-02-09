(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('backButton', backButton);

  function backButton() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'templates/directives/back-button/back-button.html',
      controller: ['$window', BackButtonController],
      controllerAs: 'bbVm',
      bindToController: true
    };

    return directive;
  }

  function BackButtonController($window) {
    var bbVm = this;
    bbVm.goBack = goBack;

    function goBack() {
      $window.history.back();
    }
  }
})();
