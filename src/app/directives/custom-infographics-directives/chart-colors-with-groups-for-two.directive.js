(function () {
  'use strict';

  angular.module('app').directive('hueChartColorsWithGroupsForTwo',
    [
      'common', 'config', 'chartsHelper', 'colorSortService',
      function (common, config, chartsHelper, colorSortService) {

        function link(scope, element, attributes) {

//                scope.value = '';
          scope.$watch('data', bindData);

//                bindData();

          function bindData() {

            if (!scope.data) {
              return;
            }

            if (scope.data[2]) {
              scope.data[2].data = colorSortService(scope.data[2].data, 25);
              scope.data[3].data = colorSortService(scope.data[3].data, 25);
              scope.palettes1 = _.chunk(scope.data[2].data, 5);
              scope.palettes2 = _.chunk(scope.data[3].data, 5);
            }
            var containers = element.find('[chart-block]');

            _.each(containers, function (c, i) {
              var container = $(c);

              var containerBagel = container.find('[chart-type="bagel"]').html('');
              var containerGroups = container.find('[chart-type="groups"]').html('');

              var title = scope.data[i].title;
              container.find('h3').text(title);

              var data = scope.data[i].data;
              if (data) {

                var options = {
                  bars: {
                    radius: 85,
                    radiusOuter: 1,
                    radiusInner: 62,
                    legend: {},
                    separator: {radius: 6}
                  }
                };

                if (i === 1) {
                  options.bars = {
                    radius: 85,
                    radiusOuter: 1,
                    radiusInner: 62,
                    legend: {
                      position: 'left'
                    },
                    separator: {radius: 6}
                  };
                }

                var colors = _.map(data.colors,
                  function (d) {
                    return {
                      value: d.percentage,
                      valueTitle: Math.round(d.percentage) + '%',
                      value2: Math.round(d.percentage * 100),
                      valueTitle2: Math.round(d.percentage * 100),
                      title: d.title,
                      color: d.color
                    }
                  });

                if (containerBagel[0]) {
                  var ch = new chartBoxBagel({
                    data: colors,
                    container: containerBagel[0],
                    options: options
                  });

                }
                // groups
                if (scope.mode && scope.mode.extraView) {
                  var rowsAmount = 5, columnsAmount = 5;
                  var allColors = [];
                  _.each(data.groups, function (gr) {
                    _.each(gr.colors, function (c) {
                      allColors.push({color: c.color});
                    });
                  });

                  var rows = scope['rows' + (i + 1)] = [];
                  scope['year' + (i + 1)] = title;
                  for (var ii = 0; ii < rowsAmount; ii++) {
                    var row = {colors: []};
                    rows.push(row);
                    for (var j = 0; j < columnsAmount; j++) {
                      var column = {};
                      row.colors.push(column);

                      var color = allColors[ii * columnsAmount + j];
                      if (!color) {
                        column.isEmpty = true;
                      } else {
                        column.color = color.color;
                      }
                    }
                  }
                }

                // generic groups
                var groups = _.map(data.groups,
                  function (d) {
                    var value = Math.round(d.percentage * 100);
                    return {
                      value: d.value,
                      valueTitle: Math.round(value) + '%',
                      value2: d.value,
                      valueTitle2: Math.round(d.percentage * 100),
                      title: d.title,
                      color: d.color
                    }
                  });

                options = {
                  layout: {
                    bars: {
                      bar: {
                        height: 130,
                        width: 25,
                        margin: {
                          left: 6,
                          right: 6
                        },
                        background: '#e3e3e3'
                      },
                      separator: {
                        height: 24,
                        radius: 6
                      },
                      value: {
                        height: 22
                      },
                      value2: {
                        height: 22
                      }
                    },
                    padding: {
                      left: 10,
                      right: 10,
                      top: 0,
                      bottom: 10
                    }
                  }
                }
                ch = new chartBoxLinearVertical({
                  data: groups,
                  container: containerGroups[0],
                  options: options
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
            data: '=',
            mode: '='
          },
          templateUrl: 'app/directives/custom-infographics-directives/chart-colors-with-groups-for-two.html'
        };

        return directive;

      }
    ]);
}());
