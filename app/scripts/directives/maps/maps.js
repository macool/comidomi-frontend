(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('maps', maps);

  function maps(MapsService) {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/maps/maps.html',
      scope: {
        lat: '=?',
        lon: '=?',
        onRender: '&',
        direccion:'=?',
        referencia: '=?',
        disableEdit: '=?',
        direccionDos: '=?',
        currentLocation: '=?',
        geolocationMessageKey: '=?',
        defaultInCurrentGeolocation: '='
      },
      controller: [ '$scope',
                    'MapsService',
                    'GeocodingService',
                    'GeolocationService',
                    mapsController],
      controllerAs: 'mapVm',
      link: linkFunction,
      bindToController: true
    };

    return directive;

    function linkFunction($scope, $element, $attributes, $controller){
      MapsService.loadGMaps().then(function () {
        $scope.mapVm.geolocationMessageKey = null;
        var mapContainer = $element[0].children[0].children[0];
        $scope.mapVm.map = MapsService.renderMap(mapContainer);
        $controller.listenForChange();
        $controller.setCurrentPosition();
      });
    }

  }

  function mapsController($scope,
                          MapsService,
                          GeocodingService,
                          GeolocationService) {
    var mapVm = this, // jshint ignore:line
        shouldGeocodeMarkerPosition;

    mapVm.listenForChange = listenForChange;
    mapVm.setCurrentPosition = setCurrentPosition;

    init();

    function init(){
      shouldGeocodeMarkerPosition = angular.element.isEmptyObject(
        angular.element.trim(mapVm.direccion)
      );

      mapVm.geolocationMessageKey = 'maps.loading';
    }

    function setCurrentPosition(){
      if (mapVm.onRender) {
        mapVm.onRender({map: mapVm.map});
      }
      if (mapVm.defaultInCurrentGeolocation) {
        GeolocationService
          .getCurrentPosition()
          .then(function (position){
            mapVm.currentLocation = position;
            drawMakerFromGeoPosition(position);
            assignLatAndLon();
            geocodeCurrentPosition();
          }).catch(couldntGetPosition);
      } else {
        drawMakerFromGeoPosition({
          coords: {
            latitude: mapVm.lat,
            longitude: mapVm.lon
          }
        });
      }
    }

    function assignLatAndLon(){
      mapVm.lat = mapVm.currentMarker.getPosition().lat();
      mapVm.lon = mapVm.currentMarker.getPosition().lng();
    }

    function drawMakerFromGeoPosition(position){
      if (mapVm.currentMarker) { return; }
      var positionLatLng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      return drawMarker(positionLatLng);
    }

    function drawMarker(positionLatLng){
      mapVm.map.panTo(positionLatLng);
      mapVm.currentMarker = MapsService.displayMarker(
        mapVm.map,
        positionLatLng
      );
    }

    function couldntGetPosition(message) {
      mapVm.mapError = message;
    }

    function listenForChange(){
      if (mapVm.disableEdit) { return; }
      mapVm.map.addListener('click', function (changeEvent) {
        clearErrorMessages();
        clearCurrentMarker();
        drawMarker(changeEvent.latLng);

        $scope.$apply(assignLatAndLon);

        if (shouldGeocodeMarkerPosition) {
          geocodeCurrentPosition();
        }
      });
    }

    function geocodeCurrentPosition(){
      mapVm.geolocationMessageKey = 'maps.geocoding';
      GeocodingService
        .geocode({'latLng': mapVm.currentMarker.getPosition()})
        .then(function(results){
          mapVm.geolocationMessageKey = 'maps.geocoded';
          // jshint ignore:start
          mapVm.direccion = results[0].formatted_address;
          mapVm.direccionDos = results[1].formatted_address;
          // jshint ignore:end
          mapVm.referencia = getReferencia(results[0]);
        })
        .catch(function(error){
          if (error === 'OVER_QUERY_LIMIT') {
            mapVm.geolocationMessageKey = 'maps.overGeocodeLimit';
          } else {
            mapVm.geolocationMessageKey = 'maps.wontGeocode';
            console.error(error);
          }
        });
    }

    function clearErrorMessages(){
      mapVm.mapError = null;
    }

    function clearCurrentMarker(){
      if (mapVm.currentMarker) {
        mapVm.currentMarker.setMap(null);
        mapVm.currentMarker = null;
      }
    }

    function getReferencia(geolocationResult){
      var components = geolocationResult.address_components; //jshint ignore:line
      var cityComponent = components.find(function(component){
        return component.types.includes('political');
      });
      return cityComponent && cityComponent.long_name; // jshint ignore:line
    }
  }
})();
