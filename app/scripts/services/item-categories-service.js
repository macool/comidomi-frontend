(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('ItemCategoriesService', ItemCategoriesService);

  function ItemCategoriesService(CommonService) {

    var service = {
      getProviderItemCategories: getProviderItemCategories,
      getSelectizeItemCategorias:getSelectizeItemCategorias
    };

    return service;

    function getProviderItemCategories(){
      return CommonService.getObjects('/api/provider/item_categories');
    }

    function getSelectizeItemCategorias(){
      return {
        maxItems: 1,
        create: true,
        valueField: 'id',
        labelField: 'nombre',
        searchField: 'nombre'
      };
    }
  }
})();
