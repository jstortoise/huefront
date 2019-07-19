angular
  .module('app')
  .component('unsubscribeComponent', {
    templateUrl: 'app/components/unsubscribe/unsubscribe.tmpl.html',
    controller: function ($http, appConfig, $stateParams) {
      var self = this;
      self.success = true;
      $http.get(appConfig.dashboardServiceUrl + 'unsubscribe.json', {params: {token: $stateParams.token}})
        .then(function (res) {
          if (res.data && res.data.success) {
            self.success = res.data.success;
          }
        });
    }
  });
