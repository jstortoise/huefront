function chartNailsLinearVertical(settings) {

    var self = this;
    self.name = 'nails-linear-v';

    chartBase(self);
    initialize();

    self.settings = settings;
    self.container = settings.container;

    self.data = settings.data;// && settings.data.data ? settings.data.data : settings.data;
    self.dataGroups = settings.data && settings.data.groups ? settings.data.groups : [];

    var _opts = self.mergeDefaults(settings.options);
    var _charts = null;

    function initialize() {
        self.getDefaults = function() {
            var d = {
                meta: {},
                groups: {
                    items: {

                    },
                    separator: {
                        color: '#c6c6c6',
                        width: 2
                    },
                    height: 30
                },

                layout: {
                    mode: 'default',
                    periods: {
                        width: 100
                    },
                    bars: {
//                        title: {
//                            width: 50
//                        },
                        circle: {
                            radius: 30
                        },
                        alternateColor: 'rgba(0,0,0,.03)',
                        alternateIsEven: true
                    }
                },
                bars: {}
            };

            d.meta.maskId = 'charts-nails-linear-v-bar-mask';

            d.layout.padding = {
                left: 14,
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
        self._gr = self._svg.insert('g', ':first-child')
            .attr('class', 'axis-titles');

//        self.xScale = d3.scale.ordinal()
//            .domain(d3.range(0, self.data.length))
//            .rangeBands([0, _opts.layout.bars.bar.width]);

        self._f = self._layout.append('g');

        var d = [];
        _.each(self.data.data, function (el) {
            self.isArray(el.data) ? d.push.apply(d, _.map(el.data, function (d) { return d.value; })) : d.push(el.value);
        });
        self.maxValue = d3.max(d);
        if (_opts.bars.maxValue && _opts.bars.maxValue > self.maxValue) {
            self.maxValue = _opts.bars.maxValue;
        }
        var max = self.maxValue || .001;
        max *= (_opts.bars.maxValueRangeMultiplier || 1);
        self.maxRangeValue = max;

        var partsCount = (self.data.periods || []).length;
        if (partsCount === 0) {
            partsCount = 1;
        }
        partsCount += 2; // title and circles
        self.yScale = d3.scale.linear()
            .domain([0, max])
            .range([0, (self.h - _opts.groups.height) / partsCount]);


        // bars mask definition
        var clipPath = self._svg.append('defs')
            .append('clipPath')
            .attr('id', _opts.meta.maskId);

        clipPath.append('circle')
            .attr('r', _opts.layout.bars.circle.radius);
//            .attr('d', String.format('M0,{0} A{0},{0} 0 1 1 {1},{0} L{1},{2} A{0},{0} 0 1 1 0,{2} Z',
//                _opts.layout.bars.bar.width / 2,
//                _opts.layout.bars.bar.width,
//                _opts.layout.bars.bar.height - _opts.layout.bars.bar.width / 2));
    }

    function bindData() {

        var st = _opts.layout;

        var periods = self.data.periods || [];
        var periodsCount = (periods).length;
        if (periodsCount === 0) {
            periodsCount = 1;
        }

        self._gr.html('');

        var partsCount = periodsCount + 2;
        var contentHeight = self.h - _opts.groups.height;

        for (var j = 0; j < periodsCount; j++) {
            self._gr.append('line')
                .attr('x1', 0)
                .attr('x2', self.w)
                .attr('y1', contentHeight / partsCount * (j + 1))
                .attr('y2', contentHeight / partsCount * (j + 1))
                .style({ stroke: '#ccc' });

            self.appendTextMultiline(self._gr, periods[j] ? periods[j].title : '', { anchor: 'middle' })
                .attr('transform', self.formatTranslate(_opts.layout.periods.width / 2, contentHeight / partsCount * (j + .5)))
        }

        self._gr.append('line')
            .attr('x1', _opts.layout.periods.width)
            .attr('x2', _opts.layout.periods.width)
            .attr('y1', 0)
            .attr('y2', contentHeight / partsCount * (partsCount - 1))
            .style({ stroke: '#ccc' });

        self._gr.append('text')
            .text('Total #')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('transform', self.formatTranslate(_opts.layout.periods.width / 2, contentHeight / partsCount * (partsCount - 1 + .66)));

        var dx = self.data.data.length ? (self.w - st.periods.width) / self.data.data.length : 0;
        var dy = contentHeight / partsCount;
        var charts = self._c.selectAll('g').data(self.data.data)
            .enter().append('g')
            .each(function(d, i) {

                var g0 = d3.select(this);
                g0.attr('data-eltype', 'bars')
                    .attr('transform', self.formatTranslate(st.periods.width + (dx * i), 0));

                var isEvenCondition = _opts.layout.bars.alternateIsEven !== false;
                var isAlternate = i % 2 === 1;
                var isAlternateFilled = isEvenCondition && !isAlternate || !isEvenCondition && isAlternate;
                if (isAlternateFilled && _opts.layout.bars.alternateColor) {
                    g0.append('rect')
                        .attr('width', dx)
                        .attr('height', dy * (partsCount - 1))
                        .style({ fill: _opts.layout.bars.alternateColor });
                }

                var data = d;

                if (_opts.layout.mode != 'colors') {
                    for (var k = 0; k < data.data.length; k++) {
                        var g1 = g0.append('g')
                            .attr('transform', self.formatTranslate(dx / 2,
                                dy * k))
                            .attr('class', 'f-value-bar')
                            .attr('data-value', data.data[k].value)
                            .attr('data-value-prev', k === data.data.length - 1 ? '' : data.data[k + 1].value);

                        var g2 = g1.append('g')
                            .attr('class', 'f-value-bar-core')
                            .attr('transform', self.formatTranslate(0, dy));

                        g2.append('text')
                            .text(data.data[k].title)
                            .attr('text-anchor', 'middle')
                            .attr('dominant-baseline', 'central')
                            .attr('transform', self.formatTranslate(0, -15))
                            .style({opacity: 0});

                        g2.append('line')
                            .attr('x1', -6)
                            .attr('x2', 6)
                            .attr('y1', 0)
                            .attr('y2', 0)
                            .style({ stroke: '#333', 'stroke-width': '2' });

                        g2.append('line')
                            .attr('class', 'f-value-bar-line')
                            .attr('x1', 0)
                            .attr('x2', 0)
                            .attr('y1', 0)
                            .attr('y2', k === data.data.length - 1 ? 0 : dy)
                            .style({ stroke: '#333', 'stroke-width': '2' });
                    }

                } else {
                    for (var l = 0; l < data.colors.length; l++) {
                        var g1 = g0.append('g')
                            .attr('transform', self.formatTranslate(dx / 2,
                                dy * k))
//                            .attr('class', 'f-value-bar')
//                            .attr('data-value', data.data[k].value)
//                            .attr('data-value-prev', k === data.data.length - 1 ? '' : data.data[k + 1].value);
                        var g2 = g1.append('rect')
                            .attr('width', 42)
                            .attr('height', 16)
                            .attr('fill', data.colors[l].color || data.colors[l])
                            .attr('transform', self.formatTranslate(-21, dy * l + 10));

                        var g2 = g1.append('rect')
                            .attr('width', 42)
                            .attr('height', 16)
                            .attr('fill', data.colors[l].color || data.colors[l])
                            .style('opacity', Math.random())
                            .attr('transform', self.formatTranslate(-21, dy * l + 40));

                        var g2 = g1.append('rect')
                            .attr('width', 42)
                            .attr('height', 16)
                            .attr('fill', data.colors[l].color || data.colors[l])
                            .style('opacity', Math.random())
                            .attr('transform', self.formatTranslate(-21, dy * l + 70));
                    }

/*
                    for (var k = 0; k < data.data.length; k++) {
                        var g1 = g0.append('g')
                            .attr('transform', self.formatTranslate(dx / 2,
                                dy * k))
                            .attr('class', 'f-value-bar')
                            .attr('data-value', data.data[k].value)
                            .attr('data-value-prev', k === data.data.length - 1 ? '' : data.data[k + 1].value);

                        var g2 = g1.append('g')
                            .attr('class', 'f-value-bar-core')
                            .attr('transform', self.formatTranslate(0, dy));

                        g2.append('text')
                            .text(data.data[k].title)
                            .attr('text-anchor', 'middle')
                            .attr('dominant-baseline', 'central')
                            .attr('transform', self.formatTranslate(0, -15))
                            .style({ opacity: 0 });

                        g2.append('line')
                            .attr('x1', -6)
                            .attr('x2', 6)
                            .attr('y1', 0)
                            .attr('y2', 0)
                            .style({ stroke: '#333', 'stroke-width': '2' });

                        g2.append('line')
                            .attr('class', 'f-value-bar-line')
                            .attr('x1', 0)
                            .attr('x2', 0)
                            .attr('y1', 0)
                            .attr('y2', k === data.data.length - 1 ? 0 : dy)
                            .style({ stroke: '#333', 'stroke-width': '2' });
                    }
*/
                }

                // circle
                g0.append('g')
                    .attr('transform', self.formatTranslate(dx / 2,
                        dy * (partsCount - 2)))

                    .append('g')
                    .attr('transform', self.formatTranslate(0, dy / 2))
                    .attr('clip-path', String.format('url(#{0})', _opts.meta.maskId))

                    .append('circle')
                    .attr('r', _opts.layout.bars.circle.radius)
                    .attr('transform', self.formatTranslate(-_opts.layout.bars.circle.radius * 3 , _opts.layout.bars.circle.radius * 3))
                    .style({fill: data.color, stroke: self.isWhite(data.color) ? '#ccc' : null });


                // titles
                var gTitle = g0.append('g')
                    .attr('transform', self.formatTranslate(dx / 2, dy * (partsCount - 1)));

                var lblGroup = gTitle.append('g')
                    .attr('transform', self.formatTranslate(0, dy / 3));

                var lbl = lblGroup.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .text(data.title)
                    .style('text-transform', 'uppercase');

                var box = lbl.node().getBBox();
                var boxMaxWidth = (dx - 8);
                if (box.width > boxMaxWidth) {

                    var sentense = data.title;
                    var firstWord = sentense, secondWord;
                    var ind = sentense.lastIndexOf(' ');
                    if (ind === -1) {
                        ind = sentense.lastIndexOf('-');
                    }
                    if (ind > -1 && ind < sentense.length - 1) {
                        firstWord = sentense.substr(0, ind + 1);
                        secondWord = sentense.substr(ind + 1);
                    }
                    lbl.text(firstWord);

                    if (secondWord) {
                        var lbl2 = lblGroup
                            .append('text')
                            .text(secondWord)
                            .attr('text-anchor', 'middle')
                            .attr('alignment-baseline', 'middle')
                            .attr('class', 'legend-title')
                            .attr('transform', self.formatTranslate(0, box.height * 1.00));

                        lblGroup
                            .attr('transform', self.formatTranslate(0, dy / 3
                            - box.height * (1 + .00) / 2));
                    }
                }


                gTitle.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .text(data.value)
                    .attr('transform', self.formatTranslate(0, dy / 3 * 2));
            });


        var prevGroup = null;
        var groupTitles = self._f.append('g')
            .attr('class', 'group-titles');

        var prevGroupSectionsFrom = 0;
        var prevGroupSectionsTo = 0;


        for (var i = 0; i < self.data.data.length; i++) {
            var d = self.data.data[i];
            // groups separator
            var drawGroupTitle = function () {
                groupTitles.append('text')
                    .text(prevGroup ? prevGroup.title : '')
                    .attr({
                        'text-anchor': 'middle',
                        'alignment-baseline': 'middle',
                        'transform': self.formatTranslate(st.periods.width
                            + prevGroupSectionsFrom * dx
                            + (prevGroupSectionsTo - 1 - prevGroupSectionsFrom) * dx / 2,
                            self.h - _opts.groups.height / 2)
                    });
            };
            prevGroupSectionsTo++;

            if (!prevGroup && (self.dataGroups || []).length) {
                prevGroup = _.find(self.dataGroups, { name: d.group });
                prevGroupSectionsFrom = 0;
            } else if (prevGroup && prevGroup.name !== (d.group || '')) {
                var x1 = dx * i - _opts.groups.separator.width / 2 + 1
                    + st.periods.width;
                self._f.append('line')
                    .attr({
                        x1: x1,
                        x2: x1,
                        y1: -_opts.layout.padding.top,
                        y2: self.h
                    }).style({
                        stroke: _opts.groups.separator.color,
                        'stroke-width': _opts.groups.separator.width,
                        'stroke-dasharray': '4,4',
                        'box-shadow': '0 0 2px 2px #fff'
                    });

                drawGroupTitle();

                prevGroup = _.find(self.dataGroups, { name: d.group || '' });
                prevGroupSectionsFrom = prevGroupSectionsTo;
            } else if (prevGroup && i === self.data.data.length - 1) {
                drawGroupTitle();
            }
        }
        if (prevGroup) {
            self._f.append('line')
                .attr({
                    x1: 0,
                    x2: self.w,
                    y1: self.h-_opts.groups.height - 3,
                    y2: self.h-_opts.groups.height - 3
                }).style({
                    stroke: _opts.groups.separator.color,
                    'stroke-width': _opts.groups.separator.width,
                    'stroke-dasharray': '4,4',
                    'box-shadow': '0 0 2px 2px #fff'
                });

        }
    }

    function animateChanges(callback) {

        var periods = self.data.periods || [];
        var periodsCount = (periods).length;
        if (periodsCount === 0) {
            periodsCount = 1;
        }
        var partsCount = periodsCount + 2;

        var contentHeight = self.h - _opts.groups.height;

        self._c.selectAll('g[data-eltype="bars"]').data(self.data);
        d3.selectAll(self._c[0][0].childNodes)//.filter('.f-bar-value')
            .each(function (d, i) {
                if (!d) {
                    return;
                }

                var g0 = d3.select(this);
                var data = d.value;

                var circle = g0.selectAll('circle');
                circle.transition()
                    .remove();
                circle.transition()
                    .ease('cubic-out')
                    .duration(500)
                    .delay(i * 10)
                    .attr('transform', String.format('translate({0},{1})', 0, 0));

                var bars = g0.selectAll('.f-value-bar');

                for (var j = 0; j < bars[0].length; j++) {
                    var bar = d3.select(bars[0][j]);
                    var value = parseFloat(bar.attr('data-value'));
                    var valuePrev = parseFloat(bar.attr('data-value-prev'));

                    var valueTransformed = (Math.round(value / (1 / 3) - .5) + 0) / 10 * 3.33;
                    valueTransformed += .05;

                    var valueTransformedPrev = isNaN(valuePrev) ? 1 : (Math.round(valuePrev / (1 / 3) - .5) + 1) / 10 * 3.33;
                    var p = self.yScale(valueTransformed);
                    var pPrev = self.yScale(1 - valueTransformedPrev);
//                    p -= 10;
//                    p -= 35;

                    var text = bar.selectAll('text');
                    text.transition()
                        .remove();
                    text.transition()
                        .ease('cubic-out')
                        .duration(500)
                        .delay(200 + i * 25)
                        .style({opacity: 1});


                    var core = bar.selectAll('.f-value-bar-core');
                    var dx = d3.transform(core.attr('transform')).translate[0];

                    core.transition()
                        .remove();
                    core.transition()
                        .ease('cubic-out')
                        .duration(500)
                        .delay(i * 15)
                        .attr('transform', String.format('translate({0},{1})', dx,
                            contentHeight / partsCount - p));

                    var line = bar.selectAll('.f-value-bar-line');

                    line.transition()
                        .remove();
                    line.transition()
                        .ease('cubic-out')
                        .duration(500)
                        .delay(i * 15)
                        .attr('y2', p + contentHeight / partsCount * (1 - valueTransformedPrev));
                }
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
