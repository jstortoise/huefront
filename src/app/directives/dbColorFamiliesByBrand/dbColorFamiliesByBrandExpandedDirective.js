angular.module('app').directive('hueDbColorFamiliesByBrandExpanded', function () {
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
    templateUrl: 'app/directives/dbColorFamiliesByBrand/dbColorFamiliesByBrandExpandedView.html',
    link: link,
    scope: {
      data: '=',
      toggleView: '&'
    }
  };
});
