(function () {
  'use strict';

  angular.module('app').directive('hueChartByRegionPeriod',
    [
      'common', 'config', 'chartsHelper',
      function (common, config, chartsHelper) {
        function link(scope, element, attributes) {
          // scope.value = '';
          // bindData();
          scope.$watch('data', bindData);

          function bindData() {
            var model = scope.data;
            if (!model) {
              return;
            }

            if (model.region.name === 'europe') {
              model.region.cities.data = model.region.cities.data.reverse();
            }

            var container = chartsHelper.initContainer(element, '[chart-type="region"]');
            var containerLinear = chartsHelper.initContainer(element, '[chart-type="linear-h"]');

            prepareLinearBars();
            prepareRegionChart();

            function prepareLinearBars() {
              var groups = _.map(model.charts.data, function (c) {
                return {
                  value: c.value,
                  valueTitle: Math.round(c.percentage * 100) + '%',
                  value2: c.value, //Math.round(c.value * 1000),
                  valueTitle2: Math.round(c.percentage * 100),
                  title: c.title,
                  color: c.color
                };
              });

              var ch = new chartBoxLinearHorizontal({
                data: groups,
                container: containerLinear[0],
                options: {
                  layout: {
                    bars: {
                      separator: {
                        radius: 6
                      }
                    }
                  }
                }
              });
            }

            function prepareRegionChart() {
              // vm.meta.regions = common.generic.regions;

              var ch = new chartComplexRegion({
                data: {region: model.region},
                container: container[0],
                options: {}
              });
            }
          }
        }

        var directive = {
          link: link,
          restrict: 'E',
          scope: {
            data: '='
          },
          templateUrl: 'app/directives/custom-infographics-directives/chart-by-region-period.html'
        };

        return directive;
      }
    ]);
}());
