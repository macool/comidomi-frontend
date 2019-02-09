(function () {
  'use strict';
  /* jshint validthis:true */
  angular
    .module('porttare.directives')
    .directive('providersCarousel', providersCarousel);

  function providersCarousel() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/providers-carousel/providers-carousel.html',
      scope: {
        options: '='
      },
      controller: providersCarouselController,
      controllerAs: 'spcVm',
      bindToController: true
    };

    return directive;

    function providersCarouselController() {
      var spcVm = this;
      var data = spcVm.options.model.data;
      var actions = spcVm.options.model.actions;
      spcVm.cardClick = cardClick;
      spcVm.providers = data.providers;

      function cardClick(provider) {
        if (actions && actions.onCardClick) {
          var cardData = {
            provider: provider,
            category: data.category
          };
          actions.onCardClick(cardData);
        }
      }
    }

  }
})();
