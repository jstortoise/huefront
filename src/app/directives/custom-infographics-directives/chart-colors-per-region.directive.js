(function () {
  'use strict';

  angular.module('app').directive('hueChartColorsPerRegion',
    [
      'common', 'config', 'chartsHelper',
      function (common, config, chartsHelper) {

        function link(scope, element, attributes) {
          // scope.value = '';
          scope.$watch('data', bindData);
          // bindData();

          function bindData() {
            if (!scope.data) {
              return;
            }

            var containers = element.find('[chart-block]');

            _.each(containers, function (c) {
              var container = $(c);
              var regionName = container.attr('chart-block');

              var containerBar = container.find('[chart-type="bar"]').html('');
              var containerMap = container.find('[chart-type="map"]').html('');

              var region = _.find(scope.data, {name: regionName});
              {
                var sum = _.sumBy(region.data, 'percentage');
                var data = _.map(region.data, function (d) {
                  var v = d.percentage / sum;
                  return {
                    value: v,
                    title: Math.round(d.percentage * 100) + '%',
                    color: d.color
                  }
                });

                if (!region || !region.data || !region.data.length) {
                  containerBar.append($('<p class="no-data">No data is available</p>'));
                } else {
                  var ch = new chartBoxLinearBarVertical({
                    data: data,
                    container: containerBar[0],
                    options: {}
                  });
                }

                var mapData = {
                  region: {
                    name: region.name,
                    cities: {
                      settings: {}
                    }
                  },
                  charts: {
                    settings: {},
                    data: []
                  }
                };
                ch = new chartComplexRegion({
                  data: mapData,
                  container: containerMap[0],
                  options: {}
                });

              }
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
          templateUrl: 'app/directives/custom-infographics-directives/chart-colors-per-region.html'
        };

        return directive;

      }
    ]);
}());
