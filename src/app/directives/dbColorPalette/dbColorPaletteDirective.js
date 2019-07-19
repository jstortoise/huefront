angular.module('app').directive('hueDbColorPalette', ['$location', function (location) {
  function link(scope, element, attrs) {
    scope.expandedViewTables = [];

    scope.goToColor = function (index) {
      scope.setColor()(scope.data[index].color);
    };

    scope.$watch('data', function (newValue, oldValue) {
      if (newValue) {
        var tableCount = Math.ceil(newValue.length / 24);
        scope.expandedViewTables = [];
        for (var i = 0; i < tableCount; i++)
          scope.expandedViewTables.push(i);
      } else
        scope.expandedViewTables = [];
    });
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbColorPalette/dbColorPaletteView.html',
    link: link,
    scope: {
      data: '=',
      isExpanded: '=',
      setColor: '&'
    }
  };
}]);
