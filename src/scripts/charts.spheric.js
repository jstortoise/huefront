function chartSpheric(settings) {

    var self = this;
    self.name = 'spheric';

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
                        markers: {
                            radius: 3
                        }
                },
                axis: {},
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
        self._b = self._layout.insert('g', ':first-child');

        var x = self.w / 2;
        if (self.h / 2 < x) {
            x = self.h / 2;
        }

        self._b.append('circle')
            .attr('r', x / 10)
            .attr('transform', self.formatTranslate(x, x))
            .style({ /*stroke: '#ddd', 'stroke-dasharray': '2,3',*/ fill: '#000' });

        self._b.append('circle')
            .attr('r', x - 1)
            .attr('transform', self.formatTranslate(x, x))
            .style({ stroke: '#d1d1d1', 'stroke-width': 2, 'stroke-dasharray': '3,1', fill: 'none' });

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

    function threeDigitsToSix(color) {
        return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }

    function hexToRgb(color) {
        var red = base16ToBase10(color.substring(1, 3));
        var green = base16ToBase10(color.substring(3, 5));
        var blue = base16ToBase10(color.substring(5, 7));

        return 'rgb(' + red + ',' + green + ',' + blue + ')';
    }

    function rgbToHex(color) {
        var temp_color = color.replace("rgb(", "");
        temp_color = temp_color.replace(")", "");
        temp_color = temp_color.split(',');

        var red = base10ToBase16(temp_color[0]);
        var green = base10ToBase16(temp_color[1]);
        var blue = base10ToBase16(temp_color[2]);

        return '#' + red + green + blue;
    }

    function rgbaToRgb(color) {
        var temp_color = color.replace("rgba(", "");
        temp_color = temp_color.replace(")", "");
        temp_color = temp_color.split(',');

        return 'rgb(' + temp_color[0] + ',' + temp_color[1] + ',' + temp_color[2] + ')';
    }

    function base16ToBase10(base16) {
        return parseInt(base16, 16);
    }

    function base10ToBase16(base10) {
        var base16 = parseFloat(base10).toString(16);

        // If the hexadecimal number is only 1 character long, add 0 to the front.
        if (base16.length == 1) {
            base16 = '0' + base16;
        }

        return base16;
    }

    function namedToHex(named) {
        for (x = 0; x < colorNames.length; x++) {
            if (named.toLowerCase() === colorNames[x][0].toLowerCase()) {
                return colorNames[x][1];
            }
        }
    }

    function separateRgbValues(color) {
        var temp_color = color.rgb.replace("rgb(", "");
        temp_color = temp_color.replace(")", "");
        temp_color = temp_color.split(',');

        color.red = temp_color[0];
        color.green = temp_color[1];
        color.blue = temp_color[2];
    }

    function separateHslValues(color) {
        var temp_color = color.hsl.replace("hsl(", "");
        temp_color = temp_color.replace(")", "");
        temp_color = temp_color.split(',');

        color.hue = temp_color[0];
        color.sat = temp_color[1];
        color.light = temp_color[2];
    }

    function rgbToHsl(rgb) {
        var channels = rgb.replace("rgb(", "");
        channels = channels.replace(")", "");
        channels = channels.split(',');

        var red = channels[0] /= 255;
        var green = channels[1] /= 255;
        var blue = channels[2] /= 255;

        /* Getting the Max and Min values. */
        var max = Math.max.apply(Math, [red, green, blue]);
        var min = Math.min.apply(Math, [red, green, blue]);

        var lightness = (min + max) / 2;

        if (min === max) {
            var saturation = 0;
            var hue = 0;
        } else {
            if (lightness < 0.5) {
                var saturation = (max - min) / (max + min);
            } else {
                var saturation = (max - min) / (2 - max - min);
            }

            if (red == max) {
                var temp_hue = (green - blue) / (max - min);
            } else if (green == max) {
                var temp_hue = 2 + (blue - red) / (max - min);
            } else if (blue == max) {
                var temp_hue = 4 + (red - green) / (max - min);
            }

            var hue = temp_hue * 42.6;

            if (hue < 0) {
                hue += 255;
            }
        }

        saturation *= 100;
        lightness *= 100;

        return 'hsl(' + hue + ',' + saturation + ',' + lightness + ')';
    }

    function bindData() {

            var st = _opts.layout;

            var center = self.w / 2;
            if (center > self.h / 2) {
                center = self.h / 2;
            }

            var charts = self._c.selectAll('g').data(self.data)
            .enter().append('g')
            .each(function(d, i) {

                var g0 = d3.select(this);


                var color = { original: d.color };

                if (/(rgb)\(\d{1,3}%?(,\s?\d{1,3}%?){2}\)/.test(color.original)) {
                    color.originalFormat = 'rgb';

                    color.rgb = color.original;

                    color.hex = rgbToHex(color.original).toUpperCase();

//                    colors.hsv = rgbToHsv(color.rgb);
                    if (/#(?:[0-9a-fA-F]{3})/.test(color.hex)) {
                        color.hex = threeDigitsToSix(color.hex).toUpperCase();
                    }
                } else {
                    color.originalFormat = 'hexadecimal';
                    color.hex = color.original.toUpperCase();
                    color.rgb = hexToRgb(color.original);
                }

                separateRgbValues(color);

                color.hsl = rgbToHsl(color.rgb);

                separateHslValues(color);



                // Calculate rotation of hue.
                var rot = color.hue * 360 / 255;
                // Convert from degrees to radians.
                rot *= 3.141592653589793 / 180;


                // Use simple trig to plot colors.
                var x = center + Math.sin(rot) * color.sat * center * 9 / 1000;
                var y = center + Math.cos(rot) * color.sat * center * 9 / 1000;







                g0.attr('data-eltype', 'bars')
                    .attr('transform', self.formatTranslate(x, y));

                g0.append('circle')
                        .attr('r', st.markers.radius)
                .style({ fill: color.original });


                    return;
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

                dy += st.bars.bar.height;

                // the dot/separator
                g0.append('circle')
                    .attr('r', 3)
                    .attr('cy', dy + st.bars.separator.height / 2)
                    .attr('cx', st.bars.bar.width / 2)
                    .style({ fill: d.color });
                dy += st.bars.separator.height;

                // value 2
                g0.append('text')
                    .attr('text-anchor', 'middle')
//                    .attr('w', st.bars.value2.width)
                    .attr('dominant-baseline', 'central')
                    .attr('transform', self.formatTranslate(st.bars.bar.width / 2, dy + st.bars.value2.height / 2))
                    .style({'font-size': '.8em'})
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