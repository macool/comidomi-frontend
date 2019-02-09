(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('selectizeprovideritemcategory', selectizeProviderItemCategory);

  function selectizeProviderItemCategory() {
    return {
      restrict: 'A',
      scope: {
        options: '=',
        config: '=',
        item: '=',
        bindTo: '@',
        nestedParam: '@'
      },

      link: function(scope, elemento) {
        var selectize = elemento.selectize(scope.config)[0].selectize;
        angular.forEach(scope.options, function(tag) {
          selectize.addOption(tag);
        });

        // select current option
        selectize.addItem(
          scope.item[scope.bindTo],
          false
        );

        selectize.on('item_add', chooseItemCategory);
        selectize.on('option_add', addItemCategory);
        selectize.on('item_remove', deselectItemCategory);

        function addItemCategory(value) {
          scope.item[scope.nestedParam] = {
            nombre: value
          };
        }

        function deselectItemCategory(value){
          if(scope.item[scope.nestedParam]){
            selectize.removeOption(value);
          }
          scope.item[scope.bindTo] = null;
          scope.item[scope.nestedParam] = undefined;
        }

        function chooseItemCategory(value) {
          // only allow integers. strings are new categories
          // and should be part of nested params
          scope.item[scope.bindTo] = isFinite(value) ? value : undefined;
        }
      }
    };
  }
})();
