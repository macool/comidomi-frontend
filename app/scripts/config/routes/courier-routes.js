'use strict';

angular
  .module('porttare.config')
  .config(courierRoutes);

function courierRoutes($stateProvider) {
  $stateProvider
  .state('courier', {
    url: '/courier',
    abstract: true,
    templateUrl: 'templates/menu/menu-courier.html'
  })
  .state('courier.orders', {
    url: '/orders',
    cache: false,
    views: {
      'menuContent@courier': {
        templateUrl: 'templates/courier/orders.html',
        controller: 'OrdersController',
        controllerAs: 'orVm',
        resolve: {
          shippingRequests: function (ShippingRequestService) {
            return ShippingRequestService.getShippingRequestsWithStatus('new');
          }
        }
      }
    }
  })
  .state('courier.order', {
    url: '/orders/:id',
    cache: false,
    params: {
      order: null
    },
    views: {
      'menuContent@courier': {
        templateUrl: 'templates/courier/orders/show.html',
        controller: 'CourierOrderController',
        controllerAs: 'coVm',
        resolve: {
          courierOrder: function ($stateParams, ShippingRequestService) {
            if ($stateParams.order) {
              return $stateParams.order;
            } else {
              return ShippingRequestService.getShippingRequest($stateParams.id);
            }
          }
        }
      }
    }
  });
}
