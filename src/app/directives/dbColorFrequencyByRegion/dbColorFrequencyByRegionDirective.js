angular.module('app').directive('hueDbColorFrequencyByRegion', function () {
  function link(scope, element, attrs) {
    scope.tooltipsterConfig = {
      animation: 'fade',
      theme: 'tooltipster-default',
      trigger: 'custom',
      position: 'bottom'
    };
    scope.selectedBar = null;

    scope.selectBar = function (event) {
      if (scope.selectedBar == event.currentTarget) {
        angular.element(scope.selectedBar).tooltipster('hide');
        scope.selectedBar = null;
      } else {
        if (scope.selectedBar)
          angular.element(scope.selectedBar).tooltipster('hide');

        angular.element(event.currentTarget).tooltipster('show');
        scope.selectedBar = event.currentTarget;
      }
    };
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbColorFrequencyByRegion/dbColorFrequencyByRegionView.html',
    link: link,
    scope: {
      data: '='
    }
  };
});
