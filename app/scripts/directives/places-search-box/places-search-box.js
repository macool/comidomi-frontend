(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('placesSearchBox', placesSearchBox);

  function placesSearchBox() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/places-search-box/places-search-box.html',
      scope: {
        map: '=',
        markers: '='
      },
      controller: placesSearchBoxController,
      controllerAs: 'psbVm',
      bindToController: true
    };

    return directive;
  }

  function placesSearchBoxController()
  {

    var psbVm = this;// jshint ignore:line
    psbVm.markers = [];
    loadPlacesSearchBox();
    psbVm.disableTap = disableTap;

    function loadPlacesSearchBox() {
      var input = document.getElementById('input-places');
      var placesSearchBox = new google.maps.places.SearchBox(input);
      psbVm.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

      placesSearchBox.addListener('places_changed', function () {
        var places = placesSearchBox.getPlaces();
        if (places.length === 0) {
          return;
        }
        // Clear out the old psbVm.markers.
        psbVm.markers.forEach(function (marker) {
          marker.setMap(null);
        });
        psbVm.markers = [];
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
          psbVm.markers.push(new google.maps.Marker({
            map: psbVm.map,
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
        psbVm.map.fitBounds(bounds);
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
