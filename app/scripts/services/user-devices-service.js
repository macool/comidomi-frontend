(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('UserDevicesService', UserDevicesService);

  function UserDevicesService(CommonService){
    var service = {
      registerDevice: registerDevice
    };
    return service;

    function registerDevice(uid){
      var url = '/api/users/devices',
          platform = device().platform.toLowerCase(),
          data = {
            uuid: uid,
            platform: platform
          };
      return CommonService.newObject(data, url);
    }

    function device(){
      return window.ionic.Platform.device();
    }
  }
})();
