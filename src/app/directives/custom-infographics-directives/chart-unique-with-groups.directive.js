(function () {
  'use strict';

  angular.module('app').directive('hueChartUniqueWithGroups',
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

            scope.season = scope.data.season;
            scope.year = scope.data.year;

            var containerGroups = element.find('[chart-type="groups"]').html('');
            var containerCommon = element.find('[chart-type="common"]').html('');
            var containerUnique = element.find('[chart-type="unique"]').html('');

            var groups = _.map(scope.data.groups, function (c) {
              return {
                value: c.value,
                valueTitle: Math.round(c.percentage * 100) + '%',
                value2: c.value,//Math.round(c.value * 1000),
                valueTitle2: Math.round(c.percentage * 100),
                title: c.title,
                color: c.color
              }
            });

            var colors = _.map(scope.data.common, function (c) {
              return {
                value: c.value,
                valueTitle: Math.round(c.percentage * 100) + '%',
                value2: c.value,//Math.round(c.value * 1000),
                valueTitle2: Math.round(c.percentage * 100),
                title: c.color,
                color: c.color
              }
            });

            var ch = new chartSpheric({
              data: scope.data.unique,
              container: containerUnique[0],
              options: {}
            });

            ch = new chartDotsHorizontal({
              data: colors,
              container: containerCommon[0],
              options: {}
            });

            ch = new chartBoxLinearHorizontal({
              data: groups,
              container: containerGroups[0],
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
        }

        var directive = {
          link: link,
          restrict: 'E',
          replace: true,
          scope: {
            data: '='
          },
          templateUrl: 'app/directives/custom-infographics-directives/chart-unique-with-groups.html'
        };

        return directive;

      }
    ]);
}());
