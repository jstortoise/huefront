angular.module('app').directive('hueDbColorFrequencyColorPicker', function () {
  function link(scope, element, attrs) {
    scope.setActiveColor = function (index) {
      scope.activeColor = index;
    };
    scope.isColorActive = function (index) {
      return scope.activeColor == index;
    };
  }

  return {
    restrict: 'E',
    template: '<ul class="db-color-frequency-color-picker"><li ng-style="{\'border-top-color\': item.hex}" ng-class="{active: isColorActive($index)}" ng-bind="item.color" ng-click="setActiveColor($index)" ng-repeat="item in data"></li></ul>',
    link: link,
    scope: {
      data: '=',
      activeColor: '='
    }
  };
});
