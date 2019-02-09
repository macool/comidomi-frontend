(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('showError', showError);

  function showError() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'templates/directives/show-error/show-error.html',
      controller: ShowErrorController,
      scope: {
        arrayMessages: '=',
        element: '=',
        message: '='
      },
      controllerAs: 'seVm',
      bindToController: true
    };

    return directive;
  }
  function ShowErrorController() {}
})();
