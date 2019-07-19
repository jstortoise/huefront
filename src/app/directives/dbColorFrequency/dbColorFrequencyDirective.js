angular.module('app').directive('hueDbColorFrequency', function () {
  function link(scope, element, attrs) {
    scope.tooltipsterConfig = {
      animation: 'fade',
      theme: 'tooltipster-default',
      trigger: 'custom',
      position: 'bottom'
    };

    scope.activeIndex = 0;
    scope.data = null;
    scope.selectedBar = null;

    scope.expandedGroupClass = null;
    scope.setExpandedGroupClass = function (groupClass) {
      scope.expandedGroupClass = groupClass;
    };
    scope.showSearchedColor = function () {
      return scope.searchedColor != null;
    };
    scope.getClass = function () {
      var result = [];
      if (scope.expandedGroupClass)
        result.push(scope.expandedGroupClass);
      if (scope.showSearchedColor())
        result.push('with-searched-color');

      return result.join(' ');
    };

    scope.selectBar = function (event) {
      if (scope.selectedBar == event.target) {
        angular.element(scope.selectedBar).tooltipster('hide');
        scope.selectedBar = null;
      } else {
        if (scope.selectedBar)
          angular.element(scope.selectedBar).tooltipster('hide');

        angular.element(event.target).tooltipster('show');
        scope.selectedBar = event.target;
      }
    };

    scope.$watch('originalData', function (newValue, oldValue) {
      if (newValue instanceof Array)
        scope.data = newValue[scope.activeColor];
      else
        scope.data = newValue;
    });

    scope.$watch('activeColor', function (newValue, oldValue) {
      if (scope.originalData instanceof Array && newValue != null)
        scope.data = scope.originalData[newValue];
    });
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbColorFrequency/dbColorFrequencyView.html',
    link: link,
    scope: {
      originalData: '=data',
      searchedColor: '=',
      activeColor: '='
    }
  };
});
