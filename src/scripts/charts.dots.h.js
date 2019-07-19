function chartDotsHorizontal(settings) {

    var self = this;
    self.name = 'dots-h';

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
                            radius: 6
                        },
                        bar: {
//                            width: 19,
                            height: 0,
                            margin: {
                                left: 3,
                                right: 3
                            }                        },
                        value: {
                            height: 26
                        },
                        value2: {
                            height: 20
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

/*
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
*/
    }

    function bindData() {

            var st = _opts.layout;
            // horizontal stroke
            var barWidth = parseInt(st.bars.bar.width);
        if (isNaN(barWidth)) {
            barWidth = self.w / self.data.length - st.bars.bar.margin.left - st.bars.bar.margin.right;
        }

        self._c.append('path')
                .attr('d', String.format('M{1},{0} L{2},{0}', 
                    st.bars.bar.height + st.bars.separator.height / 2,
                    barWidth / 2 + st.bars.bar.margin.left,
                    barWidth / 2 + (st.bars.bar.margin.left) * self.data.length
                    + ((barWidth + st.bars.bar.margin.right) * (self.data.length - 1)))
                    )
                .attr('stroke-dasharray', '3,2')
                .style({ stroke: '#ccc', 'stroke-width': 2 });


            var charts = self._c.selectAll('g').data(self.data)
            .enter().append('g')
            .each(function(d, i) {

                var g0 = d3.select(this);
                g0.attr('data-eltype', 'bars')
                    .attr('transform', self.formatTranslate(
                    (barWidth 
                    + st.bars.bar.margin.left
                    + (i > 0 ? st.bars.bar.margin.left : 0)
                    ) * i), 0);

                var data = d.value;

                var dy = 0;
                // the bar

                // the dot/separator
                g0.append('circle')
                    .attr('r', 0) // st.bars.separator.radius)
                    .attr('cy', dy + st.bars.separator.height / 2)
                    .attr('cx', barWidth / 2)
                    .style({ fill: d.color, stroke: self.isWhite(d.color) ? '#ccc' : null });
                dy += st.bars.separator.height;

                // value 2
                var titles = g0.append('g')
                    .attr('class', 'titles-group')
//                    .attr('transform', 'scale(.75,.75)')
                    .style({opacity: 0});

                titles.append('text')
                    .attr('text-anchor', 'middle')
//                    .attr('w', st.bars.value2.width)
                    .attr('dominant-baseline', 'central')
                    .attr('transform', self.formatTranslate(barWidth / 2, dy + st.bars.value2.height / 2))
//                    .style({'font-size': '.8em'})
                    .text(d.value2);

                dy += st.bars.value2.height;

                // value 1
                titles.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('class', 'title')
//                    .attr('w', st.bars.value.width)
                    .attr('dominant-baseline', 'central')
                    .attr('transform', self.formatTranslate(barWidth / 2, dy + st.bars.value.height / 2))
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

                var g = g0.selectAll('.titles-group');
//                var p = self.yScale(data);

//                var dx = d3.transform(g.attr('transform')).translate[0];

                g.transition()
                    .remove();
                g.transition()
                    .ease('cubic-out')
                    .duration(500)
                    .delay(i * 15)
                    .attr('transform', 'scale(0,0)')
                    .attr('transform', self.formatTranslate(0, 0))
                    .style({ opacity: 1 });

                var c = g0.selectAll('circle');

                c.transition()
                    .remove();
                c.transition()
                    .ease('cubic-out')
                    .duration(500)
                    .delay(i * 15)
                    .attr('r', _opts.layout.bars.separator.radius);
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
    };

    prepareContainer();
    bindData();
    animateChanges();
}