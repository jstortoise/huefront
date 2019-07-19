(function () {
  'use strict';

  angular.module('app').directive('hueChartColorsUniqueWithGroupsPerSeason',
    [
      'common', 'config', 'chartsHelper', 'reduceValue',
      function (common, config, chartsHelper, reduceValue) {
        var _colors = [
          {
            "value": 220,
            "color": "#f5f5dc",
            "percentage": 0.11777301927194861,
            "title": "Beige",
            "group": "achr"
          }, {
            "value": 20,
            "color": "#000000",
            "percentage": 0.010706638115631691,
            "title": "Black",
            "group": "chr"
          }, {
            "value": 158,
            "color": "#0000ff",
            "percentage": 0.08458244111349036,
            "title": "Blue",
            "group": "achr"
          }, {
            "value": 124,
            "color": "#964b00",
            "percentage": 0.06638115631691649,
            "title": "Brown",
            "group": "achr"
          }, {
            "value": 174,
            "color": "#00ffff",
            "percentage": 0.09314775160599571,
            "title": "Cyan",
            "group": "achr"
          }, {
            "value": 306,
            "color": "#c0c0c0",
            "percentage": 0.16381156316916487,
            "title": "Gray",
            "group": "achr"
          }, {
            "value": 62,
            "color": "#008000",
            "percentage": 0.033190578158458245,
            "title": "Green",
            "group": "achr"
          }, {
            "value": 64,
            "color": "#ff00ff",
            "percentage": 0.034261241970021415,
            "title": "Magenta",
            "group": "achr"
          }, {
            "value": 191,
            "color": "#ff7f00",
            "percentage": 0.10224839400428265,
            "title": "Orange",
            "group": "achr"
          }, {
            "value": 158,
            "color": "#ff0000",
            "percentage": 0.08458244111349036,
            "title": "Red",
            "group": "achr"
          }, {
            "value": 146,
            "color": "#8f00ff",
            "percentage": 0.07815845824411134,
            "title": "Violet",
            "group": "achr"
          }, {
            "value": 3,
            "color": "#ffffff",
            "percentage": 0.0016059957173447537,
            "title": "White",
            "group": "chr"
          }, {
            "value": 103,
            "color": "#ffff00",
            "percentage": 0.05513918629550321,
            "title": "Yellow",
            "group": "achr"
          }, {
            "value": 139,
            "color": "#8db600",
            "percentage": 0.07441113490364026,
            "title": "Yellow/Green",
            "group": "achr"
          }
        ];

        function link(scope, element, attributes) {

//                scope.value = '';
          scope.$watch('data', bindData);

//                bindData();

          function bindData() {

            if (!scope.data) {
              return;
            }

            scope.city = scope.data.city;

            var containers = element.find('[chart-block]');
            _.each(containers, function (c) {
              var container = $(c);

              var containerUnique = container.find('[chart-type="unique"]').html('');
              var containerGroups = container.find('[chart-type="groups"]').html('');

              var seasonName = container.attr('chart-block');

              var state = {
                grouped: false,//seasonName === 'spring' || seasonName === 'fall',
                ordered: false//seasonName === 'summer' || seasonName === 'fall'
              };

              var data = _.find(scope.data, {name: seasonName});
              // bricks
              var options = {};
              options.layout = {
                sections: {
                  horizontal: 7,
                  vertical: 2
                }
              };
              options.data = options.data || {};
              if (!state.grouped) {
                options.layout = {
                  sections: {
                    horizontal: 1,
                    vertical: 1
                  }
                };
              }
              options.data.isOrdered = state.ordered;

              var dataUnique = data.unique;
              if (!state.ordered) {
                // randomize additionally
                dataUnique = _.sortBy(_.map(dataUnique, function (d) {
                  d.__order = Math.random();
                  return d;
                }), '__order');
              }
              var groups = [{}];
              if (state.grouped) {
                groups = _colors;
              }

              var ch = new chartBricks({
                data: {
                  colors: dataUnique, groups: groups
                },
                container: containerUnique[0],
                options: options
              });

              var colors = _.map(data.groups,
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
              ch = new chartDotsHorizontal({
                data: colors,
                container: containerGroups[0],
                options: {}
              });

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
          templateUrl: 'app/directives/custom-infographics-directives/chart-colors-unique-with-groups-per-season.html'
        };

        return directive;

      }
    ]);
}());
