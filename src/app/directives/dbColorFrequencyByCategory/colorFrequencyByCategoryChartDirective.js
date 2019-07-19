angular.module('app').directive('hueColorFrequencyByCategoryChart', ['$timeout', '$location', function (timeout, location) {
  function link(scope, element, attrs) {
    var config = scope.config;

    var donutWidth = scope.config.donutWidth ? scope.config.donutWidth : 20;
    var strokeWidth = scope.config.strokeWidth ? scope.config.strokeWidth : 2;
    var diameter = scope.config.diameter;

    var outerStrokeRadius = diameter / 2;
    var innerStrokeRadius = outerStrokeRadius - strokeWidth;
    var innerSectionRadius = outerStrokeRadius - donutWidth;
    var animationDuration = 400;
    var animationStep = 1 / (animationDuration / 20);
    var strokePercentage = 100 - scope.percentage;

    var draw = SVG(element[0]).size(diameter, diameter);
    var donutGroup = draw.group();

    var getSectionPathData = function (angle1, angle2, xpos, ypos, outerRadius, innerRadius) {
      var sinStart = Math.sin(angle1);
      var cosStart = Math.cos(angle1);
      var sinEnd = Math.sin(angle2);
      var cosEnd = Math.cos(angle2);

      var xO1 = xpos + (sinStart * outerRadius); //outer
      var yO1 = ypos - (cosStart * outerRadius);
      var xO2 = xpos + (sinEnd * outerRadius);
      var yO2 = ypos - (cosEnd * outerRadius);

      var xI1 = xpos + (sinStart * innerRadius); //inner
      var yI1 = ypos - (cosStart * innerRadius);
      var xI2 = xpos + (sinEnd * innerRadius);
      var yI2 = ypos - (cosEnd * innerRadius);

      var big = (angle2 - angle1 > Math.PI) ? 1 : 0;

      return new SVG.PathArray([
        ['M', xO1, yO1],
        ['A', outerRadius, outerRadius, 0, big, 1, xO2, yO2],
        ['L', xI2, yI2],
        ['A', innerRadius, innerRadius, 0, big, 0, xI1, yI1],
        ['Z']
      ]).toString();
    };

    //Initialization
    donutGroup.path('').attr('fill', scope.color); //section
    donutGroup.path('').attr('fill', scope.strokeColor ? scope.strokeColor : scope.color); //stroke

    //Opening animation
    var easeOutFunction = BezierEasing.css['ease-out'];
    var animationProgress = 0;
    var donutChildren = donutGroup.children();
    var processAnimation = function () {
      animationProgress += animationStep;
      if (animationProgress > 1)
        animationProgress = 1;

      var coeff = easeOutFunction(animationProgress) * 0.999; //multiply by 0.999 to prevent arcs from closing and disappearing

      var angleStart = 0;
      var angleEnd = angleStart + (scope.percentage * coeff * Math.PI / 50);
      donutChildren[0].plot(getSectionPathData(angleStart, angleEnd, outerStrokeRadius, outerStrokeRadius, innerStrokeRadius, innerSectionRadius));

      //angleStart = angleEnd;
      angleEnd = angleStart + (coeff * Math.PI * 2);
      donutChildren[1].plot(getSectionPathData(angleStart, angleEnd, outerStrokeRadius, outerStrokeRadius, outerStrokeRadius, innerStrokeRadius));

      if (animationProgress != 1)
        timeout(processAnimation, 20);
    };

    processAnimation();
  }

  return {
    restrict: 'A',
    link: link,
    scope: {
      config: '=hueColorFrequencyByCategoryChart',
      percentage: '=',
      color: '=',
      strokeColor: '='
    }
  };
}]);
