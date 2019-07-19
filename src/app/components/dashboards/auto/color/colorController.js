angular.module('app').controller('colorAutoController',
  ['$scope', function (scope) {
    // Behaviour
    scope.topColorsExpanded = false;
    scope.toggleTopColorsExpandedMode = function () {
      scope.topColorsExpanded = !scope.topColorsExpanded;
    };
  }]);
