(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('TosService', TosService);

  function TosService(CommonService) {
    var service = {
      getTOSContent: getTOSContent
    };
    return service;

    function getTOSContent(){
      return CommonService.getObjects('/api/tos', 'tos');
    }
  }
})();
