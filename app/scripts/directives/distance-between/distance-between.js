(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('distanceBetween', distanceBetween);

  function distanceBetween(){
    var directive = {
      restrict: 'EA',
      link: distanceBetweenLink,
      controllerAs: 'dbVM',
      bindToController: true,
      controller: distanceBetweenController,
      templateUrl: 'templates/directives/distance-between/distance-between.html',
      scope: {
        toLat: '=',
        toLon: '=',
        fromCoordinates: '='
      }
    };
    return directive;
  }

  function distanceBetweenLink(scope, el, attrs, controller){
    scope.$watch(
      'dbVM.fromCoordinates',
      controller.updateDistance
    );
  }

  function distanceBetweenController(){
    var dbVM = this; // jshint ignore:line
    dbVM.updateDistance = updateDistance;

    function updateDistance(){
      if (!dbVM.fromCoordinates || isBlank(dbVM.toLat) || isBlank(dbVM.toLon)) {
        return;
      }

      var from, to, distanceInM;
      from = {
        latitude: dbVM.fromCoordinates.coords.latitude,
        longitude: dbVM.fromCoordinates.coords.longitude
      };
      to = {
        latitude: dbVM.toLat,
        longitude: dbVM.toLon
      };
      distanceInM = geolib.getDistance(from, to);
      dbVM.distanceInKM = (distanceInM / 1000.0).toFixed(2);
    }
  }

  function isBlank(string){
    return angular.element.isEmptyObject(
      angular.element.trim(string)
    );
  }
})();
