(function () {
  'use strict';
  angular.module('app').directive('hueChartCitiesByColorPeriod',
    ['common', 'config', 'chartsHelper',
      function (common, config, chartsHelper) {
        function link(scope, element, attributes) {
//                scope.value = '';
          scope.$watch('data', bindData);
//                bindData();
          function bindData() {
            var options = {
//                        bars: {
//                            maxValue: 1
//                        }
            };
            options.layout = {
              padding: {
                left: 10,
                right: 10,
                top: 75,
                bottom: 0
              }
            };

            var container = chartsHelper.initContainer(element);

            var ch = new chartBubbledLines({
              data: scope.data || {},
              container: container[0],
              options: options
            });
          }
        }

        var directive = {
          link: link,
          restrict: 'E',
          replace: true,
          scope: {
            data: '='
          },
          templateUrl: 'app/directives/custom-infographics-directives/chart-cities-by-color-period.html'
        };

        return directive;

      }
    ]);
}());
