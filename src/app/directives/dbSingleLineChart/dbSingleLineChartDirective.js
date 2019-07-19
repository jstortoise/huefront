angular.module('app').directive('hueDbSingleLineChart', function ($timeout, $interval) {
  function link(scope, element, attrs) {
    var defaultLineColor = '#96FF0D';
    var chartOffsetTop = 10;
    var chartOffsetBottom = 40;
    var chartOffsetLeft = 50;
    var chartOffsetRight = 20;
    var chartYAxisStep = 1;
    var fontX = {family: 'Gotham Cond SSm A","Gotham Cond SSm B', size: 15, weight: 600};
    var fontY = {family: 'Open Sans', size: 14};
    var tooltipsterConfig = {
      animation: 'fade',
      theme: 'tooltipster-default',
      trigger: 'hover',
      position: 'top',
      offsetX: 6
    };

    scope.chartData = null;
    scope.chartMinValue = 0;
    scope.chartMaxValue = 10;

    var draw = SVG(angular.element('.graph', element)[0]);
    var drawChart = function () {
      draw.clear();

      if (scope.chartData == null) {
        return;
      }

      var lineColor = scope.lineColor ? scope.lineColor : defaultLineColor;
      var graphContainer = angular.element('.graph', element);
      var width = graphContainer.width() - chartOffsetLeft - chartOffsetRight;
      var height = graphContainer.height() - chartOffsetTop - chartOffsetBottom;
      var chartXMax = graphContainer.width() - chartOffsetRight;
      var chartYMax = graphContainer.height() - chartOffsetBottom;

      var itemCountRange = scope.chartMaxValue - scope.chartMinValue;
      for (var i = 0; i <= itemCountRange; i += chartYAxisStep) {
        var y = chartOffsetTop + Math.round(height * (i / itemCountRange));
        draw.line(chartOffsetLeft, y, chartXMax, y).stroke({width: 1, color: '#ccc'});

        var label = draw.text((scope.chartMaxValue - i).toString()).fill('#ccc').font(fontY).cy(y);
        label.x(chartOffsetLeft - label.bbox().width - 12);
      }

      var cdx = scope.chartData.x;
      var cdy = scope.chartData.y;
      var cdt = scope.chartData.titles;
      var cdv = scope.chartData.values;
      var count = cdx.length;
      var items = [];

      var pl = draw.polyline([]).fill('none').stroke({color: lineColor, width: 4});

      for (var i = 0; i < count; i++) {
        var x = Math.round(width * cdx[i] + chartOffsetLeft);
        var y = chartOffsetTop + Math.round(height * cdy[i]);

        var circle = draw.circle(12).fill('#FFF').stroke({
          color: lineColor,
          width: 4
        }).cx(x).cy(y).attr('title', cdv[i].toString());
        draw.text(cdt[i]).fill('#000').font(fontX).cx(x).cy(chartYMax + (i % 2 ? 32 : 16));
        items.push([x, y]);

        angular.element(circle.node).tooltipster(tooltipsterConfig);
      }

      pl.plot(items);
    };

    var parseData = function (data) {
      var count = data.length;
      var minItemsCount = null;
      var maxItemsCount = 0;

      for (var i = 0; i < count; i++) {
        if (minItemsCount == null || minItemsCount > data[i][1]) {
          minItemsCount = data[i][1];
        }
        if (maxItemsCount < data[i][1]) {
          maxItemsCount = data[i][1];
        }
      }

      chartYAxisStep = (maxItemsCount - minItemsCount + 1) <= 5 ? 1 : Math.round((maxItemsCount - minItemsCount + 1) / 5);

      maxItemsCount = minItemsCount + (Math.ceil((maxItemsCount - minItemsCount + 1) / chartYAxisStep) * chartYAxisStep);
      scope.chartMinValue = minItemsCount;
      scope.chartMaxValue = maxItemsCount;

      var xCoeff = count > 1 ? (1 / (count - 1)) : 0;
      var graphYLength = maxItemsCount - minItemsCount;
      var result = {titles: [], values: [], x: [], y: []};

      for (var i = 0; i < count; i++) {
        result.x.push(i * xCoeff);
        result.y.push(1 - ((data[i][1] - minItemsCount) / graphYLength));
        result.titles.push(data[i][0]);
        result.values.push(data[i][1]);
      }

      scope.chartData = result;

      drawChart();
      $timeout(drawChart, 500);
    };

    scope.$watch('data', function (newValue, oldValue) {
      if (newValue && newValue.length) {
        parseData(newValue.slice(0, 10));
      }
    });

    var container = element.find('.db-single-line-chart');
    var containerWidth = container.width();
    var updateInterval = $interval(function () {
      if (container.width() != containerWidth) {
        if (scope.data && scope.data.length) {
          parseData(scope.data.slice(0, 10));
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
    template: '<div class="db-single-line-chart"><div class="graph"></div></div>',
    link: link,
    scope: {
      data: '=',
      lineColor: '='
    }
  };
});
