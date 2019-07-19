angular.module('app').service('mainMenuRepository', function ($http, appConfig, authService) {
  this.getHueProducts = function (callback) {
    $http.get(appConfig.webServiceUrl + 'products.jsonp', {
      params: {
        token: authService.token
      }
    }).then(callback);
  };
});
