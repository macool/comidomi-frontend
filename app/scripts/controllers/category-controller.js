(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CategoryController', CategoryController);

  function CategoryController(data, $state) {
    var categoryVm = this,
        slickCenterMode, slickInitialSlide;

    categoryVm.category = data.provider_category;//jshint ignore:line
    categoryVm.providers = data.provider_category.provider_profiles;//jshint ignore:line

    slickCenterMode = categoryVm.providers.length === 1 || categoryVm.providers.length > 2;
    slickInitialSlide = categoryVm.providers.length > 2 ? 1 : 0;

    categoryVm.options = {
      model: {
        data: {
          category: categoryVm.category,
          providers: categoryVm.providers
        },
        actions: {
          onCardClick: function(data) {
            var itemsRoute = 'app.categories.provider';
            $state.go(itemsRoute, {
              categoryId: data.category.id,
              providerId: data.provider.id
            });
          }
        }
      },
      slickSettings: {
        infinite: false,
        variableWidth: true,
        lazyLoad: 'progressive',
        centerMode: slickCenterMode,
        initialSlide: slickInitialSlide,
        responsive: [
          {
            breakpoint: 320,
            settings: {
              slidesToShow: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 4
            }
          }
        ]
      }
    };
  }
})();
