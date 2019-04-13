(function () {
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

    fnVm.message = fnVm.options.message;
    fnVm.animate = false;
    fnVm.isHide = false;

    fnVm.close = function(){
      fnVm.animate = true;
      $timeout(function(){
        fnVm.isHide = true;
      }, 800); // time animation
    }
  }
})();
