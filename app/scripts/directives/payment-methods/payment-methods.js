(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('paymentMethods', actionChecked);

  function actionChecked() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/payment-methods/payment-methods.html',
      scope: {
        profileForm: '=',
        methods:'=',
        touched:'='
      },
      controller: ['$translate', paymentMethodsController],
      controllerAs: 'checkedVm',
      bindToController: true
    };

    return directive;
  }

  function paymentMethodsController($translate) {
    var checkedVm = this;// jshint ignore:line
    checkedVm.checked=checked;

    var transKeys = [
      'provider.methods.cash',
      'provider.methods.creditCard'
    ];

    $translate(transKeys).then(function (trans) {
      checkedVm.paymentMethods = [
        {
          value: 'efectivo',
          label: trans[transKeys[0]],
          checked: checkedVm.methods.includes('efectivo')
        },
        {
          value: 'tarjeta_credito',
          label: trans[transKeys[1]],
          checked: checkedVm.methods.includes('tarjeta_credito')
        }
      ];
    });

    function checked(element){
      checkedVm.touched = true;
      checkedVm.paymentMethods.map(function(row){
        if (row !== element) {
          if(row.checked === false && element.checked===false ){
            checkedVm.profileForm.paymentMethods.$invalid=true;
          }else{
            checkedVm.profileForm.paymentMethods.$invalid=false;
          }
        }
      });

      checkedVm.methods= checkedVm.paymentMethods.filter(function(row){
        return row.checked;
      }).map(function(row){
        return row.value;
      });
    }
  }
})();
