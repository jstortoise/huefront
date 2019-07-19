(function () {
  'use strict';

  angular.module('app').directive('hueChart',
    [
      'common', 'config',
      function (common, config) {
        function link(scope, element, attributes) {
          $(element).toggleClass('hue-chart', true);
//                scope.value = '';
        }

        var directive = {
          link: link,
          restrict: 'E',
          scope: {},
          templateUrl: 'app/directives/custom-infographics-directives/chart-by-city-period.html'
        };

        return directive;
      }
    ]);
}());
