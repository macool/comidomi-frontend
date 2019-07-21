(function () {
  'use strict';

  /* jshint validthis:true */
  /* jshint camelcase:false */

  angular
    .module('porttare.directives')
    .directive('lunchCard', lunchCard);

  function lunchCard() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/lunch-card/lunch-card.html',
      scope: {
        lunch: '='
      },
      controller: [
        lunchCardController
      ],
      controllerAs: 'lcVm',
      bindToController: true
    };

    return directive;
  }

  function lunchCardController() {
    var lcVm = this;
    console.log('lcVm: ', lcVm);
    lcVm.lunch = lcVm.lunch || {};
    lcVm.getTime = getTime;

    function getTime(date){
      return date ? moment(date).format('h:mm a') : 'N/A';
    }
  }
})();
