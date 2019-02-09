(function () {
  'use strict';

  angular
    .module('porttare.filters')
    .filter('defaultImage', defaultImage);

  function defaultImage(APP) {
    return function (currentValue, customImage) {
      var defaultImg = customImage ? customImage : APP.defaultImage;
      var imageUrl = currentValue ? currentValue : defaultImg;
      return imageUrl;
    };
  }

})();
