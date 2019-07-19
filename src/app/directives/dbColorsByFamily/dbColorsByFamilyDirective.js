angular.module('app').directive('hueDbColorsByFamily', function ($timeout) {
  function link(scope, element, attrs) {
    var chartYOffset = 30;
    var chartXOffset = 30;
    var chartYAxisStep = 5;
    var fontX = {family: 'Gotham Cond SSm A","Gotham Cond SSm B', size: 15, weight: 600};

    scope.colorBarItemHeight = '0%';
    scope.chartData = null;
    scope.chartMinValue = 0;
    scope.chartMaxValue = 10;
    scope.visibleColors = [];

    scope.showAllLines = function () {
      var count = scope.data.length;
      for (var i = 0; i < count; i++)
        scope.visibleColors[i] = true;
      drawChart();
    };

    scope.toggleLine = function (index) {
      scope.visibleColors[index] = scope.visibleColors[index] ? false : true;
      drawChart();
    };

    var draw = SVG($('.graph', element)[0]);
    var drawChart = function () {
      draw.clear();

      if (scope.chartData == null)
        return;

      var graphContainer = $('.graph', element);
      var width = graphContainer.width() - chartXOffset - chartXOffset;
      var height = graphContainer.height() - 6 - chartYOffset;
      var chartXMax = graphContainer.width() - chartXOffset;
      var chartYMax = graphContainer.height() - chartYOffset;

      var graphYearStart = new Date().getFullYear() - scope.yearRange;
      for (var i = 0; i <= scope.yearRange; i++) {
        var x = Math.round(width * (i / scope.yearRange) + chartXOffset);
        if (i % 2) {
          draw.line(x, 3, x, chartYMax + 10).stroke({width: 1, color: '#ccc'});
          draw.text((graphYearStart + i).toString()).fill('#000').font(fontX).cx(x).cy(chartYMax + 18);
        } else {
          draw.line(x, 3, x, chartYMax).stroke({width: 1, color: '#ccc'});
          draw.text((graphYearStart + i).toString()).fill('#000').font(fontX).cx(x).cy(chartYMax + 10);
        }
      }

      var itemCountRange = scope.chartMaxValue - scope.chartMinValue;
      for (var i = 0; i <= itemCountRange; i += chartYAxisStep) {
        var y = Math.round(height * (i / itemCountRange) + 3);
        draw.line(chartXOffset, y, chartXMax, y).stroke({width: 1, color: '#ccc'});

        if (i == 0)
          draw.text((scope.chartMaxValue - i).toString()).fill('#000').font(fontX).cx(chartXOffset - 15).cy(y + 5);
        else if (i == itemCountRange)
          draw.text((scope.chartMaxValue - i).toString()).fill('#000').font(fontX).cx(chartXOffset - 15).cy(y - 5);
        else
          draw.text((scope.chartMaxValue - i).toString()).fill('#000').font(fontX).cx(chartXOffset - 15).cy(y);
      }

      _.each(scope.chartData, function (line, index) {
        if (!scope.visibleColors[index])
          return;

        var x = line.x;
        var y = line.y;
        var count = x.length;
        var items = [];

        for (var i = 0; i < count; i++)
          items.push([Math.round(width * x[i] + chartXOffset), Math.round(height * y[i] + 3)]);

        draw.polyline(items).fill('none').stroke({color: line.color, width: 2});
      });
    };

    var parseData = function (data) {
      var minItemsCount = null;
      var maxItemsCount = 0;
      _.each(data, function (line) {
        var items = line.items;
        var ic = items.length;
        for (var i = 0; i < ic; i++) {
          if (minItemsCount == null || minItemsCount > items[i][1])
            minItemsCount = items[i][1];
          if (maxItemsCount < items[i][1])
            maxItemsCount = items[i][1];
        }
      });
      chartYAxisStep = ((maxItemsCount - minItemsCount) + 1) <= 5 ? 1 : Math.round(((maxItemsCount - minItemsCount) + 1) / 5);

      minItemsCount = Math.floor(minItemsCount / chartYAxisStep) * chartYAxisStep;
      maxItemsCount = Math.ceil(maxItemsCount / chartYAxisStep) * chartYAxisStep;
      scope.chartMinValue = minItemsCount;
      scope.chartMaxValue = maxItemsCount;

      var currentDate = new Date();
      var graphXStart = currentDate.getFullYear() - scope.yearRange;
      var graphXEnd = currentDate.getFullYear();
      var graphXLength = scope.yearRange;
      var graphYLength = maxItemsCount - minItemsCount;

      scope.chartData = _.map(data, function (line) {
        var items = line.items;
        var result = {color: line.color.color.hex, title: line.color.title, x: [], y: []};
        var x = result.x;
        var y = result.y;
        var count = items.length;

        if (!_.some(items, function (i) {
            return i[0] == graphXStart;
          }) && _.some(items, function (i) {
            return i[0] > graphXStart;
          })) { // if there is no zero point and there are visible points
          var itemsBeforeXMin = _.filter(items, function (i) {
            return i[0] < graphXStart;
          });
          if (itemsBeforeXMin.length && _.some(items, function (i) {
              return i[0] > graphXStart;
            })) { // find Y at zero point
            var p1 = _.max(itemsBeforeXMin, function (i) {
              return i[0];
            }); // find closest points to zero X
            var p2 = _.find(items, function (i) {
              return i[0] > graphXStart;
            });
            var slope = (p2[1] - p1[1]) / (p2[0] - p1[0]);
            var b = -(slope * p1[0] - p1[1]);

            x.push(0);
            y.push(1 - (((slope * graphXStart + b) - minItemsCount) / graphYLength));
          }
        }

        for (var i = 0; i < count; i++) {
          var year = items[i][0];
          if (year < graphXStart || year > graphXEnd)
            continue;
          x.push((year - graphXStart) / graphXLength);
          y.push(1 - ((items[i][1] - minItemsCount) / graphYLength));
        }

        return result;
      });

      scope.colorBarItemHeight = (100 / data.length) + '%';
      drawChart();
    };

    scope.$watch('data', function (newValue, oldValue) {
      if (newValue && newValue.length) {
        scope.visibleColors = [];

        var count = newValue.length;
        if (scope.defaultColorId != null && scope.defaultColorId != undefined) {
          var id = _.isNumber(scope.defaultColorId) ? scope.defaultColorId : parseInt(scope.defaultColorId);
          for (var i = 0; i < count; i++)
            scope.visibleColors[i] = newValue[i].color.id === id;
        }
        else
          for (var i = 0; i < count; i++)
            scope.visibleColors[i] = true;

        $timeout(function () {
          parseData(newValue);
        }, 300);
      }
    });

    scope.$watch('yearRange', function (newValue, oldValue) {
      if (scope.data && scope.data.length)
        $timeout(function () {
          parseData(scope.data);
        }, 0);
    });

    var windowResizeHandler = _.debounce(drawChart, 200);
    scope.$on('$destroy', function () {
      $(window).off('resize', windowResizeHandler);
    });
    $(window).resize(windowResizeHandler);
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbColorsByFamily/dbColorsByFamilyView.html',
    link: link,
    scope: {
      data: '=',
      yearRange: '=',
      defaultColorId: '='
    }
  };
});
