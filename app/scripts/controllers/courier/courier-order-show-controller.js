(function () {
  'use strict';
  angular
    .module('porttare.controllers')
    .controller('CourierOrderController', CourierOrderController);

  function CourierOrderController(courierOrder,
                                  $q,
                                  $scope,
                                  $ionicLoading,
                                  $ionicPopup,
                                  $translate,
                                  MapsService,
                                  GeolocationService,
                                  MapDirectionsService,
                                  ShippingRequestService,
                                  ModalService) {
    var coVm = this,
        currentLocation;
    coVm.order = courierOrder;
    coVm.provider = courierOrder.provider_profile; //jshint ignore:line
    coVm.customerOrder = courierOrder.customer_order;  //jshint ignore:line
    coVm.customerOrderDelivery = courierOrder.customer_order_delivery; //jshint ignore:line
    coVm.items = courierOrder.customer_order.customer_order_items; //jshint ignore:line
    coVm.courierIsInStore = courierIsInStore;
    coVm.courierHasDelivered = courierHasDelivered;
    coVm.routesStatus = 'noRoutes';
    coVm.routeLegs = [];
    coVm.openMap = openMap;
    coVm.subtotalItems = coVm.customerOrder.subtotal_items_cents; //jshint ignore:line
    coVm.shippingPrice = coVm.customerOrderDelivery.shipping_fare_price_cents; //jshint ignore:line
    coVm.totalOrder = coVm.subtotalItems + coVm.shippingPrice;
    init();

    function init() {
      preloadShippingRequestData();
    }

    function modalMap () {
      closeModal().then(function(){
        $scope.mdVm = {
          closeModal: closeModal
        };
        ModalService.showModal({
          parentScope: $scope,
          fromTemplateUrl: 'templates/courier/orders/map.html',
        });
      });
    }

    function closeModal() {
      return ModalService.closeModal();
    }

    function openMap () {
      modalMap();
      performing();
      $q.all([
        loadMaps(),
        getCurrentPosition()
      ]).then(function(){
        var mapContainer = angular.element('#order-map')[0];
        var map = MapsService.renderMap(mapContainer);
        coVm.routesStatus = 'searching';
        MapDirectionsService.renderRoute({
          map: map,
          origin: getOrigin(),
          target: getTarget(),
          waypoints: getWaypoints(),
        }).then(function(routes){
          var route = routes[0]; // only showing first one atm
          coVm.routeLegs = route.legs;
          angular.forEach(route.legs, function(leg, index){
            var halfLength = parseInt(leg.steps.length/2, 10),
                midPoint = leg.steps[halfLength];

            var marker = new google.maps.Marker({
              position: midPoint.end_location, //jshint ignore:line
              map: map,
              visible: false
            });
            openRouteLegInfoWindow(leg, map, marker, index);
          });
        }).catch(function(){
          coVm.routesStatus = 'noRoutes';
        });
        finishedPerforming();
      });
    }

    function openRouteLegInfoWindow(routeLeg, map, marker, legIndex){
      var infoWindow = new google.maps.InfoWindow();
      $translate(
        'shippingRequest.routeLegs.' + coVm.order.kind + '.leg' + legIndex
      ).then(function(routeName){
        infoWindow.setContent(
          routeName + '<br><strong>' + routeLeg.duration.text + '</strong><br>' + routeLeg.distance.text
        );
        infoWindow.open(map,marker);
      });
    }

    function preloadShippingRequestData() {
      coVm.address = coVm.order.address_attributes; // jshint ignore:line
      coVm.provider = coVm.order.provider_profile; // jshint ignore:line
      preloadCustomerOrderData();
      // jshint ignore:start
      if (coVm.order.customer_order_delivery) {
        coVm.fareCurrencyCents = coVm.order.customer_order_delivery.shipping_fare_price_cents;
      }
      // jshint ignore:end
      reinitialize();
    }

    function reinitialize() {
      // a 'smaller' init
      coVm.shouldDisplayClientDetails = getShouldDisplayClientDetails();
    }

    function preloadCustomerOrderData(){
      // jshint ignore:start
      if (!coVm.order.customer_order) { return }
      coVm.fareCurrency = coVm.order.customer_order.subtotal_items_currency;
      coVm.billingAddress = coVm.order.customer_order.customer_billing_address;
      // jshint ignore:end
      coVm.orderItemsTotal = getOrderItemsTotal();
      coVm.clientName = getClientName();
      coVm.shouldDisplayShippingPrice = true; // if it's a customer_order_delivery
    }

    function getClientName() {
      // jshint ignore:start
      var customerProfile = coVm.order.customer_order.customer_profile;
      return customerProfile.name || customerProfile.nickname;
      // jshint ignore:end
    }

    function getOrderItemsTotal() {
      // jshint ignore:start
      var customerOrderItems = coVm.order.customer_order.customer_order_items;
      return customerOrderItems.reduce(function(memo, orderItem){
        var subtotalOrderItem = orderItem.cantidad * orderItem.provider_item_precio_cents;
        return memo + subtotalOrderItem;
      }, 0);
      // jshint ignore:end
    }

    function getShouldDisplayClientDetails(){
      return coVm.order.customer_order_delivery && coVm.order.status !== 'new'; // jshint ignore:line
    }

    function getWaypoints(){
      if (!coVm.order.waypoints) { return; }
      return coVm.order.waypoints.map(function(waypoint){
        var location = new google.maps.LatLng(
          waypoint.lat,
          waypoint.lon
        );
        return {
          stopover: true,
          location: location
        };
      });
    }

    function getOrigin(){
      return new google.maps.LatLng(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    }

    function getTarget(){
      return new google.maps.LatLng(
        coVm.order.address_attributes.lat, // jshint ignore:line
        coVm.order.address_attributes.lon // jshint ignore:line
      );
    }

    function loadMaps(){
      return MapsService.loadGMaps();
    }

    function getCurrentPosition(){
      return GeolocationService
        .getCurrentPosition()
        .then(function(resp){
          currentLocation = resp;
        }).catch(function (error){
          finishedPerforming();
          $ionicPopup.alert({
            title: 'Error',
            template: error
          });
          coVm.mapIsHidden = true;
          return $q.reject(error);
        });
    }

    function performing(){
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
    }

    function finishedPerforming(){
      $ionicLoading.hide();
    }

    function courierIsInStore(){
      performing();
      ShippingRequestService.courierIsInStore(
        coVm.order
      ).then(successFromShippingRequestService)
      .finally(finishedPerforming);
    }

    function courierHasDelivered(){
      performing();
      ShippingRequestService.courierHasDelivered(
        coVm.order
      ).then(successFromShippingRequestService)
      .finally(finishedPerforming);
    }

    function successFromShippingRequestService(respShippingReq){
      coVm.order = respShippingReq;
      reinitialize();
    }
  }
})();
