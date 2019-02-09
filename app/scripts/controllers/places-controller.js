(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('PlacesController', PlacesController);

  function PlacesController(places,
                            $state,
                            $auth,
                            $ionicLoading,
                            $ionicPopup,
                            $ionicHistory,
                            APP,
                            CartService,
                            UserAccountService,
                            GeolocationService,
                            ErrorHandlerService) {
    var placesVm = this;
    placesVm.places = places;
    placesVm.selectPlace = selectPlace;
    placesVm.currentPlaceId = getCurrentPlaceId();
    geolocalizacion();

    function geolocalizacion(){
      if ($auth.user.current_place) { //jshint ignore:line
        return;
      }
      performing('globals.geolocation');
      GeolocationService.getCurrentPosition().then(function success(resp) {
        selectPlaceDistanciaCorta({
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude
        });
      }).catch(function (error) {
        finishedPerforming();
        $ionicPopup.alert({
          title: 'Error',
          template: '<span class="text-pre-line">' + error + '</span>'
        });
      });
    }

    function selectPlaceDistanciaCorta(position){
      var placesByIds = placesVm.places.reduce(function (placesByIds, place){
        place.latitude = place.lat;
        place.longitude = place.lon;
        placesByIds[place.id] = place;
        return placesByIds;
      }, {});
      var distancia = geolib.findNearest(position, placesByIds);
      var attributes = { 'current_place_id' : distancia.key};
      updateUserCart(attributes, 'selectPlaceDistancia');
    }

    function selectPlace(placeId){
      if (placeId !== placesVm.currentPlaceId){
        var attributes = { 'current_place_id' : placeId }; //jshint ignore:line
        performing('globals.updating');
        updateUserCart(attributes, 'selectPlace');
      }else{
        nextViewIsRootView();
        $state.go(APP.successState);
      }
    }

    function updateUserCart(attributes, accionEjecutar){
      updateUser(attributes).then(function(){
        updateCart().then(finishedPerforming).then(function(){
          if(accionEjecutar==='selectPlace'){
            nextViewIsRootView();
            $state.go(APP.successState);
          }else{
            placesVm.currentPlaceId = getCurrentPlaceId();
          }
        });
      });
    }

    function performing(template){
      $ionicLoading.show({
        template: '{{::("'+template+'"|translate)}}'
      });
    }

    function finishedPerforming(){
      return $ionicLoading.hide();
    }

    function getCurrentPlaceId(){
      return $auth.user.current_place_id; // jshint ignore:line
    }

    function updateUser(attributes){
      return UserAccountService
               .updateUser(attributes)
               .then(function (resp) {
                 $auth.user = resp.data;
               })
               .catch(ErrorHandlerService.handleCommonErrorGET);
    }

    function updateCart(){
      return CartService.getCart().then(function(resp){
        $auth.user.customer_order = resp.customer_order; // jshint ignore:line
      });
    }

    function nextViewIsRootView(){
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
    }
  }
})();
