(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('MapController', MapController);

  function MapController($ionicLoading,
                        $ionicPopup,
                        GeolocationService,
                        MapsService)
  {

    var mapVm = this;
    mapVm.disableTap = disableTap;

    showGMap();

    function showGMap() {
      $ionicLoading.show({
        template: 'cargando...'
      });
      MapsService.loadGMaps().then(function(){
        GeolocationService
          .getCurrentPosition()
          .then(
          function onSuccess(position) {
            var map = loadMap(position, true);
            loadPlacesSearchBox(map);
            $ionicLoading.hide();
          },
          function onError(err) {
            $ionicLoading.hide();
            var message = null;
            // Use default coordinate (Loja)
            var defaultPosition = {
              coords: {
                latitude: -4.0078909,
                longitude: -79.21127690000003
              }
            };

            if (!err && !err.code) {
              // Unknown error
              showUnknownError();
              return;
            }

            switch (err.code) {
              case 1:
                message = 'Denegada la peticion de Geolocalización.';
                break;
              case 2:
                message = 'No se ha encontrado la ubicación especificada.';
                break;
              case 3:
                message = 'El tiempo de petición ha expirado.';
                break;
            }

            if (!message) {
              // Unknown error
              showUnknownError();
            } else {
              handleLocationError(message, defaultPosition, false);
            }
          }
        );
      });
    }

    function showUnknownError() {
      $ionicPopup.alert({
        title: 'Error',
        template: 'Hubo un error desconocido al cargar el mapa.'
      });
    }
    function handleLocationError(message, position, useMarker) {
      var map = loadMap(position, useMarker);
      loadPlacesSearchBox(map);
      $ionicPopup.alert({
        title: 'Error',
        template: message
      });
    }

    function loadMap(position, useMarker) {
      // TODO use MapsService
      var lat = position.coords.latitude;
      var long = position.coords.longitude;

      var latLng = new google.maps.LatLng(lat, long);

      var mapOptions = {
        center: latLng,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.VERTICAL_BAR,
          position: google.maps.ControlPosition.LEFT_BOTTOM
        }
      };

      var map = new google.maps.Map(document.getElementById('map'), mapOptions);

      // Only when the Geolocation is active
      if (useMarker) {
        new google.maps.Marker({
          position: latLng,
          map: map
        });
      }
      return map;
    }

    function loadPlacesSearchBox(map) {
      var input = document.getElementById('input-places');
      var placesSearchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

      var markers = [];

      placesSearchBox.addListener('places_changed', function () {
        var places = placesSearchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    }

    function disableTap() {
      var container = document.getElementsByClassName('pac-container');
      angular.element(container).attr('data-tap-disabled', 'true');
      angular.element(container).on('click', function(){
          document.getElementById('input-places').blur();
      });
    }
  }
})();
