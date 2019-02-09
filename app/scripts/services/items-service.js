(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('ItemsService', ItemsService);

  function ItemsService($http,
                        Upload,
                        ENV,
                        CommonService) {

    var service = {
      newItem: newItem,
      getItem: getItem,
      getItems: getItems,
      editItem: editItem,
      deleteItem: deleteItem
    };

    return service;

    function newItem(item) {
      var promise;
      if ( hasNestedImages(item) ) {
        promise = saveWithNestedImages({
          method: 'POST',
          resourceUri: '/api/provider/items',
          item: item
        });
      } else {
        promise = CommonService.newObject(item, '/api/provider/items');
      }
      return promise;
    }

    function getItems() {
      return CommonService.getObjects('/api/provider/items/');
    }

    function getItem(stateParams) {
      return CommonService.getObject('/api/provider/items/', stateParams.id);
    }

    function editItem(item) {
      var promise;
      if ( hasNestedImages(item ) ) {
        promise = saveWithNestedImages({
          method: 'PUT',
          resourceUri: '/api/provider/items/' + item.id,
          item: item
        });
      } else {
        promise = CommonService.editObject(item, '/api/provider/items/');
      }
      return promise;
    }

    function deleteItem(itemId) {
      return $http({
        method: 'DELETE',
        url: ENV.apiHost + '/api/provider/items/' + itemId
      });
    }

    function hasNestedImages(item) {
      return item && item.imagenes && item.imagenes.some(function (instance) {
        return instance.constructor === File;
      });
    }

    function saveWithNestedImages(options){
      options.item.imagenes_attributes = []; //jshint ignore:line
      angular.forEach(options.item.imagenes, function(value) {
        options.item.imagenes_attributes.push({imagen: value}); //jshint ignore:line
      });
      return Upload.upload({
        method: options.method,
        url: ENV.apiHost + options.resourceUri,
        data: options.item
      }).then(function (resp) {
        return resp.data;
      });
    }
  }
})();
