(function () {
  'use strict';
  /* jshint validthis:true */
  /* jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('ProviderDetailController', ProviderDetailController);

  function ProviderDetailController($scope,
                                    $ionicLoading,
                                    data,
                                    CommonService) {
    var providerDetVm = this;
    providerDetVm.provider = angular.copy(data.provider_profile);
    var promotions = getPromotions(providerDetVm.provider.provider_item_categories);
    if (promotions.length) {
      providerDetVm.provider.provider_item_categories.unshift(
        {
          nombre: 'Promociones',
          provider_items: promotions,
          promotion: true
        }
      );
    }

    var office = providerDetVm.provider.provider_offices[0];
    providerDetVm.isOpen = CommonService.officeScheduleDay(office).isOpen;
    providerDetVm.closedMsgTranslation = {
      providerName: providerDetVm.provider.nombre_establecimiento
    };

    // HACK:
    // fixes a bug where transitioning (back) to this
    // screen using the hardware back button gets stuck
    // on $ionicLoading
    $scope.$on('$ionicView.enter', function(){
      $ionicLoading.hide();
    });

    function getPromotions(categories){
      var promos = [];
      categories.forEach(function(category){
        category.provider_items.forEach(function(item){
          if (item.is_promo && item.weekdays) {
            if (isPromoAvailable(item.weekdays)){
              var newItem = angular.copy(item);
              promos.push(newItem);
              item.hide = true;
            }else{
              item.hide = true;
            }
          }
        });
      });
      return promos;
    }

    function isPromoAvailable(weekdays) {
      moment.locale('en');
      var today = moment().format('ddd');
      return weekdays.find(function(day){
        return day.available && day.wkday === today.toLocaleLowerCase();
      });
    }
  }
})();
