(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('humanizedCountdownTime', humanizedCountdownTime);

  function humanizedCountdownTime(){
    var directive = {
      restrict: 'E',
      bindToController: true,
      controllerAs: 'countdownTimeVM',
      link: humanizedCountdownTimeLink,
      controller: [
        '$timeout',
        humanizedCountdownTimeController
      ],
      scope: {
        time: '=',
        showPast: '=?',
        hidePrefix: '=?'
      },
      templateUrl: 'templates/directives/humanized-countdown-time/humanized-countdown-time.html'
    };
    return directive;
  }

  function humanizedCountdownTimeController($timeout){
    var timeoutId,
        interval = 10 * 60 * 60,
        // jshint validthis:true
        countdownTimeVM = this;
    countdownTimeVM.computeTimeStr = computeTimeStr;
    countdownTimeVM.clearComputeTimeout = clearComputeTimeout;

    function computeTimeStr() {
      var now = moment(),
          deliveryTime = moment(countdownTimeVM.time),
          inFuture = deliveryTime.diff(now) > 0;
      if (inFuture || countdownTimeVM.showPast) {
        setTimeStr(deliveryTime);
        clearComputeTimeout();
        timeoutId = $timeout(computeTimeStr, interval);
      }
    }

    function clearComputeTimeout(){
      if (timeoutId) {
        $timeout.cancel(timeoutId);
        timeoutId = null;
      }
    }

    function setTimeStr(deliveryTime){
      countdownTimeVM.timeStr = deliveryTime.fromNow(
        countdownTimeVM.hidePrefix
      );
    }
  }

  function humanizedCountdownTimeLink(scope, el, attrs, controller){
    scope.$watch('countdownTimeVM.time', function(){
      controller.computeTimeStr();
    });

    el.on('$destroy', controller.clearComputeTimeout);
  }
})();
