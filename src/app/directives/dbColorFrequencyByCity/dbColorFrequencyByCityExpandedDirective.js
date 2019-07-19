angular.module('app').directive('hueDbColorFrequencyByCityExpanded', ['$timeout', function (timeout) {
  function link(scope, element, attrs) {
    scope.columns = [];
    scope.data = [];
    scope.activeRegionIndex = null;
    scope.activeCityIndex = null;
    scope.activeColorIndex = null;
    scope.tooltipsterConfig = {
      animation: 'fade',
      theme: 'tooltipster-default',
      trigger: 'custom',
      position: 'bottom'
    };

    var activeElement;
    scope.toggleActiveBar = function (event, regionIndex, cityIndex, colorIndex) {
      if (scope.activeRegionIndex == regionIndex && scope.activeCityIndex == cityIndex && scope.activeColorIndex == colorIndex) {
        scope.activeRegionIndex = null;
        scope.activeCityIndex = null;
        scope.activeColorIndex = null;
      } else {
        scope.activeRegionIndex = regionIndex;
        scope.activeCityIndex = cityIndex;
        scope.activeColorIndex = colorIndex;
      }

      if (activeElement)
        activeElement.tooltipster('hide');

      activeElement = $(event.currentTarget);

      if (scope.activeRegionIndex != null)
        timeout(function () {
          activeElement.tooltipster('show');
        }, 250);
    };
    scope.isBarActive = function (regionIndex, cityIndex, colorIndex) {
      return scope.activeRegionIndex == regionIndex && scope.activeCityIndex == cityIndex && scope.activeColorIndex == colorIndex;
    };

    scope.$watch('originalData', function (newValue, oldValue) {
      if (newValue && newValue.length) {
        scope.columns = new Array(_.max(newValue, function (item) {
          return item.colors.length;
        }).colors.length);
        scope.data = _.groupBy(newValue, 'regionId');
      }
      else {
        scope.columns = [];
        scope.data = [];
      }
    });
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbColorFrequencyByCity/dbColorFrequencyByCityExpandedView.html',
    link: link,
    scope: {
      originalData: '=data',
      toggleView: '&'
    }
  };
}]);
