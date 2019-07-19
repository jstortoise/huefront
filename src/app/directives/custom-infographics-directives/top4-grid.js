(function () {
  'use strict';
  angular.module('app')
    .directive('hueTop4Grid', ['common', 'config', 'chartsHelper', '$timeout',
      function (common, config, chartsHelper, $timeout) {
        function link(scope, element, attributes) {
          scope.$watch('data', bindData);
          scope.alphabet = [
            "a",
            "à",
            "b",
            "c",
            "d",
            "e",
            "é",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "ö",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9"
          ];

          function bindData() {
            if (!scope.data) {
              return;
            }

            scope.grouppedData = _.groupBy(scope.data, function (item) {
              return item.title && item.title.toLowerCase().substr(0, 1);
            });

            // var columnsCount = 3;
            // var rowsCount = 300;
            // var colorsCount = 4;
            //
            // var nTitle = '';
            //
            // var columns = [];
            // scope.columns = columns;
            //
            // for (var i = 0; i < columnsCount; i++) {
            //   var column = {rows: []};
            //   columns.push(column);
            //
            //   for (var j = 0; j < rowsCount; j++) {
            //     var dataIndex = i * rowsCount + j;
            //     var dataItem = scope.data.length <= dataIndex ? {data: []} : scope.data[dataIndex];
            //
            //     var row = {
            //       title: '',
            //       colors: []
            //     };
            //
            //     column.rows.push(row);
            //
            //     var firstLetter = dataItem.title.substr(0, 1);
            //     var isTitle = nTitle !== firstLetter;
            //     if (isTitle) {
            //       row.isTitle = true;
            //       row.title = firstLetter;
            //       nTitle = firstLetter;
            //       j += 2;
            //       row = {};
            //       column.rows.push(row);
            //     }
            //
            //     row.title = dataItem.title; // names[0][Math.round(Math.random() * names[0].length - .5)] + ' ' + names[1][Math.round(Math.random() * names[1].length - .5)];
            //     row.colors = dataItem.data;
            //   }
            // }
            //
            // $timeout(function () {
            //   _.each(element.find('[color]'), function (el, i) {
            //     $timeout(function () {
            //       $(el).toggleClass('show', true);
            //     }, 5 * i);
            //   });
            // });
          }
        }

        var directive = {
          link: link,
          restrict: 'E',
          replace: true,
          scope: {
            data: '='
          },
          templateUrl: 'app/directives/custom-infographics-directives/top4-grid.html'
        };

        return directive;
      }
    ]);
}());
