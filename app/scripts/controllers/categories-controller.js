(function () {
  'use strict';

  /*jshint camelcase:false */

  angular
    .module('porttare.controllers')
    .controller('CategoriesController', CategoriesController);

  function CategoriesController($scope,
                                categories,
                                CategoriesService,
                                ErrorHandlerService) {
    var categoryVm = this;
    var cacheInit = moment();

    categoryVm.categories = categories.provider_categories;
    categoryVm.categoryGridClassFor = categoryGridClassFor;

    $scope.$on('$ionicView.enter', function() {
      if (moment().diff(cacheInit, 'minutes') > 10) {
        updateCategories();
      }
    });

    function unevenCategories() {
      var categoriesLength = categoryVm.categories.length + 1;
      return ((categoriesLength % 3) !== 0);
    }

    function categoryGridClassFor(index, last) {
      var divisibleByThree = (index + 1) % 3 === 0,
          fullWidth = divisibleByThree || (last && unevenCategories());
      if (fullWidth) {
        return 'grid-100';
      } else {
        return 'grid-50';
      }
    }

    function updateCategories(){
      CategoriesService.getCategories()
        .then(function success(res) {
          categoryVm.categories = res.data.provider_categories;
        }, ErrorHandlerService.handleCommonErrorGET);
    }
  }
})();
