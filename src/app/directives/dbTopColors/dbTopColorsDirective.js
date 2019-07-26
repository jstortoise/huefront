angular.module('app').directive('hueDbTopColors', function () {
  function link(scope, element, attrs) {

    scope.chartdata = [];
    scope.label = [];
    //scope.chartoptions = [];
    scope.option = { cutoutPercentage: 80 };
    scope.color = [];
    for(item in scope.data)
    {
      scope.chartdata.push(scope.data[item].percentage);
      scope.label.push(scope.data[item].color.ncs);
      scope.color.push(scope.data[item].color.hex);
    }
    console.log(scope.chartdata);
    scope.selectedColor = null;
    scope.toggleColor = function (index) {
      scope.selectedColor = scope.selectedColor == index ? null : index;
    };
    scope.isColorSelected = function (index) {
      if (index != null)
        return scope.selectedColor == index;
      return scope.selectedColor != null;
    };
    scope.getBarHeight = function (index) {
      if (scope.selectedColor == null)
        return scope.data[index].percentage + '%';
      return scope.selectedColor == index ? '100%' : '0%';
    };
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbTopColors/dbTopColorsView.html',
    link: link,
    scope: {
      data: '='
    }
  };
});
