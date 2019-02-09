(function () {
'use strict';

angular
  .module('porttare.directives')
  .directive('providerNotifications', providerNotifications);

function providerNotifications() {
  var directive = {
    restrict: 'EA',
    templateUrl: 'templates/directives/provider-notifications/provider-notifications.html',
    controller: [
      '$scope',
      providerNotificationsController
    ],
    scope: false,
    controllerAs: 'pnVm',
    bindToController: true
  };

  return directive;
}

function providerNotificationsController($scope){
  var pnVm = this; //jshint ignore:line
  $scope.$watch(
    '$parent.providerMainVm.submittedProviderOrders',
    function(submittedProviderOrders){
      pnVm.orders = submittedProviderOrders.length;
    },
    true
  );
}
})();
