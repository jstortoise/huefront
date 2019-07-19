(function () {
  'use strict';

  angular.module('app').directive('hueChartBySeasonFiveYears',
    [
      'common', 'config', 'chartsHelper',
      function (common, config, chartsHelper) {

        function link(scope, element, attributes) {
          scope.$watch('data', bindData);

          function bindData() {
            var containers = element.find('.f-season');
            if (scope.data) {
              scope.data.reverse();
            }
            _.each(containers, function (c, i) {
              var data = (scope.data || [])[i];
              if (!data) {
                return;
              }
              c = $(c);

              c.find('h3').text(getAbbr(data.season) + data.year);

              var containerUnique = c.find('[chart-type="unique"]').html('');
              var ch = new chartSpheric({
                data: data.colorsUnique,
                container: containerUnique[0],
                options: {}
              });

              var container = c.find('[chart-type="top4"]').html('');
              var colors = _.map(data.colors, function (c) {
                return {
                  value: c.value,
                  valueTitle: Math.round(c.percentage * 100) + '%',
                  value2: c.value,//Math.round(c.value * 1000),
                  valueTitle2: Math.round(c.percentage * 100),
                  title: c.color,
                  color: c.color
                }
              });

              ch = new chartDotsHorizontal({
                data: colors,
                container: container[0],
                options: {}
              });

            });
            return;
            var n = Math.round(Math.random() * 4 - .5);
            var maxR = n !== 1 ? 255 : Math.round(Math.random() * 255 - .5);
            var maxG = n !== 2 ? 255 : Math.round(Math.random() * 255 - .5);
            var maxB = n !== 3 ? 255 : Math.round(Math.random() * 255 - .5);
            var count = Math.random() * 1000 + 100;
            for (var l = 0; l < count; l++) {
              var color = String.format('rgb({0},{1},{2})', Math.round(Math.random() * maxR), Math.round(Math.random() * maxG), Math.round(Math.random() * maxB));
              result.push({
                color: color,
                title: color
              });
            }

            ch = new chartSpheric({
              data: dataPrepared,
              container: container,
              options: {}
            });

            result.push({
              value: value,
              valueTitle: Math.round(value) + '%',
              value2: Math.round(Math.random() * 1000),
              valueTitle2: Math.round(Math.random() * 1000),
              title: _colors[i].title,
              color: _colors[i].color
            });

            ch = new chartDotsHorizontal({
              data: dataPrepared,
              container: container,
              options: {}
            });

          }

          function getAbbr(value) {
            if (value === 'Fall') {
              return 'FW';
            } else if (value === 'Pre-Fall') {
              return 'PF';
            } else if (value === 'Spring') {
              return 'SS';
            } else if (value === 'Resort') {
              return 'RS';
            } else if (value === 'ALL SEASONS') {
              return 'ALL';
            } else {
              return value;
            }
          }
        }

        var directive = {
          link: link,
          restrict: 'E',
          replace: true,
          scope: {
            data: '='
          },
          templateUrl: 'app/directives/custom-infographics-directives/chart-by-season-five-years.html'
        };

        return directive;

      }
    ]);

  angular.module('app').directive('hueChartBySeasonFiveYearsColors',
    [
      'common', 'config', 'chartsHelper', 'reduceValue', 'colorSortService',
      function (common, config, chartsHelper, reduceValue, colorSortService) {
        function link(scope, element, attributes) {
          scope.$watch('data', bindData);

          function bindData() {

            if (!scope.data) {
              return;
            }

            scope.palettes = scope.data.splice(14, 1)[0];
            var palettes = {};
            var keys = [];
            for (var k in scope.palettes) {
              keys.push(k);
            }
            keys.reverse().forEach(function (key) {
              palettes[key] = scope.palettes[key];
            });
            scope.palettes = palettes;

            scope.palettes[Object.keys(scope.palettes)[0]] = colorSortService(scope.palettes[Object.keys(scope.palettes)[0]], 24);
            scope.mainSeason = scope.palettes[Object.keys(scope.palettes)[0]];
            scope.mainTitle = Object.keys(scope.palettes)[0];
            delete scope.palettes[Object.keys(scope.palettes)[0]];

            _.forEach(scope.palettes, function (value, key) {
              scope.palettes[key] = colorSortService(value, 21);
            });
            scope.mainSeason = _.chunk(scope.mainSeason, 4);

            var container = element.find('[chart-type="groups"]');
            var colors = _.map(scope.data, function (d) {
              var value = Math.round(d.percentage * 100);
              return {
                value: reduceValue.reduce(d.value, '1'),
                valueTitle: Math.round(d.percentage * 100) + '%',
                value2: reduceValue.reduce(d.value, '1'),
                valueTitle2: Math.round(d.percentage * 100),
                title: d.title,
                color: d.color
              };
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
          templateUrl: 'app/directives/custom-infographics-directives/chart-by-season-five-years-colors.html'
        };

        return directive;

      }
    ]);
}());
