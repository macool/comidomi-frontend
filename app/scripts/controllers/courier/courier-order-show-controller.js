(function () {
  'use strict';

  /* jshint validthis:true */
  /* jshint camelcase:false */

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
    coVm.orderCustomer = null;
    coVm.showConfirmRequestModal = showConfirmRequestModal;

    var defaultOrder = {
      anon_billing_address: {},
      customer_billing_address: {},
      customer_profile: {},
      customer_address_attributes: {},
      provider: {},
      items: [],
      currency: 'USD',
      subtotalItems: 0,
      shippingPrice: 0,
      totalOrder: 0,
      description: null,
      status: coVm.order.status,
      isErrand: false,
      messageForCourier: null
    };

    init();

    function init() {
      if (coVm.order.kind === 'customer_errand') {
        defaultOrder.anon_billing_address = true;
        defaultOrder.customer_address_attributes = coVm.order.address_attributes;
        defaultOrder.customer_profile = coVm.order.customer_order.customer_profile;
        defaultOrder.currency = coVm.order.customer_errand.shipping_fare_price_currency;
        defaultOrder.shippingPrice = coVm.order.customer_errand.shipping_fare_price_cents;
        defaultOrder.totalOrder = coVm.order.customer_errand.shipping_fare_price_cents;
        defaultOrder.description = coVm.order.customer_errand.description;
        defaultOrder.isErrand = true;
      } else {
        defaultOrder.anon_billing_address = coVm.order.customer_order.anon_billing_address;
        defaultOrder.customer_billing_address = coVm.order.customer_order.customer_billing_address;
        defaultOrder.customer_profile = coVm.order.customer_order.customer_profile;
        defaultOrder.customer_address_attributes = coVm.order.customer_order_delivery.customer_address_attributes;
        defaultOrder.provider = coVm.order.provider_profile;
        defaultOrder.items = coVm.order.customer_order.customer_order_items;
        defaultOrder.currency = coVm.order.customer_order.subtotal_items_currency;
        defaultOrder.subtotalItems = coVm.order.customer_order.subtotal_items_cents;
        defaultOrder.shippingPrice = coVm.order.customer_order_delivery.shipping_fare_price_cents;
        defaultOrder.totalOrder = coVm.order.customer_order_delivery.shipping_fare_price_cents + defaultOrder.subtotalItems;
        defaultOrder.messageForCourier = coVm.order.customer_order.observaciones;
      }
      coVm.orderCustomer = defaultOrder;
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
      coVm.orderCustomer.status = respShippingReq.status;
    }

    function performTakeRequest(order){
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
      ShippingRequestService.confirmShippingRequest(
        order,
        coVm.takeRequestTime
      ).then(successFromShippingRequestService)
      .finally(function(){
        $ionicLoading.hide();
      });
    }

    function showConfirmRequestModal(){
      // TODO translate me?
      var subTitle,
          order = coVm.order;
      if (order.customer_order.customer_profile) { //jshint ignore:line
        // if it's a customer order delivery
        subTitle = 'incluye el tiempo que tomará recoger el pedido';
      }
      $ionicPopup.show({
        scope: $scope,
        template: '<input type="number" ng-model="coVm.takeRequestTime" min="0" placeholder="Tiempo en minutos">',
        title: 'Tiempo estimado para la entrega',
        subTitle: subTitle,
        buttons: [
          { text: 'Cancelar',
            onTap: function(){
              coVm.takeRequestTime = null;
            }
          },
          {
            text: 'Confirmar',
            type: 'button-positive',
            onTap: function(e) {
              if (!coVm.takeRequestTime) {
                e.preventDefault();
              } else {
                performTakeRequest(order);
                // alert('TODO');
              }
            }
          }
        ]
      });
    }
  }
})();
