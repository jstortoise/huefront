angular.module('app').controller('yearAutoController',
  ['$scope', function (scope) {
    // Behaviour
    scope.topColorsExpanded = false;
    scope.toggleTopColorsExpandedMode = function () {
      scope.topColorsExpanded = !scope.topColorsExpanded;
    };

    scope.topFamiliesExpanded = false;
    scope.toggleTopFamiliesExpandedMode = function () {
      scope.topFamiliesExpanded = !scope.topFamiliesExpanded;
    };

    scope.colorFrequencyExpanded = false;
    scope.toggleColorFrequencyExpandedMode = function () {
      scope.colorFrequencyExpanded = !scope.colorFrequencyExpanded;
    };

    scope.colorPaletteExpanded = false;
    scope.toggleColorPaletteExpandedMode = function () {
      scope.colorPaletteExpanded = !scope.colorPaletteExpanded;
    };
  }]);
