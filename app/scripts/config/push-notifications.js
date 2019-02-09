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
      notificationHandler = PushNotification.init({
        'android': {
          'forceShow': true,
          'senderID': ENV.gcmSenderID, // TODO use ENV
          'clearNotifications': false
        },
        'ios': {
          'sound': true,
          'vibration': true,
          'badge': true
        },
        'windows': {}
      });

      notificationHandler.on('registration', function(data){
        deviceRegistrationId = data.registrationId;
        $rootScope.$on('auth:login-success', registerDevice);
        $rootScope.$on('auth:validation-success', registerDevice);
      });

      notificationHandler.on('error', function(e){
        console.log('push error = ' + e.message);
      });

      notificationHandler.on('notification', function(data){
        $rootScope.$emit('porttare:notification', data);
        return notificationHandler.finish();
      });
    }

    function registerDevice(){
      UserDevicesService.registerDevice(
        deviceRegistrationId
      );
    }
  }
})();
