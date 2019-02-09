(function () {
  'use strict';

  describe('IntroController', function () {
    var ctrl, $controller, dependencies, $ionicSlideBoxDelegate, $ionicPlatform, $state, $localStorage, $window;

    beforeEach(module('porttare.controllers'));

    beforeEach(angular.mock.module(function($provide){
      $provide.factory('$state', function($q){
        return {
          go: sinon.stub().returns($q.defer().promise)
        };
      });
    }));

    beforeEach(inject(
      function (_$controller_, _$window_, _$state_) {
        $controller = _$controller_;
        $window = _$window_;
        $state = _$state_;
        $localStorage = {};
        $localStorage.setItem = sinon.stub();
        $localStorage.getItem = sinon.stub();

        $ionicSlideBoxDelegate = { previous: sinon.stub(), next: sinon.stub()};
        $ionicPlatform = { ready: sinon.stub() };
      })
    );

    afterEach(function(){
      $window.localStorage.clear();
    });

    describe('#listeners', function(){
      beforeEach(function(){

        dependencies = {
          $ionicSlideBoxDelegate: $ionicSlideBoxDelegate,
          $state: $state,
          $localStorage: $localStorage,
          $ionicPlatform: $ionicPlatform
        };

        ctrl = $controller('IntroController', dependencies);
      });

      it('should call $localstorage and $state.go on startApp()', function(){
        ctrl.startApp();
        sinon.assert.calledOnce($localStorage.setItem);
        sinon.assert.calledOnce($state.go);
      });

      it('should call $ionicSlideBoxDelegate.next on next()', function(){
        ctrl.next();
        sinon.assert.calledOnce($ionicSlideBoxDelegate.next);
      });

      it('should call $ionicSlideBoxDelegate.previous on previous()', function(){
        ctrl.previous();
        sinon.assert.calledOnce($ionicSlideBoxDelegate.previous);
      });

      it('should set slideIndex to the param of slideChanged()', function(){
        ctrl.slideChanged(2);
        chai.expect(ctrl.slideIndex).to.deep.equals(2);
      });

    });

  });
})();
