angular
  .module('app')
  .component('staffLoginComponent', {
    templateUrl: 'app/components/staff-login/staff-login.tmpl.html',
    controller: function (authService, appConfig, $state) {
      var self = this;
      self.buttonGoogleUrl = appConfig.dashboardServiceUrl + 'auth/google_oauth2';
      this.email = '';
      this.password = '';
      this.isRemembered = false;
      this.error = '';

      this.login = function () {
        self.error = false;
        authService.login(this.email, this.password, this.isRemembered)
          .then(function (data) {
            if (data && data.success) {
              $state.go('landing');
            } else {
              self.error = true;
            }
          });
      };
    }
  })