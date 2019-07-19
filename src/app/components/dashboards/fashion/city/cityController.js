angular.module('app').controller('cityFashionController',
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

    scope.colorFrequencyByRegionExpanded = false;
    scope.toggleColorFrequencyByRegionExpandedMode = function () {
      scope.colorFrequencyByRegionExpanded = !scope.colorFrequencyByRegionExpanded;
    };

    scope.colorFrequencyBySeasonExpanded = false;
    scope.toggleColorFrequencyBySeasonExpandedMode = function () {
      scope.colorFrequencyBySeasonExpanded = !scope.colorFrequencyBySeasonExpanded;
    };

    scope.colorPaletteExpanded = false;
    scope.toggleColorPaletteExpandedMode = function () {
      scope.colorPaletteExpanded = !scope.colorPaletteExpanded;
    };

    scope.designerImagesExpanded = false;
    scope.toggleDesignerImagesExpandedMode = function () {
      scope.designerImagesExpanded = !scope.designerImagesExpanded;
    };
  }]);
