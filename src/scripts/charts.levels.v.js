function chartLevelsVertical(settings) {

    var self = this;

    chartBase(self);

    initialize();

    self.name = 'levels-v';

    self.settings = settings;
    var _opts = self.mergeDefaults(settings.options);
    self.container = settings.container;

    self.data = settings.data;

    function initialize() {
        self.getDefaults = function() {
            var d = {
                layout: {},
                bars: {
                    width: 80,
                    bar: {
                        colorUpper: '#eee',
                        colorLower: '#888'
//                        heightDefault: 100
                    },
                    title: {
                        height: 40
                    },
                    legend: {
                        height: 50 
                    },
                    margin: {
                        top: 0,
                        left: 9,
                        right: 9,
                        bottom: 5
                    }
                }
            };

            d.layout.padding = {
                left: 10,
                right: 10,
                top: 20,
                bottom: 0
            }

            d.bars.maxValue = 100;
            d.bars.maxValueRangeMultiplier = 1.05;

            return d;
        }
    }

    function prepareContainer() {
        self.initializeLayout(_opts);

        self._gr = self._layout.append('g');

        self._c = self._layout.append('g');//.attr('transform', 'translate(' + _opts.axis.y.text.width + ', ' + 0 + ')');
        self._x = self._layout.append('g');

//        self._f = self._layout.append('g');

        self.xScale = d3.scale.ordinal()
            .domain(d3.range(0, self.data.length * 1))
            .rangeBands([0, self.w]);
//            .rangeBands([0, !_opts.isVertical ? self.w - _opts.axis.y.text.width : self.h - _opts.axis.x.text.height]);

        var d = [];
        _.each(self.data, function (el) {
            self.isArray(el.value) ? d.push.apply(d, el.value) : d.push(el.value);
        });
        self.maxValue = d3.max(d);
        if (_opts.bars.maxValue && _opts.bars.maxValue > self.maxValue) {
            self.maxValue = _opts.bars.maxValue;
        }

        var yMax = self.maxValue || .001;
        yMax *= _opts.bars.maxValueRangeMultiplier;
        self.maxRangeValue = yMax;
        self.yScale = d3.scale.linear()
            .domain([0, yMax])
            .range([0, self.h - _opts.bars.title.height - _opts.bars.legend.height]);
    }

    function bindData() {

        var stuff = self._c.selectAll('g').data(self.data)
            .enter().append('g')
            .each(function(d, i) {

                var g = d3.select(this)
                    .attr('data-eltype', 'bars');

                var h = self.yScale(d.value);

                var dx = self.w / self.data.length;

                var item = g.append('g')
                    .attr('transform', String.format('translate({0}, {1})', i * dx, _opts.bars.margin.top));
//                            .attr('y', 0)
//                            .attr('width', dx)// self.w - (_opts.axis.x.wholeLength ? 0 : _opts.axis.y.text.width))
//                            .attr('transform', String.format('translate({0}, {1})', (!_opts.axis.x.wholeLength ? _opts.axis.y.text.width : 0)
//                                , self.h - _opts.axis.x.text.height))
//                            .attr('height', self.h - _opts.axis.x.height)
//                            .style({ fill: '#e9e9e9' });


                var barHeight = _opts.bars.bar.height ||
                    (self.h - _opts.bars.title.height - _opts.bars.legend.height);
                barHeight -= _opts.bars.margin.top + _opts.bars.margin.bottom;

                // legend (titles within grey boxes) title
                var legend = item.append('g')
                    .attr('class', 'chart-titles')
                    .attr('transform', self.formatTranslate(0, barHeight
                    + _opts.bars.title.height
                    + _opts.bars.margin.top + _opts.bars.margin.bottom));

                var legendGroup = legend.append('g')
                    .attr({
                        'transform': self.formatTranslate(dx / 2, _opts.bars.legend.height / 2)
                    });

                self.appendTextMultiline(legendGroup, d.title, {separator: '-'});



                // dots values
                var brickDy = barHeight / 20;

                var bricksContainer = item.append('g')
                    .attr('class', 'bricks-container')
                    .attr('transform', self.formatTranslate(_opts.bars.margin.left, self.h - _opts.bars.legend.height
                        - _opts.bars.margin.bottom - barHeight));

                var bricksParts = 10;
                for (var j = 0; j < bricksParts; j++) {
                    var brick = bricksContainer.append('rect')
                        .attr({
                            width: _opts.bars.width - _opts.bars.margin.left - _opts.bars.margin.right,
                            height: brickDy,
                            transform: self.formatTranslate(0, barHeight - brickDy * j * 2)
                        });
                    var value = d.value,
                        interpolatedValue = (d.value / self.maxValue) * 100,
                        animatedValue;
                    var color;
                    var opacity = 0;
                    if (interpolatedValue > (j + 1) * 10) {
                        color = _opts.bars.bar.colorLower;
                        animatedValue = 'lower';
                    } else if (interpolatedValue > j * 10 || value === self.maxValue) {
                        color = d.color;
                        animatedValue = interpolatedValue;
                        opacity = 1;
                        brick.attr({
                            transform: self.formatTranslate(0, barHeight - brickDy * 0 * 2)
                        });
                    } else {
                        color = _opts.bars.bar.colorUpper;
                        animatedValue = 'upper';
                    }
                    brick.style('fill', color);
                    if (self.isWhite(color)) {
                        brick.style('stroke', '#ccc');
                    }
                    brick.attr('data-value', animatedValue);
                    brick.style('opacity', opacity);
                }

                // value
                var valueContainer = item.append('g')
                    .attr('transform', self.formatTranslate(0,
                        self.h - _opts.bars.legend.height - barHeight
                        - _opts.bars.margin.top
                        - _opts.bars.margin.bottom
                        - _opts.bars.title.height));

                var valueContainerIn = valueContainer.append('g')
                    .attr('class', 'value-core')
                    .attr('transform', self.formatTranslate(dx / 2, 10))
                    .style('opacity', 0);

                valueContainerIn.append('text')
                    .text(d.valueTitle)
                    .attr('class', 'value-title')
                    .attr('transform', self.formatTranslate(0, 0))
                    .attr({
                        'text-anchor': 'middle',
                        'alignment-baseline': 'middle'
                    });

                valueContainerIn.append('text')
                    .text(d.valueTitle2)
                    .attr('class', 'value-title2')
                    .attr('transform', self.formatTranslate(0, 25))
                    .attr({
                        'text-anchor': 'middle',
                        'alignment-baseline': 'middle'
                    });
        });
    }

    function animateChanges(callback) {
        
        var barsDelay = 25;
        var barRowsDelay = 8;
        var barDuration = 800;
        var barRowsPostAppearanceDuration = 2000;

        var barHeight = _opts.bars.bar.height ||
            (self.h - _opts.bars.title.height - _opts.bars.legend.height);
        barHeight -= _opts.bars.margin.top + _opts.bars.margin.bottom;

        var brickDy = barHeight / 20;

        self._c.selectAll('g[data-eltype="bars"]').data(self.data);
        d3.selectAll(self._c[0][0].childNodes)//.filter('.f-bar-value')
            .each(function (d, i0) {
                if (!d) {
                    return;
                }
                var g0 = d3.select(this);
                var data = d.value;

                var bricks = g0.selectAll('.bricks-container rect');
                _.each(bricks[0], function(ln, i) {
                    var g = d3.select(ln);

                    var val = g.attr('data-value');

                    g.transition()
                        .remove();
                    var trans = g.transition()
                        .ease('exp-out');


//                    var dD = barDuration / 10;
/*
                    var easeOutExpo = function (t) {
                        return -Math.pow(2, -10 * t / barDuration) + 1;
//                        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
                    };
*/
                    var easeOutExpoReverse = function (v) {

                        var lg = Math.log(-v + 1) / Math.log(2);


                        return  (lg + 10) * barDuration;
                    };
//                    console.log(i, easeOutExpo(dD * i));
//                    console.log(i, easeOutExpoReverse(i / 10) / 10);


                    if (val === 'upper') {
                        trans
                            .duration(barRowsPostAppearanceDuration)
                            .delay(i * barRowsDelay + i0 * barsDelay + barDuration * .9)
                            .style('opacity', 1);
                    } else if (val === 'lower') {
                        var di = i + 3;
                        if (di >= 10) {
                            di = 9.5;
                        }
                        var functionDelay = barDuration - easeOutExpoReverse((di) / 10) / 10;
                        trans
                            .duration(barDuration / 10)
                            .delay(functionDelay + i0 * barsDelay)
                            .style('opacity', 1);
                    } else {
                        var valueInt = parseInt(val);
                        var h = Math.round(valueInt / 10 - .5) - (valueInt % 10 === 0 ? 1 : 0);
                        trans
                            .duration(barDuration)
                            .delay(i * barRowsDelay + i0 * barsDelay)
                            .attr({
                            transform: self.formatTranslate(0, barHeight - brickDy * h * 2)
                        });
                    }
                });

                var valueCore = g0.selectAll('.value-core');
                var dx = d3.transform(valueCore.attr('transform')).translate[0];
                valueCore.transition()
                    .remove();
                valueCore.transition()
                    .ease('cubic-out')
                    .duration(barDuration * 1.2)
                    .delay(i0 * barsDelay)
                    .attr('transform', self.formatTranslate(dx, 0))
                    .style('opacity', 1);
            });
    }

    prepareContainer();
    bindData();
    animateChanges();
}