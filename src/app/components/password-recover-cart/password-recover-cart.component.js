angular
  .module('app')
  .component('passwordRecoverCartComponent', {
    templateUrl: 'app/components/password-recover-cart/password-recover-cart.tmpl.html',
    controller: function ($state, $http, appConfig) {
      var self = this;
      self.successRequest = false;
      self.email = '';
      self.error = false;

      self.onSendLoginClick = function () {
        if (self.successRequest) {
          $state.go('login');
        }

        if (!self.email) {
          self.error = 'The Email field is required';
        } else {
          $http.get(appConfig.dashboardServiceUrl + '/recover.json', {params: {email: self.email}})
            .then(function (res) {
              if (res.data) {
                if (res.data.success) {
                  self.successRequest = true;
                } else {
                  self.error = 'We did not find email you provided in our base';
                }
              }
            });
        }
      };

      self.goBack = function () {
        $state.go('cart-checkout');
      };
    }
  });
