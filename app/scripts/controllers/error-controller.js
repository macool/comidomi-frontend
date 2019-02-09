(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ErrorController', ErrorController);

  function ErrorController($location, $window) {

    var errVm = this;
    var url = $location.absUrl();

    errVm.message = '';
    errVm.redirectToHome = redirectToHome;
    getErrorMessage(url);

    function parseErrorMessage(res) {
      errVm.message = decodeURIComponent(res).replace(/[+]/g, ' ');
    }

    function getErrorMessage(url) {
      var error = url.match(/error=([^&]+)#/);
      var messageEncoded = (error && error[1]) ? error[1] : '';
      return parseErrorMessage(messageEncoded);
    }

    function redirectToHome() {
      $window.location.assign('/');
    }

  }
})();
