(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('linkButton', linkButton);

  function linkButton() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/link-button/link-button.html',
      scope: {
        onClick: '&',
        text: '@'
      },
      controller: LinkButtonController,
      controllerAs: 'lbVm',
      bindToController: true
    };

    return directive;
  }

  function LinkButtonController() {
    var lbVm = this;

    lbVm.onButtonClick = onButtonClick;

    function onButtonClick() {
      if (lbVm.onClick) {
        lbVm.onClick();
      }
    }
  }
})();
