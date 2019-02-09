(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('actionButton', actionButton);

  function actionButton() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/action-button/action-button.html',
      scope: {
        onClick: '&',
        text: '@',
        color: '@',
        type: '@',
        ngDisabled: '='
      },
      controller: ActionButtonController,
      controllerAs: 'abVm',
      bindToController: true
    };

    return directive;
  }

  function ActionButtonController() {
    var abVm = this;
    abVm.onButtonClick = onButtonClick;
    abVm.customColor = abVm.color || 'yellow';

    function onButtonClick() {
      if (abVm.onClick) {
        abVm.onClick();
      }
    }
  }
})();
