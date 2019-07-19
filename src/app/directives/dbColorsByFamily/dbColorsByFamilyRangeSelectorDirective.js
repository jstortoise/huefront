angular.module('app').directive('hueDbColorsByFamilyRangeSelector', ['$location', function (location) {
  function link(scope, element, attrs) {
    scope.data = [{title: '5', value: 5}, {title: '10', value: 10}, {title: '20', value: 20}];
    scope.selectedValue = scope.data[0].value;

    scope.isYear = function (bucket) {
      return bucket == scope.selectedValue;
    };
    scope.setYear = function (bucket) {
      scope.selectedValue = bucket;
    };
  }

  return {
    restrict: 'E',
    template: '<ul class="db-colors-by-family-range-selector"><li ng-class="{active: isYear(item.value)}" ng-click="setYear(item.value)" ng-bind="item.title" ng-repeat="item in data"></li></ul>',
    link: link,
    scope: {
      selectedValue: '='
    }
  };
}]);
