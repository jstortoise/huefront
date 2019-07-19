angular.module('app').directive('hueDbFlagColors', function () {
  function link(scope, element, attrs) {
    scope.itemWidth = '0%';
    scope.flagIndex = 0;

    scope.$watch('data', function (newValue, oldValue) {
      if (newValue) {
        scope.itemWidth = 100 / (newValue.length - 1) + '%';
        scope.flagIndex = newValue.length - 1;
      }
    });
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbFlagColors/dbFlagColorsView.html',
    link: link,
    scope: {
      data: '='
    }
  };
});
