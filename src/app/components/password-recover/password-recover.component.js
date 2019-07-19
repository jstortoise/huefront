angular
  .module('app')
  .component('passwordRecoverComponent', {
    templateUrl: 'app/components/password-recover/password-recover.tmpl.html',
    controller: function ($state, $http, appConfig, $stateParams) {
      var self = this;
      this.successRequest = false;
      this.password = '';
      this.passwordConfirm = '';
      this.error = false;
      this.type = $stateParams.token[0] || 'r';
      this.token = $stateParams.token.slice(1);

      this.onSendLoginClick = function () {
        self.error = false;
        if (self.successRequest) {
          $state.go('login');
        }

        if (!self.password || !self.passwordConfirm) {
          self.error = 'Password and Confirm Password fields are required';
        } else {
          if (self.password === self.passwordConfirm) {
            $http.get(appConfig.dashboardServiceUrl + '/password_recover.json', {
              params: {
                password: self.password,
                token: self.token
              }
            }).then(function (res) {
              if (res.data) {
                if (res.data.success) {
                  self.successRequest = true;
                } else {
                  self.error = 'We did not find email you provided in our base';
                }
              }
            }).catch(function (err) {
              if (err) {
                self.error = 'Your token is invalid';
              }
            });
          } else {
            self.error = 'Passwords are not identical';
          }
        }
      };
    }
  });
