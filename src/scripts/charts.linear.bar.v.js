function chartBoxLinearBarVertical(settings) {

    var self = this;
    self.name = 'linear-bar-v';

    chartBase(self);
    initialize();

    self.settings = settings;
    self.container = settings.container;
    self.data = _.sortBy(settings.data, 'value');

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
                        bar: {
                            width: 20,
                            background: '#ccc'
                        },
                        value: {
                            stroke: {
                                width: 16
                            }
                        }
                    }
                },
                axis: {},
                bars: {}
            };

            d.meta.maskId = 'charts-linear-bar-v-bar-mask';

            d.layout.padding = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 25
            }

            d.bars.maxValue = 1;
//            d.bars.maxValueRangeMultiplier = 1.05;

            return d;
        }
    }

    function prepareContainer() {
        self.initializeLayout(_opts);
        self._b = self._layout.insert('g', ':first-child');

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
            .range([0, self.h]);


        // bars mask definition
        var clipPath = self._svg.append('defs')
            .append('clipPath')
            .attr('id', _opts.meta.maskId);

        clipPath.append('path')
            .attr('d', String.format('M0,{0} A{0},{0} 0 1 1 {1},{0} L{1},{2} A{0},{0} 0 1 1 0,{2} Z',
                _opts.layout.bars.bar.width / 2,
                _opts.layout.bars.bar.width,
                self.h - _opts.layout.bars.bar.width / 2));
    }

    function bindData() {

            var st = _opts.layout;
            var barHeight = self.h;

/*
            var g00 = self._b.append('g');
            g00
                .attr('transform', self.formatTranslate(self.w / 2, 0));

            var barBackground = g00.append('g')
                .attr('clip-path', String.format('url(#{0})', _opts.meta.maskId))
                .attr('transform', self.formatTranslate(0, 0));

            barBackground.append('rect')
                    .attr('width', st.bars.bar.width)
                    .attr('height', barHeight)
                    .style({ fill: st.bars.bar.background });
*/

            var charts = self._c.selectAll('g').data(self.data)
            .enter().append('g')
            .each(function(d, i) {

                var g0 = d3.select(this);
                g0.attr('data-eltype', 'bars')
                    .attr('transform', self.formatTranslate(self.w / 2, 0));

                var data = d.value;

                var dy = 0;
                // the bar
                var bar = g0.append('g')
                    .attr('clip-path', String.format('url(#{0})', _opts.meta.maskId))
                    .attr('transform', self.formatTranslate(0, dy));

               // bar.append('rect')
               //     .attr('width', st.bars.bar.width)
               //     .attr('height', barHeight)
               //     .style({ fill: st.bars.bar.background });

                var barIn = bar.append('g')
                    .attr('class', 'f-bar-value')
                    .attr('transform', self.formatTranslate(0, barHeight));

                barIn.append('path')
                    .attr('d', String.format('M0,{0} A{0},{0} 0 1 1 {1},{0} L{1},{2} A{0},{0} 0 1 1 0,{2} Z',
                        st.bars.bar.width / 2,
                        st.bars.bar.width,
                        barHeight - st.bars.bar.width / 2))
                    .style({ fill: d.color });


                var titleIn = g0.append('g')
                    .attr('class', 'f-bar-title')
                    .attr('transform', self.formatTranslate(3, barHeight))
                    .style('opacity', 0);

                    titleIn.append('line')
                        .attr('x1', 0)
                        .attr('x2', -16)
                        .attr('y1', 0)
                        .attr('y2', 0)
                        .style({ stroke: '#ccc', 'stroke-width': 2 });

                    titleIn.append('text')
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'central')
                        .attr('transform', self.formatTranslate(-40, 0))
                        .text(d.title);
            });

        _charts = charts;
    }

    function animateChanges(callback) {

        var barHeight = self.h;

        var dataPrepared = _.map(self.data, function (d) { return d.value; });
        var start = 0;
        for (var j = 0;  j < self.data.length; j++) {
            dataPrepared[j] = start;
            start += self.data[j].value;
        }

        var prevDy = 0;

        self._c.selectAll('g[data-eltype="bars"]').data(self.data);
        d3.selectAll(self._c[0][0].childNodes)//.filter('.f-bar-value')
            .each(function (d, i) {
                if (!d) {
                    return;
                }

                var g0 = d3.select(this);
                var data = dataPrepared[i];

                var g = d3.select(g0.selectAll('.f-bar-value')[0][0]);

                var p = self.yScale(data);

                var dx = d3.transform(g.attr('transform')).translate[0];
                
                g.transition()
                    .remove();
                g.transition()
                    .ease('cubic-out')
                    .duration(1000)
                    .delay(200 + i * 15)
                    .attr('transform', String.format('translate({0},{1})', dx, -p));

                var t = g0.selectAll('.f-bar-title');

                var dxt = d3.transform(t.attr('transform')).translate[0];

                var td = ((i === dataPrepared.length - 1 ? 1 : dataPrepared[i + 1]) - dataPrepared[i]) / 2
                    + dataPrepared[i];

                var tp = self.yScale(1 - td);
                var tpVers = self.yScale(td);

                t.transition()
                    .remove();
                t.transition()
                    .ease('cubic-out')
                    .duration(1000)
                    .delay(200 + i * 15)
                    .attr('transform', String.format('translate({0},{1})', dxt, tp))
                    .style('opacity', 1);

                var label = t.selectAll('text');
                var labelBox = label.node().getBBox();
                var diff = 0;
                if (tpVers - prevDy < -3) {
                    diff = tpVers - prevDy + 3;
                    var lblDxt = d3.transform(label.attr('transform')).translate[0];
                    label.attr('transform', self.formatTranslate(lblDxt, diff));
                }
                prevDy = tpVers + Math.abs(diff) + labelBox.height - 3;
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
            self.data = _.sortBy(data, 'value');
            prepareContainer();
            bindData();
        }
    };

    prepareContainer();
    bindData();
    animateChanges();
}