(function () {
  'use strict';

  angular.module('porttare.config')
  .config(function ($authProvider, ENV) {
    $authProvider.configure({
      apiUrl: ENV.apiHost + '/api',
      emailSignInPath: '/auth/user/sign_in',
      signOutUrl: '/auth/user/sign_out',
      tokenValidationPath: '/auth/user/validate_token',
      storage: 'localStorage',
      emailRegistrationPath: '/auth/user',
      accountUpdatePath:  '/users/account',
      passwordResetPath: '/auth/user/password',
      passwordUpdatePath: '/auth/user/password',
      omniauthWindowType: 'newWindow',
      authProviderPaths: {
        facebook: '/auth/user/facebook'
      },
      passwordResetSuccessUrl: window.location.origin
    });
  });
})();
