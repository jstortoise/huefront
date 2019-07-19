function chartGraphLinearHorizontal(settings) {

    var self = this;
    self.name = 'graph-linear-h';

    chartBase(self);
    initialize();

    self.settings = settings;
    self.container = settings.container;
    self.data = settings.data;

    var _opts = self.mergeDefaults(settings.options);
    var _charts = null;

    function initialize() {
        self.getDefaults = function () {
            var d = {
                meta: {},
                layout: {
                    bars: {
                        point: {
                            radius: 5.5
                        }
                    }
                },
                axis: {
                    y: {
                        width: 40,
                        sign: '#',
                        duplicateOnTheRight: true,
                        margin: 5
                    },
                    x: { height: 40 }
                },
                bars: {}
            };

            d.layout.padding = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }

            //            d.bars.maxValue = 100;
            //            d.bars.maxValueRangeMultiplier = 1.05;

            return d;
        }
    }

    function prepareContainer() {
        self.initializeLayout(_opts);

        self._gr = self._layout.insert('g', ':first-child');

        //        self.xScale = d3.scale.ordinal()
        //            .domain(d3.range(0, self.data.length))
        //            .rangeBands([0, _opts.layout.bars.bar.width]);

        var d = [];
        _.each(self.data.data.points, function (el) {
            d.push(el.value);
//            self.isArray(el.value) ? d.push.apply(d, el.value) : d.push(el.value);
        });
        self.maxValue = d3.max(d);
        if (_opts.bars.maxValue && _opts.bars.maxValue > self.maxValue) {
            self.maxValue = _opts.bars.maxValue;
        }
        var contentHeight = self.h - _opts.axis.x.height;
        var contentWidth = self.w - _opts.axis.y.width;

        var max = self.maxValue || .001;
        max *= (_opts.bars.maxValueRangeMultiplier || 1);
        self.maxRangeValue = max;
        self.yScale = d3.scale.linear()
            .domain([0, max])
            .range([0, contentHeight]);


    }

    function bindData() {

        var st = _opts.layout;
        var contentHeight = self.h - _opts.axis.x.height;
        var contentWidth = self.w
            - _opts.axis.y.width * (_opts.axis.y.duplicateOnTheRight ? 2 : 1);

        // axis
        self._gr.html('');

        var periods = self.data.periods;
        var dx = contentWidth / self.data.periods.length;
        var dy = contentHeight / (self.data.data.length + .5);
        for (var i = 0; i <= periods.length; i++) {
            self._gr.append('line')
                .attr('transform', self.formatTranslate(dx * i + _opts.axis.y.width, 0))
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', i === 0 || i === periods.length ? 0 : dy / 2)
                .attr('y2', contentHeight)
                .style({ stroke: '#ccc' });

            if (i < periods.length) {
                self._gr.append('text')
                    .attr('class', 'bar-title')
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .attr('transform', self.formatTranslate(i * dx + dx / 2 + _opts.axis.y.width, contentHeight + _opts.axis.x.height / 2))
                    .text(periods[i].title);
            }
        }

        for (var j = 0; j <= self.data.data.length; j++) {
            var data = self.data.data[j];

            self._gr.append('line')
                .attr('transform', self.formatTranslate(_opts.axis.y.width, dy * (j + .5)))
                .attr('x1', 0)
                .attr('x2', contentWidth)
                .attr('y1', 0)
                .attr('y2', 0)
                .style({ stroke: '#ccc', 'stroke-dasharray': j === self.data.data.length ? '' : '4,4' });

            if (j < self.data.data.length) {
                var yAxisMargin = _opts.axis.y.margin || 0;
                self._gr.append('text')
                    .attr('class', 'bar-title')
                    .attr('text-anchor', 'end')
                    .attr('dominant-baseline', 'central')
                    .attr('transform', self.formatTranslate(_opts.axis.y.width - yAxisMargin, dy * (j + .5)))
                    .text(data.title);

                if(_opts.axis.y.duplicateOnTheRight) {
                    self._gr.append('text')
                        .attr('class', 'bar-title')
                        .attr('text-anchor', 'start')
                        .attr('dominant-baseline', 'central')
                        .attr('transform', self.formatTranslate(_opts.axis.y.width + yAxisMargin
                            + contentWidth + yAxisMargin, dy * (j + .5)))
                        .text(data.title);

                }
            }
        }


        self._c.html('');
        var c = self._c.append('g')
            .attr('transform', self.formatTranslate(_opts.axis.y.width, dy * .5));

        var charts = c.selectAll('g').data(self.data.data)
            .enter().append('g')
            .each(function(d, i) {

                var data = d;

                var g0 = d3.select(this);
                g0.attr('data-eltype', 'bars')
                    /*.attr('transform', ))*/;


                var path = '';
                var prevPoint, currPoint;
                var bezierRadius = dx / 3;
                for (var k = 0; k < data.points.length; k++) {
                    var point = data.points[k];
                    if (k === 0) {
                        prevPoint = { x: 0, y: dy * point.value };
                        path = String.format('M{0},{1} ', prevPoint.x, prevPoint.y);
                    }

                    currPoint = { x: dx * (k + .5), y: dy * point.value };
                    path += String.format('C {0} {1}, {2} {3}, {4} {5} ',
                        prevPoint.x + bezierRadius, prevPoint.y,
                        currPoint.x - bezierRadius, currPoint.y,
                        currPoint.x, currPoint.y);

                    prevPoint = currPoint;

//                    path += String.format('L{0},{1} ', dx * (k + .5), dy * point.value);
                    if (k === data.points.length - 1) {
                        path += String.format('L{0},{1} ', dx * (k + 1), dy * point.value);
                    }
                }

                g0.append('path')
                    .attr('d', path)
                    .style({ stroke: data.color, 'stroke-width': 3, fill: 'none' });

                for (var k = 0; k < data.points.length; k++) {
                    var point = data.points[k];

                    g0.append('circle')
                        .attr('r', _opts.layout.bars.point.radius)
                        .attr('transform', self.formatTranslate(dx * (k + .5), dy * point.value))
                        .style({ stroke: data.color, 'stroke-width' : 3.5, fill: data.color });
                }
            });

        _charts = charts;
    }

    function animateChanges(callback) {
        return;
        self._c.selectAll('g[data-eltype="bars"]').data(self.data);
        d3.selectAll(self._c[0][0].childNodes)//.filter('.f-bar-value')
            .each(function (d, i) {
                if (!d) {
                    return;
                }

                var g0 = d3.select(this);
                var data = d.value;

                var g = d3.select(g0.selectAll('.f-bar-value')[0][0]);
                var p = self.yScale(data);

                var dy = d3.transform(g.attr('transform')).translate[1];

                g.transition()
                    .remove();
                g.transition()
                    .ease('cubic-out')
                    .duration(500)
                    .delay(i * 35)
                    .attr('transform', String.format('translate({0},{1})', p, dy));
            });
    }

    self.applyValues = function (data) {
        if (data.length === self.data.length) { // animating changes
            self.dataPrev = self.data;
            self.data = data;
            animateChanges(function () {
                self.dataPrev = null;
            });
        } else {
            self.data = data;
            prepareContainer();
            bindData();
        }
    }

    prepareContainer();
    bindData();
    animateChanges();
}