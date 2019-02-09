(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('ShippingRequestService', ShippingRequestService);

  function ShippingRequestService($http,
                                  ENV,
                                  CommonService) {
    var baseURL = '/api/courier/shipping_requests/',
        service = {
          courierIsInStore: courierIsInStore,
          getShippingRequest: getShippingRequest,
          courierHasDelivered: courierHasDelivered,
          takeShippingRequest: takeShippingRequest,
          getShippingRequestsWithStatus: getShippingRequestsWithStatus
        };
    return service;

    function getShippingRequest(id){
      return CommonService
               .getObject(baseURL, id, 'shipping_request');
    }

    function getShippingRequestsWithStatus(status){
      return CommonService
               .getObjects(
                 baseURL + '?status=' + status,
                 'shipping_requests'
               );
    }

    function takeShippingRequest(shippingRequest, time){
      var url = baseURL + shippingRequest.id + '/take';
      return $http({
        method: 'POST',
        url: ENV.apiHost + url,
        data: { estimated_time_mins: time } // jshint ignore:line
      }).then(successApiResponse);
    }

    function courierIsInStore(shippingRequest){
      var url = baseURL + shippingRequest.id + '/in_store';
      return $http({
        method: 'POST',
        url: ENV.apiHost + url
      }).then(successApiResponse);
    }

    function courierHasDelivered(shippingRequest){
      var url = baseURL + shippingRequest.id + '/delivered';
      return $http({
        method: 'POST',
        url: ENV.apiHost + url
      }).then(successApiResponse);
    }

    function successApiResponse(response){
      return response.data.shipping_request; // jshint ignore:line
    }
  }
})();
