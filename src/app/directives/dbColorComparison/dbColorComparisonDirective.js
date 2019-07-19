angular.module('app').directive('hueDbColorComparison', function () {
  function link(scope, element, attrs) {
    scope.Math = Math;

    scope.tooltipsterConfig = {
      animation: 'fade',
      theme: 'tooltipster-default',
      trigger: 'custom',
      position: 'bottom'
    };
    scope.selectedBar = null;

    scope.selectBar = function (event) {
      if (scope.selectedBar == event.currentTarget) {
        $(scope.selectedBar).tooltipster('hide');
        scope.selectedBar = null;
      } else {
        if (scope.selectedBar)
          $(scope.selectedBar).tooltipster('hide');

        $(event.currentTarget).tooltipster('show');
        scope.selectedBar = event.currentTarget;
      }
    };
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbColorComparison/dbColorComparisonView.html',
    link: link,
    scope: {
      data: '='
    }
  };
});
