(function () {
  'use strict';

  angular
    .module('porttare')
    .run(pushNotificationsConfig);

  function pushNotificationsConfig(ENV,
                                   $rootScope,
                                   UserDevicesService){
    var notificationHandler,
        deviceRegistrationId;

    document.addEventListener(
      'deviceready',
      registerPushNotifications,
      false
    );

    function registerPushNotifications(){
      $rootScope.$on('auth:login-success', registerDevice);
      $rootScope.$on('auth:validation-success', registerDevice);

      FCMPlugin.onTokenRefresh(function(token){
        deviceRegistrationId = token;
      });

      FCMPlugin.onNotification(function(data){
        $rootScope.$emit('porttare:notification', data);
      });
    }

    function registerDevice(){
      UserDevicesService.registerDevice(
        deviceRegistrationId
      );
    }
  }
})();
