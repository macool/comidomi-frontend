(function () {
  'use strict';

  /**
    allowed font sizes - this depends a lot on
    current input's fontSize
  **/
  var originalFontSize = 14,
      minFontSizeAllowed = 9;

  angular
    .module('porttare.directives')
    .directive('autosizeInput', autosizeInput);

  function autosizeInput() {
    var directive = {
      restrict: 'A',
      link: AutosizeInputLink
    };

    return directive;
  }

  function AutosizeInputLink(scope, element) {
    element.on('keydown change', function (e) {
      var newFontSize,
          target = e.target,
          maxCharLengthAllowed = 18;

      if (target.value.length > maxCharLengthAllowed) {
        var factor = (target.value.length - maxCharLengthAllowed) / 5;
        newFontSize = originalFontSize - parseInt(factor, 10);

        if (newFontSize < minFontSizeAllowed) {
          newFontSize = minFontSizeAllowed;
        }
      } else {
        newFontSize = originalFontSize;
      }

      target.style.fontSize = newFontSize.toString() + 'px';
    });
  }
})();
