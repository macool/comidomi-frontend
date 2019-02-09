(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('CommonService', CommonService);

  function CommonService($http, ENV) {

    var service = {
      editObject: editObject,
      newObject: newObject,
      getObjects: getObjects,
      getObject: getObject,
      deleteObject:deleteObject
    };

    return service;

    function getObjects(url, modelName) {
      return $http({
        method: 'GET',
        url: ENV.apiHost + url
      })
        .then(function success(resp) {
          var collection = resp.data;
          if (modelName) {
            collection = collection[modelName];
          }
          return collection;
        });
    }

    function newObject(data, url) {
      return $http({
        method: 'POST',
        url: ENV.apiHost + url,
        data: data
      })
        .then(function success(resp){
          return resp.data;
        });
    }

    function editObject(data, url) {
      return $http({
        method: 'PATCH',
        url: ENV.apiHost + url + data.id,
        data: data
      })
        .then(function success(resp){
          return resp.data;
        });
    }

    function getObject(url, objectId, modelName) {
      return getObjects(url + objectId).then(function(resp){
        var resource = resp;
        if (modelName) {
          resource = resource[modelName];
        }
        return resource;
      });
    }

    function deleteObject(objectId, url){
      return $http({
        method: 'DELETE',
        url: ENV.apiHost + url + objectId
      })
        .then(function success(resp){
          return resp.data;
        });
    }

  }
})();
