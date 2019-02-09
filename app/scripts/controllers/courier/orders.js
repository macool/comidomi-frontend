(function () {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('OrdersController', OrdersController);

  function OrdersController(shippingRequests, $state) {
    var orVm = this,
        currentMap, currentInfoWindow;
    orVm.totalOrders = 0;
    orVm.mapRendered = mapRendered;

    init();

    function init() {
      orVm.orders = shippingRequests;
      orVm.totalOrders = orVm.orders.length;
    }

    function mapRendered(map){
      currentMap = map;
      angular.forEach(orVm.orders, renderOrderInMap);
    }

    function renderOrderInMap(shippingRequest){
      var marker = mapMarkerFor(shippingRequest);
      marker.addListener('click', function(){
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        currentInfoWindow = infoWindowFor(shippingRequest);
        currentInfoWindow.open(currentMap, marker);
      });
    }

    function mapMarkerFor(shippingRequest){
      return new google.maps.Marker({
        map: currentMap,
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'images/supermarket.icon.png',
          scaledSize: {
            width: 22,
            height: 26
          }
        },
        position: {
          lat: shippingRequest.ref_lat, // jshint ignore:line
          lng: shippingRequest.ref_lon // jshint ignore:line
        }
      });
    }

    function infoWindowFor(shippingRequest){
      // TODO translate me?
      var wrapper, etaNode, btnWrapper, btnNode, dispatchAtStr;
      dispatchAtStr = moment(
        shippingRequest.estimated_dispatch_at
      ).fromNow();
      wrapper = angular.element('<div />');
      etaNode = angular.element('<p />', {
        text: 'Despacho listo ' + dispatchAtStr
      });
      btnWrapper = angular.element('<div />', {
        class: 'text-center'
      });
      btnNode = angular.element('<a />', {
        class: 'button button-outline button--xsmall button-energized',
        text: 'Ver detalles'
      });
      btnNode.on('click', function(){
        $state.go('courier.order', {
          id: shippingRequest.id,
          order: shippingRequest
        });
      });
      wrapper.append(etaNode);
      btnWrapper.append(btnNode);
      wrapper.append(btnWrapper);
      return new google.maps.InfoWindow({
        content: wrapper[0] // first node
      });
    }
  }
})();
