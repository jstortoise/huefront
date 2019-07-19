angular.module('app').directive('hueDbTopColorsByYear', ['$timeout', function (timeout) {
  function link(scope, element, attrs) {
    scope.activeBars = [];
    scope.tooltipsterOddConfig = {
      animation: 'fade',
      theme: 'tooltipster-default',
      trigger: 'custom',
      position: 'bottom'
    };
    scope.tooltipsterConfig = {
      animation: 'fade',
      theme: 'tooltipster-default',
      trigger: 'custom',
      position: 'top'
    };

    scope.dataRendered = false;
    scope.onDataRendered = function () {
      scope.dataRendered = true;
    };

    scope.getButtonId = function (btnName) {
      return 'db-tcby-' + scope.$id + '-btn-' + btnName;
    };
    scope.carouselVisibleFunction = function (items) {
      return items - 1;
    };

    var activeElement;
    scope.selectBar = function (event, groupIndex, barIndex) {
      if (activeElement)
        activeElement.tooltipster('hide');

      activeElement = angular.element(event.currentTarget);

      scope.activeBars[groupIndex] = scope.activeBars[groupIndex] == barIndex ? null : barIndex;

      if (scope.activeBars[groupIndex] != null)
        timeout(function () {
          activeElement.tooltipster('show');
        }, 250);
    };
    scope.isBarSelected = function (groupIndex, barIndex) {
      return scope.activeBars[groupIndex] == barIndex;
    }

    scope.$watch('data', function (newValue, oldValue) {
      scope.activeBars = [];
    });
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbTopColorsByYear/dbTopColorsByYearView.html',
    link: link,
    scope: {
      data: '='
    }
  };
}]);
