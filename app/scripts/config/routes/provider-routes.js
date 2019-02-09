'use strict';

angular
  .module('porttare.config')
  .config(providerRoutes);

function providerRoutes($stateProvider) {
  $stateProvider
  .state('provider', {
    url: '/provider',
    abstract: true,
    cache: false,
    templateUrl: 'templates/menu/menu-provider.html',
    resolve: {
      auth: function ( UserAuthService) {
              return UserAuthService.checkIfEnabledProvider();
            },
      providerOrders: function(ProviderCustomerOrdersService, ErrorHandlerService){
        return ProviderCustomerOrdersService
          .getProviderCustomerOrdersByStatus('submitted')
          .catch(ErrorHandlerService.handleCommonErrorGET);
      }
    },
    controller: 'ProviderMainController',
    controllerAs: 'providerMainVm'
  })
  .state('provider.profile-provider', {
    url: '/profile',
    abstract: true,
    views: {
      'menuContent': {
        templateUrl:'templates/profile-provider/profileProvider.html'
      }
    }
  })
  .state('provider.profile-provider.info', {
    url: '/info',
    views: {
      'menuContent@profileProviderInfo': {
        templateUrl: 'templates/profile-provider/info.html',
        controller: 'ProfileProviderUpdateController',
        controllerAs: 'providerProfileVm'
      }
    }
  })
  .state('provider.profile-provider.metrics', {
    url: '/metrics',
    views: {
      'menuContent@profileProviderMetrics': {
        templateUrl: 'templates/profile-provider/metrics.html'
      }
    }
  })
  .state('provider.profile-provider.managements', {
    url: '/managements',
    views: {
      'menuContent@profileProviderManagements': {
        templateUrl: 'templates/profile-provider/managements.html'
      }
    }
  })
  .state('provider.items', {
    url: '/items',
    abstract: true
  })
  .state('provider.items.index', {
    url: '/',
    cache: false,
    views: {
      'menuContent@provider': {
        templateUrl: 'templates/item/items.html',
        controller: 'ItemsController',
        controllerAs: 'itemsVm',
        resolve: {
          apiResources: function (ItemsService) {
            return ItemsService.getItems();
          }
        }
      }
    }
  })
  .state('provider.items.show', {
    url: '/:id',
    views: {
      'menuContent@provider': {
        templateUrl: 'templates/item/show.html',
        controller: 'ProviderItemController',
        controllerAs: 'providerItemVm',
        resolve: {
          apiResources: function ($ionicLoading, $stateParams, ItemsService, ErrorHandlerService) {
            $ionicLoading.show({
              template: '{{::("globals.loading"|translate)}}'
            });

            return ItemsService.getItem($stateParams)
              .then(function success(response) {
                $ionicLoading.hide();
                return response;
              }, ErrorHandlerService.handleCommonErrorGET);
          }
        }
      }
    }
  })
  .state('provider.clients', {
    url: '/clients',
    abstract: true
  })
  .state('provider.clients.index', {
    url: '/',
    cache: false,
    views: {
      'menuContent@provider': {
        templateUrl: 'templates/client/clients.html',
        controller: 'ClientsController',
        controllerAs: 'clientsVm',
        resolve: {
          providerClients: function (ClientsService, ErrorHandlerService) {
            return ClientsService
                    .getClients()
                    .catch(ErrorHandlerService.handleCommonErrorGET);
          }
        }
      }
    }
  })
  .state('provider.offices', {
    cache: false,
    url: '/offices',
    views: {
      'menuContent@provider': {
        templateUrl: 'templates/offices/offices.html',
        controller: 'OfficesController',
        controllerAs: 'officesVm',
        resolve: {
          places: function(PlacesService, ErrorHandlerService){
            return PlacesService
                     .getPlaces()
                     .catch(ErrorHandlerService.handleCommonErrorGET);
          }
        }
      }
    }
  })
  .state('provider.office', {
    url: '/office/:id',
    params: {
      office: null
    },
    views: {
      'menuContent@provider': {
        templateUrl: 'templates/offices/detail.html',
        controller: 'OfficeController',
        controllerAs: 'officesVm',
        resolve: {
          places: function(PlacesService, ErrorHandlerService){
            return PlacesService
                     .getPlaces()
                     .catch(ErrorHandlerService.handleCommonErrorGET);
          },
          office: function ($stateParams, OfficesService, ErrorHandlerService) {
            if ($stateParams.office) {
              return $stateParams.office;
            } else {
              return OfficesService.getOffice($stateParams.id).then(function (res) {
                return res.provider_office; // jshint ignore:line
              },ErrorHandlerService.handleCommonErrorGET);
            }
          }
        }
      }
    }
  })
  .state('provider.orders', {
    url: '/customer-orders',
    abstract: true
  })
  .state('provider.orders.index', {
    url: '/:status',
    cache: false,
    params: {
      status: 'submitted'
    },
    views: {
      'menuContent@provider': {
        templateUrl: 'templates/providers/orders/index.html',
        controller: 'ProviderOrdersController',
        controllerAs: 'poVm',
        resolve: {
          status: function ($stateParams){
            return $stateParams.status;
          }
        }
      }
    }
  })
  .state('provider.orders.show', {
    url: '/show/:id',
    params: {
      customerOrder: null
    },
    views: {
      'menuContent@provider': {
        templateUrl: 'templates/providers/orders/show.html',
        controller: 'ProviderOrderShowController',
        controllerAs: 'providerOrderShowVM',
        resolve: {
          customerOrder: function ($stateParams, ProviderCustomerOrdersService) {
            if ($stateParams.customerOrder) {
              return $stateParams.customerOrder;
            } else {
              var customerOrderId = $stateParams.id;
              return ProviderCustomerOrdersService
                       .getCustomerOrder(customerOrderId);
            }
          }
        }
      }
    }
  })
  .state('provider.dispatchers', {
    url: '/dispatchers',
    abstract: true
  })
  .state('provider.dispatchers.index', {
    cache: false,
    url: '/',
    views: {
      'menuContent@provider': {
        templateUrl: 'templates/dispatchers/dispatchers.html',
        controller: 'DispatchersController',
        controllerAs: 'dispatchersVm'
      }
    }
  })
  .state('provider.dispatchers.show', {
    url: '/:id',
    views: {
      'menuContent@provider': {
        templateUrl: 'templates/dispatchers/detail.html',
        controller: 'DispatcherController',
        controllerAs: 'dispatchersVm'
      }
    }
  });
}
