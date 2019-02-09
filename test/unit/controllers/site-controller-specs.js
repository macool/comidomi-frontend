(function () {
  'use strict';

  describe('SiteController', function () {
    var ctrl, $controller, dependencies, $rootScope, $ionicLoading, $auth;

    var SessionService,
        deferLoginWithFB,
        deferValidateUser,
        APP,
        $state,
        $q,
        deferGetCart,
        CartService;

    beforeEach(module('porttare.controllers'));
    beforeEach(module('porttare.services', function($provide){
      $provide.factory('CartService', function(){
        return {
          getCart: function(){
            deferGetCart = $q.defer();
            return deferGetCart.promise;
          }
        };
      });
      $provide.factory('ProfileService', function(){
        return {
          getUserImageURL: function(){
          }
        };
      });
    }));

    beforeEach(inject(
      function ($q,
                _$controller_,
                _$rootScope_,
                _CartService_) {

        deferLoginWithFB  = $q.defer();
        deferValidateUser = $q.defer();
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        CartService =_CartService_;
        $ionicLoading = { show: sinon.stub(), hide: sinon.stub()};
        $state        = {
          go: sinon.stub(),
          includes: function(){
            return true;
          }
        };
        SessionService  = {
          loginWithFB: sinon.stub().returns(deferLoginWithFB.promise)
        };
        APP = {
          successState: 'app.categories.index'
        };
      })
    );

    describe('#listeners', function(){
      beforeEach(function(){
        $auth = {
          user: {id: 1},
          validateUser: sinon.stub().returns(deferValidateUser.promise)
        };

        dependencies = {
          $ionicLoading: $ionicLoading,
          $auth: $auth,
          SessionService: SessionService,
          $state: $state,
          APP: APP
        };

        ctrl = $controller('SiteController', dependencies);
      });

      it('should call $ionicLoading.show in stateChangeStart', function(){
        $rootScope.$broadcast('$stateChangeStart', {name: 'fakestate'});
        $rootScope.$digest();
        sinon.assert.calledOnce($ionicLoading.show);
      });

      it('should call $ionicLoading.hode in stateChangeSuccess', function(){
        $rootScope.$broadcast('$stateChangeSuccess');
        $rootScope.$digest();
        sinon.assert.calledOnce($ionicLoading.hide);
      });

      it('should call $ionicLoading.hode in stateChangeError', function(){
        $rootScope.$broadcast('$stateChangeError');
        $rootScope.$digest();
        sinon.assert.calledOnce($ionicLoading.hide);
      });

    });

    describe('without user', function(){
      beforeEach(function(){
        $auth = {
          user: {},
          validateUser: sinon.stub().returns(deferValidateUser.promise)
        };

        dependencies = {
          $ionicLoading: $ionicLoading,
          $auth: $auth,
          SessionService: SessionService,
          $state: $state,
          APP: APP
        };
        ctrl = $controller('SiteController', dependencies);
      });

      it('should call $ionicLoading.show in stateChangeStart to login and no user', function(){
        $rootScope.$broadcast('$stateChangeStart', {name: 'login'});
        $rootScope.$digest();
        sinon.assert.calledOnce($ionicLoading.show);
      });
    });

  });
})();
