(function() {

 'use strict';
 angular
  .module('porttare.config')
  .constant('APP', {
    placesState: 'app.places.index',
    successState: 'app.services.providers',
    successStateCourier: 'courier.orders.new',
    loginState: 'login',
    defaultImage: 'images/placeholder-menu.png',
    defaultProfileImage: 'images/mysteryman.png',
    centsInDollar: '100',
    fbAuthScope: ['public_profile', 'email'],
    paymentMethods: ['efectivo'],
    deliveryMethods: ['shipping', 'pickup'],
    weekdays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    timeoutDefault: 5*60*1000
  });
})();
