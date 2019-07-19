angular.module('app').controller('colorBrandingController',
  ['$scope', function (scope) {
    // Behaviour
    scope.topColorsExpanded = false;
    scope.toggleTopColorsExpandedMode = function () {
      scope.topColorsExpanded = !scope.topColorsExpanded;
    };

    scope.colorFrequencyExpanded = false;
    scope.toggleColorFrequencyExpandedMode = function () {
      scope.colorFrequencyExpanded = !scope.colorFrequencyExpanded;
    };

    scope.mapExpanded = false;
    scope.toggleMapExpandedMode = function () {
      scope.mapExpanded = !scope.mapExpanded;
    };
  }]);
