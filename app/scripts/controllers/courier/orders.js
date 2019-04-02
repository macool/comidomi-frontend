(function () {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('OrdersController', OrdersController);

  function OrdersController(APP,
                            shippingRequests,
                            ShippingRequestService,
                            $state,
                            $filter,
                            $scope,
                            $ionicPopup,
                            $ionicLoading) {
    var orVm = this,
        currentMap, currentInfoWindow;
    orVm.totalOrders = 0;
    orVm.mapRendered = mapRendered;
    orVm.showTakeRequestModal = showTakeRequestModal;
    orVm.currentTab= 'new';
    orVm.refreshOrders = refreshOrders;

    init(shippingRequests);

    function init(orders) {
      orVm.orders = orders;
      orVm.totalOrders = orVm.orders.length;
      orVm.tabs = [
        {
          key: 'new',
          sref: 'courier.orders.new',
          total: orVm.orders.length
        },
        {
          key: 'inProgress',
          sref: 'courier.orders.shippings({type:"inProgress"})'
        },
      ];
      orVm.loaded = true;
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
      var wrapper,
          etaNode,
          btnNode,
          priceNode,
          btnWrapper,
          providerNode,
          dispatchAtStr,
          textWrapperNode;
      dispatchAtStr = moment(
        shippingRequest.estimated_dispatch_at
      ).fromNow();
      wrapper = angular.element('<div />');
      textWrapperNode = angular.element('<p />');
      etaNode = angular.element('<div />', {
        text: 'Pedido enviado ' + dispatchAtStr
      });
      providerNode = angular.element('<div />', {
        class: 'strong',
        text: shippingRequest.provider_profile.nombre_establecimiento // jshint ignore:line
      });
      priceNode = angular.element('<div />', {
        // TODO currency should be taken from the model
        // $translate('item.currency.' + shippingRequest.customer_order.subtotal_items_currency).then(function(currency){
        //   currency = $
        // });
        text: 'Subtotal: ' +
              $filter('currency')(shippingRequest.customer_order.subtotal_items_cents / APP.centsInDollar, '$') +
              '. Envío: ' +
              $filter('currency')(shippingRequest.customer_order_delivery.shipping_fare_price_cents / APP.centsInDollar, '$')
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
      textWrapperNode.append(etaNode);
      textWrapperNode.append(providerNode);
      textWrapperNode.append(priceNode);
      wrapper.append(textWrapperNode);
      btnWrapper.append(btnNode);
      wrapper.append(btnWrapper);
      return new google.maps.InfoWindow({
        content: wrapper[0] // first node
      });
    }

    function performTakeRequest(order){
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
      ShippingRequestService.takeShippingRequest(
        order,
        orVm.takeRequestTime
      ).then(successFromShippingRequestService)
      .finally(function(){
        $ionicLoading.hide();
      });
    }

    function successFromShippingRequestService(respShippingReq){
      $state.go('courier.order', {
        id: respShippingReq.id,
        order: respShippingReq
      });
    }

    function showTakeRequestModal(order){
      // TODO translate me?
      var subTitle;
      if (order.customer_order.customer_profile) { //jshint ignore:line
        // if it's a customer order delivery
        subTitle = 'incluye el tiempo que tomará recoger el pedido';
      }
      $ionicPopup.show({
        scope: $scope,
        template: '<input type="number" ng-model="orVm.takeRequestTime" min="0" placeholder="Tiempo en minutos">',
        title: 'Tiempo estimado para la entrega',
        subTitle: subTitle,
        buttons: [
          { text: 'Cancelar',
            onTap: function(){
              orVm.takeRequestTime = null;
            }
          },
          {
            text: 'Confirmar',
            type: 'button-positive',
            onTap: function(e) {
              if (!orVm.takeRequestTime) {
                e.preventDefault();
              } else {
                performTakeRequest(order);
              }
            }
          }
        ]
      });
    }

    function refreshOrders() {
      orVm.loaded = false;
      ShippingRequestService.getShippingRequestsWithStatus('new').then(function(orders){
        init(orders);
      });
    }
  }
})();
