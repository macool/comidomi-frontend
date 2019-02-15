(function () {
  'use strict';

  angular
    .module('porttare')
    .run(pushNotificationsConfig);

  function pushNotificationsConfig(ENV,
                                   $auth,
                                   $rootScope,
                                   UserDevicesService){
    var deviceRegistrationId;

    document.addEventListener(
      'deviceready',
      registerPushNotifications,
      false
    );

    function registerPushNotifications(){
      $rootScope.$on('auth:login-success', setupNotifications);
      $rootScope.$on('auth:validation-success', setupNotifications);
      $rootScope.$on('auth:logout-success', tearDownNotifications);

      window.FCMPlugin.onTokenRefresh(function(token){
        unregisterDevice(deviceRegistrationId);
        deviceRegistrationId = token;
      });

      window.FCMPlugin.getToken(function(token){
        deviceRegistrationId = token;
      });

      window.FCMPlugin.onNotification(function(data){
        $rootScope.$emit('porttare:notification', data);
      });
      console.log('v5');
    }

    function setupNotifications(){
      registerDevice();
      subscribeToTopics();
    }

    function subscribeToTopics(){
      var currentUser = $auth.user;
      console.log('subscribeToTopics');
      if (currentUser.courier_profile) { // jshint ignore:line
        window.FCMPlugin.subscribeToTopic('all_couriers');
      }
    }

    function tearDownNotifications(){
      console.log('tearDownNotifications');
      // unsubscribe from topics
      window.FCMPlugin.unsubscribeFromTopic('all_couriers');
      // unregisterDevice
      unregisterDevice(deviceRegistrationId);
    }

    function registerDevice(){
      if (deviceRegistrationId === null) { return; }
      UserDevicesService.registerDevice(deviceRegistrationId);
    }

    function unregisterDevice(uid){
      if (uid === null) { return; }
      UserDevicesService.unregisterDevice(uid);
    }
  }
})();
