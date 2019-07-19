angular.module('app').directive('huePieChart', ['$timeout', '$location', function (timeout, location) {
  function link(scope, element, attrs) {
    var buildChart = function (data) { //array of { c: HEX color, p: percentage, t: title }
      $(element).empty();

      var config = scope.config;

      var donutWidth = scope.config.donutWidth ? scope.config.donutWidth : 20;
      var diameter = scope.config.diameter;
      var outerRadius = diameter / 2;
      var innerRadius = outerRadius - donutWidth;
      var animationDuration = 400;
      var animationStep = 1 / (animationDuration / 20);
      var defaultAngleMargin = 0.008;

      var draw = SVG(element[0]).size(diameter, diameter);
      var groupMain = draw.group();
      var groupExpanded = draw.group();
      var expandedColorPath = groupExpanded.path('');

      var getSectionPathData = function (angle1, angle2, angleMargin) {
        var sinStart = angleMargin ? Math.sin(angle1 + angleMargin) : Math.sin(angle1);
        var cosStart = angleMargin ? Math.cos(angle1 + angleMargin) : Math.cos(angle1);
        var sinEnd = angleMargin ? Math.sin(angle2 - angleMargin) : Math.sin(angle2);
        var cosEnd = angleMargin ? Math.cos(angle2 - angleMargin) : Math.cos(angle2);

        var xO1 = outerRadius + (sinStart * outerRadius); //outer
        var yO1 = outerRadius - (cosStart * outerRadius);
        var xO2 = outerRadius + (sinEnd * outerRadius);
        var yO2 = outerRadius - (cosEnd * outerRadius);

        var xI1 = outerRadius + (sinStart * innerRadius); //inner
        var yI1 = outerRadius - (cosStart * innerRadius);
        var xI2 = outerRadius + (sinEnd * innerRadius);
        var yI2 = outerRadius - (cosEnd * innerRadius);

        var big = (angle2 - angle1 > Math.PI) ? 1 : 0;

        return new SVG.PathArray([
          ['M', xO1, yO1],
          ['A', outerRadius, outerRadius, 0, big, 1, xO2, yO2],
          ['L', xI2, yI2],
          ['A', innerRadius, innerRadius, 0, big, 0, xI1, yI1],
          ['Z']
        ]).toString();
      };

      //Toggle color animation
      var expandedColor = null;
      var toggleExpandedColor = function (index, show, callback) {
        var eaProgress = show ? 0 : 1;
        var eaProgressLimit = show ? 1 : 0;
        var eaAngleStart = _.reduce(data.slice(0, index), function (memo, value) {
            return memo + value.p;
          }, 0) * Math.PI / 50;
        var eaAngleDelta = (100 - data[index].p) * Math.PI / 50;
        var eaStep = show ? animationStep : -animationStep;
        var eaSectionAngleWidth = data[index].p * Math.PI / 50 - 0.001;
        var eAnimation = function () {
          eaProgress += eaStep;

          if (eaProgress > 1)
            eaProgress = 1;
          else if (eaProgress < 0)
            eaProgress = 0;

          expandedColorPath.plot(getSectionPathData(eaAngleStart, eaAngleStart + (eaAngleDelta * eaProgress) + eaSectionAngleWidth));

          if (eaProgress == 0)
            groupExpanded.hide();

          if (eaProgress != eaProgressLimit)
            timeout(eAnimation, 20);
          else if (callback)
            callback();
        }

        expandedColorPath.attr('fill', data[index].c);
        if (show)
          groupExpanded.show();
        eAnimation();
      };

      //Initialization
      var clickColorHandler = function (event) {
        if (scope.colorClickHandler())
          scope.colorClickHandler()(groupMain.index(event.currentTarget.instance));
      };
      var clickExpandedColorHandler = function (event) {
        if (scope.collapseClickHandler())
          scope.collapseClickHandler()();
      };

      var attrNs = location.absUrl();
      var itemCount = data.length;
      for (var i = 0; i < itemCount; i++) {
        var p = groupMain.path('');
        p.attr('fill', data[i].c);
        p.click(clickColorHandler);
      }

      expandedColorPath.click(clickExpandedColorHandler);

      //Opening animation
      var easeOutFunction = BezierEasing.css['ease-out'];
      var animationProgress = 0;
      var processAnimation = function () {
        animationProgress += animationStep;
        if (animationProgress > 1)
          animationProgress = 1;

        var coeff = easeOutFunction(animationProgress) * 0.999; //multiply by 0.999 to prevent arcs from closing and disappearing
        var groupMainChildren = groupMain.children();
        var angleStart = 0;
        for (var i = 0; i < itemCount; i++) {
          var angleEnd = angleStart + (data[i].p * coeff * Math.PI / 50);
          groupMainChildren[i].plot(getSectionPathData(angleStart, angleEnd, defaultAngleMargin));
          angleStart = angleEnd;
        }

        if (animationProgress != 1)
          timeout(processAnimation, 20);
        else if (scope.animationCompleteHandler())
          scope.animationCompleteHandler()();
      };

      groupExpanded.hide();
      if (!element[0].isVisible()) //don't play animation on invisible charts
        animationProgress = 1;
      processAnimation();

      scope.$watch('selectedIndex', function (newValue, oldValue) {
        if (newValue != null) {
          if (oldValue == null)
            toggleExpandedColor(newValue, true, scope.animationCompleteHandler());
          else {
            toggleExpandedColor(oldValue, false, function () {
              toggleExpandedColor(newValue, true, scope.animationCompleteHandler());
            });
          }
        }
        else if (oldValue != null)
          toggleExpandedColor(oldValue, false, scope.animationCompleteHandler());
      });
    };

    scope.$watch('data', function (newValue, oldValue) {
      if (newValue && newValue.length > 0)
        buildChart(newValue);
    });
  }

  return {
    restrict: 'A',
    link: link,
    scope: {
      config: '=huePieChart',
      data: '=',
      selectedIndex: '=',
      colorClickHandler: '&onColorClick',
      collapseClickHandler: '&onCollapseClick',
      animationCompleteHandler: '&onAnimationComplete'
    }
  };
}]);
