function chartBoxLinearHorizontal(settings) {

    var self = this;
    self.name = 'linear-h';

    chartBase(self);
    initialize();

    self.settings = settings;
    self.container = settings.container;
    self.data = settings.data;

    var _opts = self.mergeDefaults(settings.options);
    var _charts = null;

    function initialize() {
        self.getDefaults = function() {
            var d = {
                meta: {},
                layout: {
                    bars: {
                        title: {
                            width: 100
                        },
                        separator: {
                            width: 30,
                            radius: 4
                        },
                        bar: {
                            width: 235,
                            height: 26,
                            margin: {
                                top: 7,
                                bottom: 5
                            },
                            background: '#e3e3e3'
                        },
                        value: {
                            width: 80
                        },
                        value2: {
                            width: 10
                        }
                    }
                },
                axis: {},
                bars: {}
            };

            d.meta.maskId = 'charts-linear-h-bar-mask';

            d.layout.padding = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }

            d.bars.maxValue = 1;
//            d.bars.maxValueRangeMultiplier = 1.05;

            return d;
        }
    }

    function prepareContainer() {
        self.initializeLayout(_opts);

//        self.xScale = d3.scale.ordinal()
//            .domain(d3.range(0, self.data.length))
//            .rangeBands([0, _opts.layout.bars.bar.width]);

        var d = [];
        _.each(self.data, function(el) {
            self.isArray(el.value) ? d.push.apply(d, el.value) : d.push(el.value);
        });
        self.maxValue = d3.max(d);
        if (_opts.bars.maxValue && _opts.bars.maxValue > self.maxValue) {
            self.maxValue = _opts.bars.maxValue;
        }
        var max = self.maxValue || .001;
        max *= (_opts.bars.maxValueRangeMultiplier || 1);
        self.maxRangeValue = max;
        self.yScale = d3.scale.linear()
            .domain([0, max])
            .range([0, _opts.layout.bars.bar.width]);


        // bars mask definition
        var clipPath = self._svg.append('defs')
            .append('clipPath')
            .attr('id', _opts.meta.maskId);

        clipPath.append('path')
            .attr('d', String.format('M{2},0 A{0},{0} 0 1 1 {2},{1} L{0},{1} A{0},{0} 0 1 1 {0},0 Z',
                _opts.layout.bars.bar.height / 2, _opts.layout.bars.bar.height,
                _opts.layout.bars.bar.width - _opts.layout.bars.bar.height / 2));
    }

    function bindData() {

            var st = _opts.layout;
            // vertical stroke
            self._c.append('path')
                .attr('d', String.format('M{0},{1} L{0},{2}', 
                    st.bars.title.width + st.bars.separator.width / 2,
                    st.bars.bar.height / 2 + st.bars.bar.margin.top,
                    st.bars.bar.height / 2 + (st.bars.bar.margin.top) * self.data.length
                    + ((st.bars.bar.height + st.bars.bar.margin.bottom) * (self.data.length - 1)))
                    )
                .attr('stroke-dasharray', '3,2')
                .style({ stroke: '#ccc', 'stroke-width': 2 });


            var charts = self._c.selectAll('g').data(self.data)
            .enter().append('g')
            .each(function(d, i) {

                var g0 = d3.select(this);
                g0.attr('data-eltype', 'bars')
                    .attr('transform', self.formatTranslate(0,
                    (st.bars.bar.height 
                    + st.bars.bar.margin.top
                    + (i > 0 ? st.bars.bar.margin.bottom : 0)
                    ) * i));

                var data = d.value;

                var dx = st.bars.title.width;
                // title
                g0.append('text')
                    .attr('class', 'bar-title')
                    .attr('text-anchor', 'end')
                    .attr('dominant-baseline', 'central')
                    .attr('transform', self.formatTranslate(dx, st.bars.bar.height / 2))
                    .text(d.title);

                // the dot/separator
                g0.append('circle')
                    .attr('r', st.bars.separator.radius)
                    .attr('cx', dx + st.bars.separator.width / 2)
                    .attr('cy', st.bars.bar.height / 2)
                    .style({ fill: d.color, stroke: self.isWhite(d.color) ? '#ccc' : '' });
                dx += st.bars.separator.width;

                // the bar
                var bar = g0.append('g')
                    .attr('clip-path', String.format('url(#{0})', _opts.meta.maskId))
                    .attr('transform', self.formatTranslate(dx, 0));

                bar.append('rect')
                    .attr('width', st.bars.bar.width)
                    .attr('height', st.bars.bar.height)
                    .style({ fill: st.bars.bar.background });

                var barIn = bar.append('g')
                    .attr('class', 'f-bar-value');

                barIn.append('path')
                    .attr('d', String.format('M{2},0 A{0},{0} 0 1 1 {2},{1} L{0},{1} A{0},{0} 0 1 1 {0},0 Z',
                        st.bars.bar.height / 2, st.bars.bar.height,
                        st.bars.bar.width - st.bars.bar.height / 2))
                    .style({ fill: d.color })
                    .attr('transform', self.formatTranslate(-st.bars.bar.width, 0));

                    // border for white bar
                    if (self.isWhite(d.color)) {
                        bar.append('path')
                            .attr('d', String.format('M{2},0 A{0},{0} 0 1 1 {2},{1} L{0},{1} A{0},{0} 0 1 1 {0},0 Z',
                                st.bars.bar.height / 2, st.bars.bar.height,
                                st.bars.bar.width - st.bars.bar.height / 2))
                            .style({ fill: 'none', stroke: '#ccc' });

                    }

                    dx += st.bars.bar.width;

                // value 1
                g0.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .attr('transform', self.formatTranslate(dx + st.bars.value.width / 2, st.bars.bar.height / 2))
                    .text(d.valueTitle || d.value);

                dx += st.bars.value.width;

                // value 2
                g0.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .attr('transform', self.formatTranslate(dx + st.bars.value2.width / 2, st.bars.bar.height / 2))
                    .text(d.value2);

                dx += st.bars.value2.width;
            });

        _charts = charts;
    }

    function animateChanges(callback) {

        var barsDelay = 25;
        var barDuration = 750;

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
                    .ease('exp-out')
                    .duration(barDuration)
                    .delay(i * barsDelay)
                    .attr('transform', String.format('translate({0},{1})', p, dy));
        });
    }

    self.applyValues = function (data) {
        if (data.length === self.data.length) { // animating changes
            self.dataPrev = self.data;
            self.data = data;
            animateChanges(function() {
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