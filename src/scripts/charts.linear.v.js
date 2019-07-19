function chartBoxLinearVertical(settings) {

    var self = this;
    self.name = 'linear-v';

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
//                        title: {
//                            width: 50
//                        },
                        separator: {
                            height: 24,
                            radius: 4
                        },
                        bar: {
                            width: 19,
                            height: 200,
                            margin: {
                                left: 3,
                                right: 3
                            },
                            background: '#ccc'
                        },
                        value: {
                            height: 40
                        },
                        value2: {
                            height: 40
                        }
                    }
                },
                axis: {},
                bars: {}
            };

            d.meta.maskId = 'charts-linear-v-bar-mask';

            d.layout.padding = {
                left: 10,
                right: 10,
                top: 0,
                bottom: 10
            };

//            d.bars.maxValue = 100;
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
            .range([0, _opts.layout.bars.bar.height]);


        // bars mask definition
        var clipPath = self._svg.append('defs')
            .append('clipPath')
            .attr('id', _opts.meta.maskId);

        clipPath.append('path')
            .attr('d', String.format('M0,{0} A{0},{0} 0 1 1 {1},{0} L{1},{2} A{0},{0} 0 1 1 0,{2} Z',
                _opts.layout.bars.bar.width / 2,
                _opts.layout.bars.bar.width,
                _opts.layout.bars.bar.height - _opts.layout.bars.bar.width / 2));
    }

    function bindData() {

            var st = _opts.layout;
            // horizontal stroke
            self._c.append('path')
                .attr('d', String.format('M{1},{0} L{2},{0}', 
                    st.bars.bar.height + st.bars.separator.height / 2,
                    st.bars.bar.width / 2 + st.bars.bar.margin.left,
                    st.bars.bar.width / 2 + (st.bars.bar.margin.left) * self.data.length
                    + ((st.bars.bar.width + st.bars.bar.margin.right) * (self.data.length - 1)))
                    )
                .attr('stroke-dasharray', '3,2')
                .style({ stroke: '#ccc', 'stroke-width': 2 });


            var charts = self._c.selectAll('g').data(self.data)
            .enter().append('g')
            .each(function(d, i) {

                var g0 = d3.select(this);
                g0.attr('data-eltype', 'bars')
                    .attr('transform', self.formatTranslate(
                    (st.bars.bar.width 
                    + st.bars.bar.margin.left
                    + (i > 0 ? st.bars.bar.margin.left : 0)
                    ) * i), 0);

                var data = d.value;

                var dy = 0;
                // the bar
                var bar = g0.append('g')
                    .attr('clip-path', String.format('url(#{0})', _opts.meta.maskId))
                    .attr('transform', self.formatTranslate(0, dy));

                bar.append('rect')
                    .attr('width', st.bars.bar.width)
                    .attr('height', st.bars.bar.height)
                    .style({ fill: st.bars.bar.background });

                var barIn = bar.append('g')
                    .attr('class', 'f-bar-value')
                    .attr('transform', self.formatTranslate(0, st.bars.bar.height));

                barIn.append('path')
                    .attr('d', String.format('M0,{0} A{0},{0} 0 1 1 {1},{0} L{1},{2} A{0},{0} 0 1 1 0,{2} Z',
                        st.bars.bar.width / 2,
                        st.bars.bar.width,
                        st.bars.bar.height - st.bars.bar.width / 2))
                    .style({ fill: d.color });

                // border for white bar
                if (self.isWhite(d.color)) {
                    bar.append('path')
                        .attr('d', String.format('M0,{0} A{0},{0} 0 1 1 {1},{0} L{1},{2} A{0},{0} 0 1 1 0,{2} Z',
                            st.bars.bar.width / 2,
                            st.bars.bar.width,
                            st.bars.bar.height - st.bars.bar.width / 2))
                        .style({ fill: 'none', stroke: '#ccc' });
                }


                dy += st.bars.bar.height;

                // the dot/separator
                g0.append('circle')
                    .attr('r', st.bars.separator.radius)
                    .attr('cy', dy + st.bars.separator.height / 2)
                    .attr('cx', st.bars.bar.width / 2)
                    .style({ fill: d.color, stroke: self.isWhite(d.color) ? '#ccc' : null });
                dy += st.bars.separator.height;

                // value 2
                g0.append('text')
                    .attr('text-anchor', 'middle')
//                    .attr('w', st.bars.value2.width)
                    .attr('dominant-baseline', 'central')
                    .attr('transform', self.formatTranslate(st.bars.bar.width / 2, dy + st.bars.value2.height / 2))
                    .style({'font-size': '.92em'})
                    .text(d.value2);

                dy += st.bars.value2.height;

                // value 1
                g0.append('text')
                    .attr('text-anchor', 'middle')
//                    .attr('w', st.bars.value.width)
                    .attr('dominant-baseline', 'central')
                    .attr('transform', self.formatTranslate(st.bars.bar.width / 2, dy + st.bars.value.height / 2))
                    .text(d.valueTitle || d.value);

                dy += st.bars.value.height;

            });

        _charts = charts;
    }

    function animateChanges(callback) {

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

                var dx = d3.transform(g.attr('transform')).translate[0];

                g.transition()
                    .remove();
                g.transition()
                    .ease('cubic-out')
                    .duration(500)
                    .delay(i * 15)
                    .attr('transform', String.format('translate({0},{1})', dx, _opts.layout.bars.bar.height - p));
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