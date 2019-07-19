angular.module('app').directive('hueTopIndustriesChart', ['$timeout', '$location', function (timeout, location) {
	function link(scope, element, attrs) {
		var config = scope.config;

		var donutWidth = scope.config.donutWidth ? scope.config.donutWidth : 20;
		var diameter = scope.config.diameter;
		var outerRadius = diameter / 2;
		var innerSectionRadius = outerRadius - donutWidth;
		var innerStrokeRadius = outerRadius - 2;
		var animationDuration = 400;
		var animationStep = 1 / (animationDuration / 20);
		var strokePercentage = 100 - scope.percentage;

		var draw = SVG(element[0]).size(diameter, diameter);
		var group = draw.group();

		var getSectionPathData = function (angle1, angle2, innerRadius) {
			var sinStart = Math.sin(angle1);
			var cosStart = Math.cos(angle1);
			var sinEnd = Math.sin(angle2);
			var cosEnd = Math.cos(angle2);

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


		//Initialization
		group.path('').attr('fill', scope.color); //section
		group.path('').attr('fill', scope.color); //stroke

		//Opening animation
		var easeOutFunction = BezierEasing.css['ease-out'];
		var animationProgress = 0;
		var groupChildren = group.children();
		var processAnimation = function () {
			animationProgress += animationStep;
			if (animationProgress > 1)
				animationProgress = 1;

			var coeff = easeOutFunction(animationProgress) * 0.999; //multiply by 0.999 to prevent arcs from closing and disappearing

			var angleStart = 0;
			var angleEnd = angleStart + (scope.percentage * coeff * Math.PI / 50);
			groupChildren[0].plot(getSectionPathData(angleStart, angleEnd, innerSectionRadius));

			angleStart = angleEnd;
			angleEnd = angleStart + (strokePercentage * coeff * Math.PI / 50);
			groupChildren[1].plot(getSectionPathData(angleStart, angleEnd, innerStrokeRadius));

			if (animationProgress != 1)
				timeout(processAnimation, 20);
		};

		processAnimation();

		scope.$watch('color', function (newValue, oldValue) {
			if (newValue) {
				group.first().attr('fill', newValue); //section
				group.last().attr('fill', newValue); //stroke
			}
		});
	}

	return {
		restrict: 'A',
		link: link,
		scope: {
			config: '=hueTopIndustriesChart',
			percentage: '=',
			color: '='
		}
	};
}]);