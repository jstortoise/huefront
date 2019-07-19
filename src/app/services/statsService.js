angular.module('app')
  .service('statsService', ['localStorageService', 'appConfig', '$http',
    function (localStorageService, appConfig, $http) {
      var self = this;

      self.pageCounter = function () {
        $http.put(appConfig.dashboardServiceUrl + 'users_stats/page_count', localStorageService.get('currentUser'))
          .then(function (res) {
          });
      };

      self.infographics = function () {
        $http.put(appConfig.dashboardServiceUrl + 'users_stats/infographics', localStorageService.get('currentUser'))
          .then(function (res) {
          });
      };
    }
  ]);
