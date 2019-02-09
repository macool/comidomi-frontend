
(function () {
  'use strict';

  describe('Filter: defaultImage', function () {
    var defaultImageFilter;
    beforeEach(angular.mock.module(function ($provide) {
      $provide.value('APP', {
        defaultImage: 'default.png'
      });
    }));
    beforeEach(module('porttare.filters'));
    beforeEach(inject(function (_defaultImageFilter_) {
      defaultImageFilter = _defaultImageFilter_;
    }));

    it('should assign a default image', function() {
      expect(defaultImageFilter(null)).to.equal('default.png');
      expect(defaultImageFilter(null, 'custom-default.png')).to.equal('custom-default.png');
      expect(defaultImageFilter('custom.png')).to.equal('custom.png');
    });
  });

})();
