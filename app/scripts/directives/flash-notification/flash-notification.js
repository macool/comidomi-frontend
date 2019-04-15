(function() {
  'use strict';

  /* jshint validthis:true */
  /* jshint camelcase:false */

  angular
    .module('porttare.directives')
    .directive('flashNotification', flashNotification);

  function flashNotification() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/flash-notification/flash-notification.html',
      scope: {
        options: '='
      },
      controller: [
        '$timeout',
        flashNotificationController
      ],
      controllerAs: 'fnVm',
      bindToController: true
    };

    return directive;
  }

  function flashNotificationController($timeout) {
    var fnVm = this;

    fnVm.options = fnVm.options || {};
    fnVm.message = fnVm.options.message;
    fnVm.cleanOptions = fnVm.options.cleanOptions || emptyFunction;
    fnVm.animate = false;
    fnVm.isHide = false;

    fnVm.close = function() {
      animateOut();
    };

    fnVm.onClick = function() {
      animateOut();
      fnVm.options.onClick = fnVm.options.onClick || emptyFunction;
      fnVm.options.onClick(fnVm.options.data);
    };

    function animateOut() {
      fnVm.animate = true;
      $timeout(function() {
        fnVm.isHide = true;
        fnVm.cleanOptions();
      }, 800); // time animation
    }

    function emptyFunction() {}
  }
})();
