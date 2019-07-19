angular.module('app').directive('hueTooltipster', ['$timeout', function (timeout) {
  function link(scope, element, attrs) {
    angular.element(element).ready(function () {
      angular.element(element).tooltipster(scope.hueTooltipster);
    });
  }

  return {
    restrict: 'A',
    link: link,
    scope: {
      hueTooltipster: '='
    }
  };
}]);
