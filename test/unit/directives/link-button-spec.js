(function () {
  'use strict';
  /*jshint camelcase:false */
  describe('linkButton', function () {
    var compile, scope, directiveElem;

    beforeEach(module('porttare.directives'));
    beforeEach(module('porttare.templates'));

    function getCompiledElement() {
      var element = angular.element('<link-button on-click="test()"></link-button>');
      var compiledElement = compile(element)(scope);
      scope.$digest();
      return compiledElement;
    }

    beforeEach(inject(function ($compile, $rootScope) {
      compile = $compile;
      scope = $rootScope.$new();
      scope.test = sinon.stub();
      directiveElem = getCompiledElement();
    }));

    it('Should run function', function() {
      var button = directiveElem.find('button');
      button.triggerHandler('click');
      scope.$digest();
      sinon.assert.calledOnce(scope.test);
    });
  });
})();
