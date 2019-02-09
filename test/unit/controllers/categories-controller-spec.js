(function () {
  'use strict';

  describe('CategoriesController', function () {
    var ctrl,
      resolve,
      dependencies,
      $controller,
      $scope;

    beforeEach(module('porttare.controllers'));
    beforeEach(angular.mock.module(function ($provide) {
      $provide.value('data', {
        categories: []
      });
    }));

    beforeEach(inject(function (_$rootScope_,
        _$controller_,
        data) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        resolve = data;
      })
    );

    beforeEach(function () {
      dependencies = {
        data: resolve,
        $scope: $scope
      };
      $scope.$parent.menuVm = {
        categories: []
      };
      ctrl = $controller('CategoriesController', dependencies);
    });

    describe('on init', function () {
      it('categories should not be empty', function () {
        $scope.$digest();
        expect(ctrl.categories()).to.not.be.null; //jshint ignore:line
      });

    });

  });
})();
