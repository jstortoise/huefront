angular.module('app').directive('hueDbColorPaletteBucketSelector', ['$location', function (location) {
  function link(scope, element, attrs) {
    scope.data = [
      {title: '38', value: 38},
      {title: '250', value: 250},
      {title: '1025', value: 1025},
      {title: 'NCS', value: 1950}
    ];
    scope.selectedValue = scope.data[0].value;

    scope.isColorPaletteBucket = function (bucket) {
      return bucket == scope.selectedValue;
    };
    scope.setColorPaletteBucket = function (bucket) {
      scope.onChange()(bucket);
      scope.selectedValue = bucket;
    };
  }

  return {
    restrict: 'E',
    template: '<ul class="color-palette-bucket-selector">' +
    '<li ng-class="{active: isColorPaletteBucket(item.value)}"' +
    'ng-click="setColorPaletteBucket(item.value)" ' +
    'ng-bind="item.title" ' +
    'ng-repeat="item in data"></li>' +
    '</ul>',
    link: link,
    scope: {
      selectedValue: '=',
      onChange: '&'
    }
  };
}]);
