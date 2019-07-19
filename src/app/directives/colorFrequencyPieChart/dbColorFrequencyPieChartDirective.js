angular.module('app').directive('hueColorFrequencyPieChart', ['$timeout', function (timeout) {
  function link(scope, element, attrs) {
    scope.pieData = null;
    scope.selectedIndex = null;
    scope.showTitle = true;
    scope.selectedColorTitle = null;
    scope.selectedColorNcs = null;
    scope.allowClicks = false;

    timeout(function () { // make a delay to avoid lags
      scope.pieData = _.map(scope.data.colors, function (item, index) {
        return {c: item.color.hex, p: item.percentage, t: item.title};
      });
    }, 1000);

    scope.getButtonId = function (btnName) {
      return 'cfpc-' + scope.$id + '-btn-' + btnName;
    };

    scope.selectItem = function (index) {
      if (scope.allowClicks) {
        scope.allowClicks = false;
        scope.selectedIndex = scope.selectedIndex == index ? null : index;

        if (scope.selectedIndex != null) {
          scope.showTitle = false;

          var titles = scope.data.colors[scope.selectedIndex].title.split('/');
          scope.selectedColorTitle = titles[0];
          scope.selectedColorNcs = titles[1];
        } else {
          scope.showTitle = true;
        }
      }
    };
    scope.isItemSelected = function (index) {
      if (index != undefined)
        return index == scope.selectedIndex;
      return scope.selectedIndex != null;
    };

    scope.colorClickHandler = function (index) {
      if (scope.allowClicks) {
        scope.selectItem(index);
        scope.$digest();
      }

    };
    scope.collapseClickHandler = function () {
      if (scope.allowClicks) {
        scope.selectItem(null);
        scope.$digest();
      }
    };
    scope.animationCompleteHandler = function () {
      scope.allowClicks = true;
    };
  }

  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'app/directives/colorFrequencyPieChart/dbColorFrequencyPieChartView.html',
    link: link,
    scope: {
      data: '=',
      initialized: '='
    }
  };
}]);
