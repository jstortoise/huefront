angular.module('app').directive('hueDbTopProductsCopyrightsView', function ($timeout) {
  function link(scope, element, attrs) {
    scope.tooltipsterConfig = {
      animation: 'fade',
      theme: 'tooltipster-default',
      trigger: 'hover',
      position: 'top'
    };

    scope.percentageData = null;
    scope.axisData = null;
    scope.colorUsa = null;
    scope.colorInt = null;

    var lightenDarkenColor = function (col, amt) {
      var usePound = false;

      if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
      }

      var num = parseInt(col, 16);

      var r = (num >> 16) + amt;

      if (r > 255) r = 255;
      else if (r < 0) r = 0;

      var b = ((num >> 8) & 0x00FF) + amt;

      if (b > 255) b = 255;
      else if (b < 0) b = 0;

      var g = (num & 0x0000FF) + amt;

      if (g > 255) g = 255;
      else if (g < 0) g = 0;

      return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    };

    var setColors = function (color) {

    };

    var parseData = function (data) {
      var max = data.length === 0 ? 0 : _.max(_.map(data, function (item) {
        return _.max([item.total_copyrights, item.us_copyrights, item.int_copyrights]);
      }));
      max = Math.round(max * 1.05 / 10) * 10 || 1;

      scope.axisData = _.map(_.range(5), function (n) {
        n++;
        return max > 10 ? Math.round(max / 6 * n) : (Math.round(max / 6 * n * 10) / 10);
      });

      scope.percentageData = _.map(data, function (item) {
        return {total: '0%', us: '0%', int: '0%'};
      });

      $timeout(function () {
        scope.percentageData = _.map(scope.data, function (item) {
          return {
            total: (item.total_copyrights / max * 100) + '%',
            us: (item.us_copyrights / max * 100) + '%',
            int: (item.int_copyrights / max * 100) + '%'
          };
        });
      }, 10);
    }

    scope.$watch('data', function (newValue, oldValue) {
      if (newValue) {
        parseData(newValue);
      }
    });

    scope.$watch('chartColor', function (newValue, oldValue) {
      if (newValue) {
        scope.colorUsa = newValue;
        scope.colorInt = lightenDarkenColor(newValue, 128);
      }
    });
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbTopProductsCopyrights/dbTopProductsCopyrightsView.html',
    link: link,
    scope: {
      data: '=',
      chartColor: '='
    }
  };
});
