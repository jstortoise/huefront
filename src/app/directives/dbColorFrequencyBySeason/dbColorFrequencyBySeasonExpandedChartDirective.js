angular.module('app').directive('hueDbColorFrequencyBySeasonExpandedChart', function () {
  function link(scope, element, attrs) {
    //config
    var linesColor = '#BBB';
    var margin = 30;
    var marginTop = 10;
    var yLabelsWidth = 40;
    var xLabelsHeight = 60;
    var xLabelsSpacing = 10;
    var yAxisStep = 5;
    var barSpaceCoeff = 0.25;
    var fontY = {family: 'Open Sans', size: 14};
    var fontX = {family: 'Open Sans', size: 12};

    //variables
    var colorData = scope.data;
    var barCount = colorData.length;
    var maxValue = _.max(scope.data, function (item) {
      return item.percentage;
    }).percentage;
    var graphMaxValue = Math.ceil(maxValue / yAxisStep) * yAxisStep;
    var lineCount = graphMaxValue / yAxisStep;
    var draw = SVG(element[0]);
    var labelsGroup = draw.group();
    var barsGroup = draw.group();

    //create
    var linePercentage = graphMaxValue;
    for (var i = 0; i <= lineCount; i++) {
      labelsGroup.line(0, 0, 0, 0).stroke({width: 1, color: linesColor});
      labelsGroup.text(linePercentage + '%').fill(linesColor).font(fontY);
      linePercentage -= yAxisStep;
    }

    for (var i = 0; i < barCount; i++) {
      barsGroup.rect(0, 0).attr('fill', colorData[i].color.hex);
      labelsGroup.text(colorData[i].color.ncs).fill(linesColor).font(fontX);
    }

    var resizeChart = function () {
      var elementWidth = element.width();
      var elementHeight = element.height();
      var graphWidth = elementWidth - yLabelsWidth - margin - margin;
      var graphHeight = elementHeight - xLabelsHeight - marginTop;
      var labelsGroupChildren = labelsGroup.children();
      var barsGroupChildren = barsGroup.children();

      draw.size(elementWidth, elementHeight);
      barsGroup.x(yLabelsWidth + margin);

      //lines
      var linePos = marginTop + 1;
      var linePosStep = graphHeight / lineCount;
      var yLabelsXPos = yLabelsWidth / 2;

      for (var i = 0; i <= lineCount; i++) {
        var rpos = Math.round(linePos);
        labelsGroupChildren[i * 2].plot(yLabelsWidth, rpos, elementWidth, rpos);
        labelsGroupChildren[(i * 2) + 1].cx(yLabelsXPos).cy(rpos);
        linePos += linePosStep;
      }

      //bars
      var barWidth = graphWidth / (barCount + ((barCount - 1) * barSpaceCoeff));
      var barHeightCoeff = graphHeight / graphMaxValue;
      var spaceWidth = barWidth * barSpaceCoeff;
      var xLabelsYPos = elementHeight - (xLabelsHeight / 2) - xLabelsSpacing;
      var xLabelsYPosOdd = elementHeight - (xLabelsHeight / 2) + xLabelsSpacing;
      var xLabelsXPosOffset = yLabelsWidth + margin + Math.round(barWidth / 2) + 8;

      barWidth = Math.floor(barWidth);
      spaceWidth = Math.floor(spaceWidth);

      var barPos = 0;
      var barPosStep = barWidth + spaceWidth;
      var linesGroupIndexOffset = (lineCount * 2) + 2;
      for (var i = 0; i < barCount; i++) {
        var item = colorData[i];
        var barHeight = Math.round(barHeightCoeff * item.percentage);
        barsGroupChildren[i].size(barWidth, barHeight).x(barPos).y(marginTop + graphHeight - barHeight);
        if (i % 2)
          labelsGroupChildren[linesGroupIndexOffset + i].cx(barPos + xLabelsXPosOffset).cy(xLabelsYPosOdd);
        else
          labelsGroupChildren[linesGroupIndexOffset + i].cx(barPos + xLabelsXPosOffset).cy(xLabelsYPos);
        barPos += barPosStep;
      }
    };

    resizeChart();
    $(window).resize(_.debounce(resizeChart, 500));
  }

  return {
    restrict: 'A',
    link: link,
    scope: {
      data: '=hueDbColorFrequencyBySeasonExpandedChart'
    }
  };
});
