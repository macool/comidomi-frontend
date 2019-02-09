(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('MapsService', MapsService);

  function MapsService($q,
                       $auth,
                       $window,
                       $ionicPopup,
                       GeocodingService,
                       ENV) {
    var service = {
      loadGMaps: loadGMaps,
      renderMap: renderMap,
      displayMarker: displayMarker
    };
    var loadDefered,
        gmapsLoaded;

    return service;

    function loadGMaps() {
      if (gmapsLoaded) {
        return $q.resolve();
      } else {
        loadDefered = $q.defer();
        appendGMapsScript();
        return loadDefered.promise;
      }
    }

    function appendGMapsScript() {
      $window.gMapsCallback = function() { gMapsCallback(); };
      var libraries = 'places';
      var gMapsUrl = 'https://maps.google.com/maps/api/js?libraries=' + libraries + '&callback=gMapsCallback&key=';
      var script = document.createElement('script');
      script.src = gMapsUrl + ENV.gMapsKey;
      script.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(script);
    }

    function gMapsCallback(){
      gmapsLoaded = true;
      loadDefered.resolve();
      removeGMapsCallback();
    }

    function removeGMapsCallback(){
      delete $window.gMapsCallback;
    }

    function renderMap(domElement) {
      return new google.maps.Map(
        domElement,
        mapOptionsDefault()
      );
    }

    function displayMarker(map, marker){
      return new google.maps.Marker({
        map: map,
        position: marker
      });
    }

    function mapOptionsDefault(){
      return {
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        disableDefaultUI: true,
        center: mapPositionDefault()
      };
    }

    function mapPositionDefault(){
      var currentPlace = $auth.user.current_place; // jshint ignore:line
      return new google.maps.LatLng(currentPlace.lat, currentPlace.lon);
    }

  }
})();
