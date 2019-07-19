function chartNailsLinearVerticalSimple(settings) {

    var self = this;
    self.name = 'nails-linear-v-simple';

    chartBase(self);
    initialize();

    self.settings = settings;
    self.container = settings.container;

    self.data = settings.data && settings.data.data ? settings.data.data : settings.data;
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
                    bars: {
//                        title: {
//                            width: 50
//                        },
                        circle: {
                            radius: 34
                        },
                            alternateColor: 'rgba(0,0,0,.03)',
                        title: {
                            height: 50
                        },
                        value: {
                            height: 20
                        },
                        value2: {
                            height: 20
                        },
                        legend: {
                            height: 130
                        },
                        bar: {
                            nail: {
                                color: '#9d9d9e'
                            }
                        }
                    }
                },
                bars: {}
            };

            d.meta.maskId = 'charts-nails-linear-v-simple-bar-mask';

            d.layout.padding = {
                left: 14,
                right: 0,
                top: 90,
                bottom: 0
            }

            d.bars.maxValue = 1;
//            d.bars.maxValueRangeMultiplier = 1.05;

            return d;
        }
    }

    function prepareContainer() {
        self.initializeLayout(_opts);
//        self._gr = self._layout.insert('g', ':first-child');

//        self.xScale = d3.scale.ordinal()
//            .domain(d3.range(0, self.data.length))
        //            .rangeBands([0, _opts.layout.bars.bar.width]);

        self._f = self._layout.append('g');


        var d = [];
        _.each(self.data, function (el) {
            self.isArray(el.value) ? d.push.apply(d, el.value) : d.push(el.value);
        });
        self.maxValue = d3.max(d);
        if (_opts.bars.maxValue && _opts.bars.maxValue > self.maxValue) {
            self.maxValue = _opts.bars.maxValue;
        }
        var max = self.maxValue || .001;
        max *= (_opts.bars.maxValueRangeMultiplier || 1);
        self.maxRangeValue = max;

        var workingAreaHeight = self.h
            - _opts.layout.bars.title.height
            - _opts.layout.bars.legend.height
            - _opts.groups.height;
        self.yScale = d3.scale.linear()
            .domain([0, max])
            .range([0, workingAreaHeight]);


        // bars mask definition
        var clipPath = self._svg.append('defs')
            .append('clipPath')
            .attr('id', _opts.meta.maskId);

        clipPath.append('circle')
            .attr('r', _opts.layout.bars.circle.radius);
    }

    function bindData() {
        var prevGroup = null;
        var groupTitles = self._f.append('g')
            .attr('class', 'group-titles');

        var prevGroupSectionsFrom = 0;
        var prevGroupSectionsTo = 0;

        var st = _opts.layout;
        var workingAreaHeight = self.h
            - st.bars.title.height
            - st.bars.legend.height
            - _opts.groups.height;

//        self._gr.html('');

        var dx = self.data.length ? self.w / self.data.length : 0;
        var dy = 0;
        var charts = self._c.selectAll('g').data(self.data)
            .enter().append('g')
            .each(function(d, i) {

                var g0 = d3.select(this);
                g0.attr('data-eltype', 'bars')
                    .attr('transform', self.formatTranslate((dx * i), 0));

//                if (i % 2 && _opts.layout.bars.alternateColor) {
//                    g0.append('rect')
//                        .attr('width', dx)
//                        .attr('height', dy * (partsCount - 1))
//                        .style({ fill: _opts.layout.bars.alternateColor });
//                }

                var data = d;

                // legend title
                var lblGroup = g0.append('g')
                    .attr('class', 'chart-titles')
                    .attr('transform', self.formatTranslate(dx / 2, self.h
                        - _opts.groups.height
                        - st.bars.title.height / 2));

                var lbl = lblGroup.append('text')
                    .attr({
                        'text-anchor': 'middle',
                        'alignment-baseline': 'middle'
                    })
                    .text(d.title);

                var box = lbl.node().getBBox();
                var boxMaxWidth = (dx - 8);
                if (box.width > boxMaxWidth) {
                    var sentense = d.title;
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
                            .attr('transform', self.formatTranslate(dx / 2, self.h
                                - _opts.groups.height
                                - st.bars.title.height / 2
                                - box.height * (1 + .00) / 2));
                    }
                }


                // groups separator
                var drawGroupTitle = function () {
                    groupTitles.append('text')
                        .text(prevGroup ? prevGroup.title : '')
                        .attr({
                            'text-anchor': 'middle',
                            'alignment-baseline': 'middle',
                            'transform': self.formatTranslate(prevGroupSectionsFrom * dx + (prevGroupSectionsTo - 1 - prevGroupSectionsFrom) * dx / 2, self.h - _opts.groups.height / 2)
                        });
                };
                prevGroupSectionsTo++;

                if (!prevGroup && (self.dataGroups || []).length) {
                    prevGroup = _.find(self.dataGroups, { name: d.group });
                    prevGroupSectionsFrom = 0;
                } else if (prevGroup && prevGroup.name !== (d.group || '')) {
                    self._f.append('line')
                        .attr({
                            x1: dx * i - _opts.groups.separator.width / 2 + 1,
                            x2: dx * i - _opts.groups.separator.width / 2 + 1,
                            y1: -_opts.layout.padding.top,
                            y2: self.h
                        }).style({
                            stroke: _opts.groups.separator.color,
                            'stroke-width': _opts.groups.separator.width,
                            'stroke-dasharray': '5,5',
                            'box-shadow': '0 0 2px 2px #fff'
                        });

                    drawGroupTitle();

                    prevGroup = _.find(self.dataGroups, { name: d.group || '' });
                    prevGroupSectionsFrom = prevGroupSectionsTo;
                } else if (prevGroup && i === self.data.length - 1) {
                    drawGroupTitle();
                }

                // dots values
                // circle
                var circle = g0.append('g')
//                    .attr('class', 'chart-titles')
                    .attr('transform', self.formatTranslate(0, workingAreaHeight));

                var circleIn = circle.append('g')
                    .attr('transform', self.formatTranslate(dx / 2, 0));


                circleIn.append('g')
                    .attr('transform', self.formatTranslate(0, 0))

                    .append('line')
                    .attr('x1', 0)
                    .attr('y1', 0)
                    .attr('x2', 0)
                    .attr('y2', st.bars.legend.height)
                    .style({'stroke': st.bars.bar.nail.color, 'stroke-width': 2});

                circleIn.append('g')
                    .attr('transform', self.formatTranslate(0, 40))
                    .attr('clip-path', String.format('url(#{0})', _opts.meta.maskId))

                    .append('circle')
                    .attr('r', _opts.layout.bars.circle.radius)
                    .attr('transform', self.formatTranslate(-_opts.layout.bars.circle.radius * 3, _opts.layout.bars.circle.radius * 3))
                    .style({
                        fill: data.color, stroke: self.isWhite(d.color) ? '#ccc' : '',
                        'stroke-width': self.isWhite(d.color) ? 2 : ''
                    });



                // value
                var valueContainer = g0.append('g')
                    .attr('transform', self.formatTranslate(0, workingAreaHeight))
                    .attr('data-value', d.value)
                    .attr('class', 'f-value-bar');

                var valueContainerIn = valueContainer.append('g')
                    .attr('class', 'f-value-bar-core')
                    .attr('transform', self.formatTranslate(dx / 2, 0));

                valueContainerIn.append('text')
                    .text(d.valueTitle)
                    .attr('class', 'value-title')
                    .attr('transform', self.formatTranslate(0, -70))
                    .attr({
                        'text-anchor': 'middle',
                        'alignment-baseline': 'middle'
                    })
                    .style({ opacity: 0 });

                valueContainerIn.append('text')
                    .text(d.valueTitle2)
                    .attr('class', 'value-title2')
                    .attr('transform', self.formatTranslate(0, -45))
                    .attr({
                        'text-anchor': 'middle',
                        'alignment-baseline': 'middle'
                    })
                    .style({ opacity: 0 });

                valueContainerIn.append('line')
                    .attr('class', 'f-value-bar-line-h')
                    .attr('x1', -5)
                    .attr('y1', -31)
                    .attr('x2', 5)
                    .attr('y2', -31)
                    .attr('stroke', st.bars.bar.nail.color)
                    .attr('stroke-width', '2')
                    .style({ opacity: 0 });

                valueContainerIn.append('line')
                    .attr('class', 'f-value-bar-line')
                    .attr('x1', 0)
                    .attr('y1', -31)
                    .attr('x2', 0)
                    .attr('y2', 0)
                    .attr('stroke', st.bars.bar.nail.color)
                    .attr('stroke-width', '2');

            });

        if (prevGroup) {
            self._f.append('line')
                .attr({
                    x1: 0,
                    x2: self.w,
                    y1: self.h - _opts.groups.height - 3,
                    y2: self.h - _opts.groups.height - 3
                }).style({
                    stroke: _opts.groups.separator.color,
                    'stroke-width': _opts.groups.separator.width,
                    'stroke-dasharray': '4,4',
                    'box-shadow': '0 0 2px 2px #fff'
                });

        }

    }

    function animateChanges(callback) {

        var st = _opts.layout;
        var workingAreaHeight = self.h - st.bars.title.height - st.bars.legend.height;
        
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
                    .ease('exp-out')
                    .duration(500)
                    .delay(i * 10)
                    .attr('transform', String.format('translate({0},{1})', 0, 0));
                
                var bar = g0.selectAll('.f-value-bar');

//                for (var j = 0; j < bars[0].length; j++) {
//                    var bar = d3.select(bars[0][j]);
                    var value = parseFloat(bar.attr('data-value'));
                    var p = self.yScale(value);

                    var text = bar.selectAll('text');
                    text.transition()
                        .remove();
                    text.transition()
                        .ease('cubic-out')
                        .duration(500)
                        .delay(100 + i * 25)
                        .style({opacity: 1});


                    var core = bar.selectAll('.f-value-bar-core');
                    var dx = d3.transform(core.attr('transform')).translate[0];

                    core.transition()
                        .remove();
                    core.transition()
                        .ease('exp-out')
                        .duration(500)
                        .delay(i * 15)
                        .attr('transform', String.format('translate({0},{1})', dx, -p));

                    var lineH = bar.selectAll('.f-value-bar-line-h');
                    lineH.transition()
                        .remove();
                    lineH.transition()
                        .ease('cubic-out')
                        .duration(500)
                        .delay(i * 15)
                        .style({ opacity: 1 });

                    var line = bar.selectAll('.f-value-bar-line');

                    line.transition()
                        .remove();
                    line.transition()
                        .ease('exp-out')
                        .duration(500)
                        .delay(i * 15)
                        .attr('y2', p);
//                }
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