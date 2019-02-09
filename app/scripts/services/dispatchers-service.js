(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('DispatchersService', DispatchersService);

  function DispatchersService(CommonService) {

    var service = {
      getDispatchers: getDispatchers,
      getDispatcher: getDispatcher,
      createDispatcher: createDispatcher,
      updateDispatcher:  updateDispatcher,
      deleteDispatcher:deleteDispatcher
    };

    return service;

    function getDispatchers() {
      return CommonService.getObjects('/api/provider/dispatchers');
    }

    function getDispatcher(id) {
      return CommonService.getObject('/api/provider/dispatchers/', id);
    }

    function createDispatcher(dispatcher) {
      return CommonService.newObject(dispatcher, '/api/provider/dispatchers');
    }

    function updateDispatcher(dispatcher) {
      return CommonService.editObject(dispatcher, '/api/provider/dispatchers/');
    }

    function deleteDispatcher(id) {
      return CommonService.deleteObject(id, '/api/provider/dispatchers/');
    }
  }
})();
