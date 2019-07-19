angular.module('app').controller('brandBrandingController',
  ['$scope', function (scope) {
    // Behaviour
    scope.colorFrequencyExpanded = false;
    scope.toggleColorFrequencyExpandedMode = function () {
      scope.colorFrequencyExpanded = !scope.colorFrequencyExpanded;
    };

    scope.mapExpanded = false;
    scope.toggleMapExpandedMode = function () {
      scope.mapExpanded = !scope.mapExpanded;
    };

    scope.showLogoDetails = false;
    scope.toggleLogoDetails = function () {
      scope.showLogoDetails = scope.showLogoDetails ? false : true;
    };
  }]);
