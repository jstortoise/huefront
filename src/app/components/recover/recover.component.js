angular
  .module('app')
  .component('recoverComponent', {
    templateUrl: 'app/components/recover/recover.tmpl.html',
    controller: function ($state, $http, appConfig) {
      var self = this;
      this.successRequest = false;
      this.email = '';
      this.error = false;

      this.onSendLoginClick = function () {
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
    }
  });
