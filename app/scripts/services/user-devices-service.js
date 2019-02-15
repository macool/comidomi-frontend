(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('UserDevicesService', UserDevicesService);

  function UserDevicesService(CommonService){
    var service = {
      registerDevice: registerDevice,
      unregisterDevice: unregisterDevice
    };
    return service;

    function registerDevice(uid){
      var url = '/api/users/devices',
          data = {
            uuid: uid,
            platform: getPlatform()
          };
      return CommonService.newObject(data, url);
    }

    function unregisterDevice(uid){
      var url = '/api/users/devices/unregister',
          data = {
            uuid: uid,
            platform: getPlatform()
          };
      return CommonService.newObject(data, url);
    }

    function getPlatform(){
      return window.ionic.Platform.isAndroid() ? 'android' : 'ios';
    }
  }
})();
