angular.module('app').directive('hueDbLogoDetails', ['$http', 'appConfig', 'authService', function (http, appConfig, authService) {
  function link(scope, element, attrs) {
    scope.url = null;
    scope.title = null;
    scope.industry = null;
    scope.country = null;
    scope.symbol = null;
    scope.attributes = [];
    scope.colors = [];

    scope.saveInputVisible = false;
    scope.imageName = null;

    scope.showMoreVisible = false;
    scope.showLessVisible = false;
    scope.showAttributes = true;
    scope.maxColors = 4;
    scope.showMoreClick = function () {
      scope.maxColors = scope.colors.length;
      scope.showMoreVisible = false;
      scope.showLessVisible = true;
      scope.showAttributes = false;
    };
    scope.showLessClick = function () {
      scope.maxColors = 4;
      scope.showMoreVisible = true;
      scope.showLessVisible = false;
      scope.showAttributes = true;
    };

    http.jsonp(appConfig.webServiceUrl + 'bio.jsonp', {
      params: {
        id: scope.logoId,
        token: authService.token,
        callback: 'JSON_CALLBACK'
      }
    }).success(function (data) {
      scope.url = data.url;
      scope.title = data.bio.company_title;
      scope.industry = data.bio.industry_title;
      scope.country = data.bio.country;
      scope.symbol = data.bio.symbol;
      scope.attributes = data.bio.attributes;
      scope.colors = data.bio.colors;

      if (scope.colors.length > 4)
        scope.showMoreVisible = true;
    });

    scope.closeClickHandler = function () {
      scope.onClose();
    };

    scope.showSaveInput = function () {
      scope.saveInputVisible = true;
    };

    scope.saveImage = function () {
      scope.imageName = null;
      scope.saveInputVisible = false;
    };
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbLogos/dbLogoDetailsView.html',
    link: link,
    scope: {
      logoId: '=',
      onClose: '&'
    }
  };
}]);
