(function() {

 'use strict';
 angular
  .module('porttare.config')
  .constant('APP', {
    placesState: 'app.places.index',
    successState: 'app.categories.index',
    preloginState: 'prelogin',
    defaultImage: 'images/404.png',
    defaultProfileImage: 'images/mysteryman.png',
    centsInDollar: '100',
    fbAuthScope: ['public_profile', 'email', 'user_birthday'],
    paymentMethods: ['efectivo'],
    deliveryMethods: ['shipping', 'pickup'],
    weekdays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    timeoutDefault: 5*60*1000
  });
})();
