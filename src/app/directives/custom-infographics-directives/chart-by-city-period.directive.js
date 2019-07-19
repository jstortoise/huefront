(function () {
  'use strict';

  angular.module('app').directive('hueChartByCityPeriod',
    [
      'common', 'config', 'chartsHelper',
      function (common, config, chartsHelper) {

        function link(scope, element, attributes) {

//                scope.value = '';
          scope.$watch('data', bindData);

//                bindData();

          function bindData() {

            var maxValue = _.max(_.map(scope.data, function (d) {
              return d.value;
            }));

            var options = {
              // bars: {
              //   maxValue: maxValue
              // }
            };
            options.layout = {
              mode: scope.mode && scope.mode.extraView ? 'colors' : 'default',
              padding: {
                left: 10,
                right: 10,
                top: 75,
                bottom: 0
              }
            };

            _.each(scope.data,
              function (d) {
                d.color = d.name;
//                            d.value = d.value / maxValue * 100;
              });

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
            data: '=',
            mode: '='
          },
          templateUrl: 'app/directives/custom-infographics-directives/chart-by-city-period.html'
        };

        return directive;

      }
    ]);

  angular.module('app').directive('hueChartByCityPeriodColors',
    [
      'common', 'config', 'chartsHelper', 'reduceValue',
      function (common, config, chartsHelper, reduceValue) {

        function link(scope, element, attributes) {
          scope.$watch('data', bindData);
          function bindData() {
            if (!scope.data) {
              return;
            }
            var colorsAmount = 15;
            scope.groups = _.map(scope.data, function (d) {
              if (d.colors.length < 15) {
                for (var i = d.colors.length - 1; i <= 15; i++) {
                  d.colors.push({isEmpty: true});
                }
              }
              d.colors.reverse();
              return {
                title: d.title,
                colors: d.colors.map(function (color, i) {
                  if (!color) {
                    return {
                      isEmpty: true
                    };
                  }
                  return {
                    color: color
                  };
                })
              };
            });

            var container = $(element.find('[chart-type="bottom"]'));
            container.html('');

            var colors = _.map(scope.data,
              function (d) {
                var value = Math.round(d.percentage * 100);
                return {
                  value: reduceValue.reduce(d.value),
                  valueTitle: Math.round(value) + '%',
                  value2: reduceValue.reduce(d.value),
                  valueTitle2: Math.round(d.percentage * 100),
                  title: d.title,
                  color: d.color
                }
              });
            var ch = new chartDotsHorizontal({
              data: colors,
              container: container[0],
              options: {}
            });

          }
        }

        var directive = {
          link: link,
          restrict: 'E',
          replace: true,
          scope: {
            data: '=',
            mode: '='
          },
          templateUrl: 'app/directives/custom-infographics-directives/chart-by-city-period-colors.html'
        };

        return directive;

      }
    ]);
}());
