angular.module('app').directive('hueDbCopyrightsOverTime', function ($interval) {
  function link(scope, element, attrs) {
    var chartYOffset = 30;
    var chartXOffset = 15;
    var chartYAxisStep = 5;
    var fontX = {family: 'Gotham Cond SSm A","Gotham Cond SSm B', size: 15, weight: 600};

    scope.colorBarItemHeight = '0%';
    scope.chartData = null;
    scope.chartMinValue = 0;
    scope.chartMaxValue = 10;

    var draw = SVG(angular.element('.graph', element)[0]);
    var drawChart = function () {
      draw.clear();

      if (scope.chartData == null) {
        return;
      }
      var graphContainer = angular.element('.graph', element);
      var width = graphContainer.width() - chartXOffset - chartXOffset;
      var height = graphContainer.height() - 6 - chartYOffset;
      var chartXMax = graphContainer.width() - chartXOffset;
      var chartYMax = graphContainer.height() - chartYOffset;

      draw.line(chartXOffset, chartYMax, chartXMax, chartYMax).stroke({width: 1, color: '#ccc'});

      var yearStart = new Date().getFullYear() - scope.yearRange;
      for (var i = 0; i <= scope.yearRange; i++) {
        var x = Math.round(width * (i / scope.yearRange) + chartXOffset);
        if (i % 2) {
          draw.line(x, chartYMax, x, chartYMax + 14).stroke({width: 1, color: '#ccc'});
          draw.text((yearStart + i).toString()).fill('#000').font(fontX).cx(x).cy(chartYMax + 24);
        } else {
          draw.line(x, chartYMax, x, chartYMax + 4).stroke({width: 1, color: '#ccc'});
          draw.text((yearStart + i).toString()).fill('#000').font(fontX).cx(x).cy(chartYMax + 12);
        }
      }

      _.each(scope.chartData, function (line, index) {
        var x = line.x;
        var y = line.y;
        var count = x.length;
        var items = [];

        for (var i = 0; i < count; i++) {
          items.push([Math.round(width * x[i] + chartXOffset), Math.round(height * y[i] + 3)]);
        }
        draw.polyline(items).fill('none').stroke({color: line.color, width: 2});
      });
    };

    var parseData = function (data) {
      var minItemsCount = null;
      var maxItemsCount = 0;
      var count = data.length;

      for (var i = 0; i < count; i++) {
        if (minItemsCount == null || minItemsCount > data[i].us_copyrights || minItemsCount > data[i].int_copyrights) {
          minItemsCount = data[i].us_copyrights > data[i].int_copyrights ? data[i].int_copyrights : data[i].us_copyrights;
        }
        if (maxItemsCount < data[i].us_copyrights || maxItemsCount < data[i].int_copyrights) {
          maxItemsCount = data[i].us_copyrights < data[i].int_copyrights ? data[i].int_copyrights : data[i].us_copyrights;
        }
      }

      minItemsCount = Math.floor(minItemsCount / chartYAxisStep) * chartYAxisStep;
      maxItemsCount = Math.ceil(maxItemsCount / chartYAxisStep) * chartYAxisStep;

      var graphYLength = maxItemsCount - minItemsCount;
      var yearStart = new Date().getFullYear() - scope.yearRange;

      scope.chartData = [{color: '#F00', x: [], y: []}, {color: '#000', x: [], y: []}]; //USA, INT

      var i = 0;
      while (data[i] && data[i].year >= yearStart) {
        var x = (data[i].year - yearStart) / scope.yearRange;
        scope.chartData[0].x.push(x);
        scope.chartData[0].y.push(1 - ((data[i].us_copyrights - minItemsCount) / graphYLength));

        scope.chartData[1].x.push(x);
        scope.chartData[1].y.push(1 - ((data[i].int_copyrights - minItemsCount) / graphYLength));
        i++;
      }

      drawChart();
    };

    scope.$watch('data', function (newValue, oldValue) {
      if (newValue && newValue.length) {
        parseData(newValue);
      }
    });

    scope.$watch('yearRange', function (newValue, oldValue) {
      if (scope.data && scope.data.length) {
        parseData(scope.data);
      }
    });

    var container = element.find('.db-copyrights-over-time');
    var containerWidth = container.width();
    var updateInterval = $interval(function () {
      if (container.width() != containerWidth) {
        if (scope.data && scope.data.length) {
          parseData(scope.data);
        }
        containerWidth = container.width();
      }
    }, 250);

    scope.$on('$destroy', function () {
      if (updateInterval) {
        $interval.cancel(updateInterval);
      }
    });
  }

  return {
    restrict: 'E',
    template: '<div class="db-copyrights-over-time"><div class="graph-legend"><div class="legend-item">USA<div class="color-box item-usa"></div></div><div class="legend-item">Int<div class="color-box item-int"></div></div></div><div class="graph"></div></div>',
    link: link,
    scope: {
      data: '=',
      yearRange: '='
    }
  };
});
