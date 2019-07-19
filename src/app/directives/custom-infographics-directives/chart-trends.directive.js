(function () {
  'use strict';

  angular.module('app').directive('hueChartTrends',
    [
      'common', 'config', 'chartsHelper',
      function (common, config, chartsHelper) {

        function link(scope, element, attributes) {

//                scope.value = '';
          scope.$watch('data', bindData);

//                bindData();

          function bindData() {

            if (!scope.data) {
              return;
            }

            var container = element/*.find('[chart-type]')*/.html('');

            var bars = [];
            var data = {
              periods: _.map(scope.data, function (d) {
                return {title: d.title};
              }),
              data: bars
            };

            _.each(scope.data, function (period) {
              _.each(_.sortBy(period.data, 'value').reverse(), function (d, i) {
                var bar = _.find(bars, {name: d.name});
                if (!bar) {
                  bar = {
                    name: d.name,
                    title: i + 1,
                    points: [],
                    color: d.color
                  };
                  if (d.color === '#ffffff') {
                    bar.color = '#efefef';
                  }
                  bars.push(bar);
                }

                bar.points.push({value: i});
              });
            });

            var ch = new chartGraphLinearHorizontal({
              data: data,
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
            data: '='
          },
          templateUrl: 'app/directives/custom-infographics-directives/chart-trends.html'
        };

        return directive;

      }
    ]);
}());
