(function () {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('MenuController', MenuController);

  function MenuController($scope,
                          categories,
                          CategoriesService,
                          ErrorHandlerService) {
    var vmMenu = this;
    vmMenu.categories = categories.provider_categories;

    $scope.$on('update-categories', function() {
      CategoriesService.getCategories()
        .then(function success(res) {
          vmMenu.categories = res.data.provider_categories;
        }, ErrorHandlerService.handleCommonErrorGET);
    });
  }
})();
