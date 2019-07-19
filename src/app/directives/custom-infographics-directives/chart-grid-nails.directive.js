(function () {
  'use strict';

  angular.module('app').directive('hueChartGridNails',
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
            var totalAchr = 0;
            var totalChr = 0;
            scope.data[0].data.forEach(function (t) {
              if (t.group === 'achr' && t.value) {
                totalAchr += t.value;
              }
              if (t.group === 'chr' && t.value) {
                totalChr += t.value;
              }
            });
            totalAchr = Math.round((totalAchr / (totalAchr + totalChr)) * 100) || 0;
            totalChr = totalAchr ? 100 - totalAchr : 0;
            var data = {
              groups: [{title: totalChr + '% ACHROMATIC COLORS', name: 'chr'},
                {title: totalAchr + '% CHROMATIC COLORS', name: 'achr'}]
            };

            data.periods = _.map(scope.data, function (d) {
              return {title: d.title};
            });

            data.data = _.map(scope.data[0].data, function (d0, i) {
              var dResult = [];
              for (var j = 0; j < scope.data.length; j++) {
                var d = scope.data[j];
                var perc = d.data[i].percentage || 0;
                dResult.push({
                  title: (Math.round(perc * 1000) / 10) + '%',
                  value: perc
                });
              }

              return {
                title: d0.title,
                color: d0.color,
                group: d0.group,
                value: d0.value,
                data: dResult,
                colors: d0.colors
              };
            });

            var container = element.find('[chart-type]').html('');

            var ch = new chartNailsLinearVertical({
              data: data,
              container: container[0],
              options: {
                layout: {
                  mode: scope.mode && scope.mode.extraView ? 'colors' : 'default'
                }
              }
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
          templateUrl: 'app/directives/custom-infographics-directives/chart-grid-nails.html'
        };

        return directive;

      }
    ]);
}());
