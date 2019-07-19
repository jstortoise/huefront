(function () {
  'use strict';

  angular.module('app').directive('hueChartNails',
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
            scope.data.forEach(function (t) {
              if (t.group === 'achr') {
                totalAchr += t.value;
              }
              if (t.group === 'chr') {
                totalChr += t.value;
              }
            });
            totalAchr = Math.round(totalAchr / (totalAchr + totalChr) * 100);
            totalChr = 100 - totalAchr;
            var data = {
              groups: [{title: totalChr + '% ACHROMATIC COLORS', name: 'chr'},
                {title: totalAchr + '% CHROMATIC COLORS', name: 'achr'}]
            };

            data.data = scope.data;

            var container = element.find('[chart-type]').html('');

            var ch = new chartNailsLinearVerticalSimple({
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
          templateUrl: 'app/directives/custom-infographics-directives/chart-nails.html'
        };

        return directive;

      }
    ]);
}());
