var _colors = [
    {
        color: '#e30614',
        title: 'red',
        group: 'chr'
    },
    {
        color: '#ef7b00',
        title: 'orange',
        group: 'chr'
    },
    {
        color: '#ffed00',
        title: 'yellow',
        group: 'chr'
    },
    {
        color: '#d5d900',
        title: 'yellow-green',
        group: 'chr'
    },
    {
        color: '#009640',
        title: 'green',
        group: 'chr'
    },
    {
        color: '#00b6eb',
        title: 'cyan',
        group: 'chr'
    },
    {
        color: '#499dd7',
        title: 'blue',
        group: 'chr'
    },
    {
        color: '#e6017e',
        title: 'magenta',
        group: 'chr'
    },
    {
        color: '#bf4e97',
        title: 'violet',
        group: 'chr'
    },
    {
        color: '#d9ba84',
        title: 'beige',
        group: 'chr'
    },
    {
        color: '#965e58',
        title: 'brown',
        group: 'chr'
    },
    {
        color: '#aaaaa9',
        title: 'gray',
        group: 'achr'
    },
    {
        color: '#ffffff',
        title: 'white',
        group: 'achr'
    },
    {
        color: '#1d1d1b',
        title: 'black',
        group: 'achr'
    }
];
function __showExtendedInfo(title, dataPrepared, options, width, height) {
    var ext = $('body').find('.__extended-chart');
    if (ext.length === 0) {
        ext = $('<div class="__extended-chart"><span class="close-button"></span><h5></h5>' +
            '<div class="__chart"></div>' +
            '<div class="_footer"><img src="/assets/logo.png"/><span class="print-button"></span></div>' +
            '</div>');
        $('body').append(ext);
    }

    ext.find('h5').text(title);
    var container = ext.find('.__chart');

    var _w = ext[0].offsetWidth;
    if (_w > 1250) {
        _w = 1250;
    }
    var _h = Math.round(_w * height / width);
    if (_h > _w / 2 * 1.25) {
        _h = _w / 2 * 1.25;
    }
    _w = 740, _h = 465;
    container.css('width', _w + 'px');
    container.css('height', _h + 'px');
    ext.find('.close-button').click(function() {
        ext.remove();
    });
    ext.find('.print-button').click(function() {
        window.print();
    });

    var _r = _w / 4 / 2;
    var prop = _w / 54;
    options.bars.radius = _r;
    options.bars.radiusOuter = 4 / 54 * _r;
    options.bars.radiusInner = 16 / 54 * _r;
    options.tooltip = (options.tooltip || {});
    options.tooltip.className = 'extended';

    ch = new chartBoxDonut({
        data: dataPrepared,
        container: container[0],
        options: options
    });
}

var _regions = {};
function getRegionDataColors() {
    var result = [];
    for (var i = 0; i < _colors.length; i++) {
        var value = Math.round(Math.random() * 100);
        result.push({
            value: value,
            valueTitle: Math.round(value) + '%',
            value2: Math.round(Math.random() * 1000),
            valueTitle2: Math.round(Math.random() * 1000),
            title: _colors[i].title,
            color: _colors[i].color
        });
    }
    return result;
}
function getRegionData(regionName) {
    var region = regionName ? _regions[regionName] : null;
    if (!region) {
        region = getRegionDataColors();

        if (regionName) {
            _regions[regionName] = region;
        }
    }
    return region;
}

var names = [['Sasha', 'Walt', 'Kendal', 'Liam', 'Bertram'],['Maverick', 'Carey', 'Constant', 'Dene']];
function __initializeChartCustom(data, container, chartType, chartOptions) {
    if (chartType === 'for-designer-listed-lines') {
        var columnsCount = 3;
        var rowsCount = 17;
        var colorsCount = 4;
        var prevSectionRows = 0;
        var nTitle = "a".charCodeAt(0);;
        for (var i = 0; i < columnsCount; i++) {
            var column = $('<div></div>');
            $(container).append(column);

            for (var j = 0; j < rowsCount; j++) {

                var isTitle = i === 0 && j === 0 || Math.random() > .8 && j < rowsCount - 2 && prevSectionRows > 0;
                var row = $('<div></div>');
                column.append(row);

                var lbl = $('<label></label>');
                row.append(lbl);

                if (isTitle) {
                    row.toggleClass('title', true);
                    lbl.text(String.fromCharCode(nTitle));
                    nTitle++;
                    j++;
                    prevSectionRows = 0;

                    var lbl2 = $('<label></label>');
                    row.append(lbl2);
                    continue;
                }

                prevSectionRows++;

                lbl.text(names[0][Math.round(Math.random() * names[0].length - .5)] + ' ' + names[1][Math.round(Math.random() * names[1].length - .5)]);
                for (var k = 0; k < colorsCount; k++) {
                    var colCont = $('<div></div>');
                    row.append(colCont);
                    var col = $('<span></span>');
                    colCont.append(col);
                    var color = _colors[Math.round(Math.random() * _colors.length - .5)].color;
                    col.css('background', color);
                    if (color === '#ffffff') {
                        col.css('box-shadow', '0 0 0 2px #ccc');
                    }
                    (function(c) {
                        window.setTimeout(function() {
                            c.toggleClass('show', true);
                        }, Math.random() * 350);
                    })(col);
                }
            }
        }
    }
}

function __initializeChart(data, container, chartType, chartOptions) {

    var dataPrepared = prepareDataByChartType(data, chartType, chartOptions);
    var options = getOptionsByChartType(chartType);

    var ch = null;

    if (chartType === 'kidnap-duration' || chartType === 'attack-results' || chartType === 'chart-compare') {
        ch = new chartBox({
            data: dataPrepared,
            container: container,
            options: options
        });
        
    } else if (chartType === 'for-designer-city-bagel' || chartType === 'for-designer-bagel' || chartType === 'victim-numbers' || chartType === 'victim-outcome' || chartType === 'victim-nationality' || chartType === 'victim-sector'
        || chartType === 'attack-type' || chartType === 'target-location') {

        var dataExtended = null;
        if (dataPrepared.length > 4) {

            dataExtended = _.sortBy(dataPrepared, function (it) { return -it.value; });

            dataPrepared = [];
            for (var j = 0; j < 3; j++) {
                dataPrepared.push(dataExtended[j]);
            }

            var otherItem = {
                title: 'Other',
                value: 0,
                color: dataExtended[3].color
            };
            for (var j = 3; j < dataExtended.length; j++) {
                otherItem.value += dataExtended[j].value;
            }
            dataPrepared.push(otherItem);
        }

        ch = new chartBoxBagel({
            data: dataPrepared,
            container: container,
            options: options
        });

        if (dataExtended) {
            var showMore = $('<span class="expand-command"></span>');
            $(container).parent().find('h5').append(showMore);

            var width = container.offsetWidth;
            var height = container.offsetHeight || 250;

            showMore.click(function() {
                __showExtendedInfo($(this).parent().parent().find('h5').text(), dataExtended, JSON.parse(JSON.stringify(options)), width, height);
            });
        }
        
    } else if (chartType === 'trends-year' || chartType === 'trends-all-years') {
        ch = new chartBoxLinear2({
            data: dataPrepared,
            container: container,
            options: options
        });
        
    } else if (chartType === 'bubbled-lines' || chartType === 'bubbled-lines-2') {
        if (chartOptions && chartOptions.version === 'v2') {
            options.layout = {
                padding: {
                    left: 10,
                    right: 10,
                    top: 75,
                    bottom: 0
                }
                // groups.height
            }
        }
        ch = new chartBubbledLines({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else if (chartType === 'linear-h') {
        ch = new chartBoxLinearHorizontal({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else if (chartType === 'levels') {
        ch = new chartLevelsVertical({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else if (chartType === 'dots' || chartType === 'dots-4') {
        ch = new chartDotsHorizontal({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else if (chartType === 'five-year-color') {
        ch = new chartGraphLinearHorizontal({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else if (chartType === 'bricks-random') {
        if (dataPrepared._isRandom) {
            options.layout = { sections: {
                horizontal: 1,
                vertical: 1
            }};
            options.data = options.data || {};
            options.data.isOrdered = Math.random() > .5;
        }
        ch = new chartBricks({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else if (chartType.indexOf('season-') === 0) {
        ch = new chartSpheric({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else if (chartType === 'for-designer-v') {
        ch = new chartBoxLinearVertical({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else if (chartType === 'by-region-linear-bar') {
        ch = new chartBoxLinearBarVertical({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else if (chartType === 'by-category' || chartType === 'of-rtw') {
        ch = new chartNailsLinearVertical({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else if (chartType === 'of-rtw-ss17') {
        ch = new chartNailsLinearVerticalSimple({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else if (chartType === 'region-na' || chartType === 'region-sa' || chartType === 'region-eu' || chartType === 'region-as'
        || chartType.indexOf('by-region-area-') === 0) {
        ch = new chartComplexRegion({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else if (chartType === 'region-na-h' || chartType === 'region-sa-h' || chartType === 'region-eu-h' || chartType === 'region-as-h') {
        ch = new chartBoxLinearHorizontal({
            data: dataPrepared,
            container: container,
            options: options
        });
    } else {
        ch = new chartBoxLinear({
            data: dataPrepared,
            container: container,
            options: options
        });
        
    }


    return ch;

    function copyWithRemove(arr, index) {
        var result = [];
        _.each(arr, function(el, i) {
            if (i !== index) {
                result.push(el);
            }
        });
        return result;
    }

    function generateCityData() {
        var left = 1;
        var d = [];
        for (var ii = 0; ii < 4; ii++) {
            var v = Math.random() * left;
            if (ii < 3 && v > .5) {
                v = Math.random() * .5;
            }
            if (ii === 3) {
                v = left;
            } else {
                   left -= v;
         
            }
            var color;
            do {
                color = _colors[Math.round(Math.random() * 13)].color;
            }
            while (color === '#ffffff' || _.any(d, function (c) { return c.color === color; }))
            d.push({
                value: v,
                title: Math.round(v * 100) + '%',
                color: color
            });
        }
        return _.sortBy(d, 'value').reverse();
    }

    function prepareDataByChartType(data, chartType, chartOptions) {

        var result = data;

        if (chartType === 'bubbled-lines') {
            result = {
                data: [],
                groups: [{ title: '65% CHROMATIC COLORS', name: 'chr' },
                    { title: '35% ACHROMATIC COLORS', name: 'achr' }]
            };
            for (var i = 0; i < _colors.length; i++) {
                var v = Math.random();
                result.data.push({
                    value: v * 100,
                    valueTitle: Math.round(v * 100) + '%',
                    valueTitle2: Math.round(Math.random() * 1000),
                    title: _colors[i].title,
                    color: _colors[i].color,
                    group: _colors[i].group
                });
            }
        }else if (chartType === 'bubbled-lines-2') {
            var isVersion2 = chartOptions && chartOptions.version === 'v2';
            result = {
                data: [],
                groups: [
                    { title: 'Asia', name: 'as' },
                    { title: 'Europe', name: 'eu' },
                    { title: 'North America', name: 'na' },
                    { title: 'Latin America', name: 'sa' }
                ]
//                groups: [{ title: '65% CHROMATIC COLORS', name: 'chr' },
//                    { title: '35% ACHROMATIC COLORS', name: 'achr' }]
            };
            var theColor = _colors[Math.round(Math.random() * 14)];

            var cities = [
                { title: 'Seoul', group: 'as' },
                { title: 'Tokyo', group: 'as' },
                { title: 'London', group: 'eu' },
                { title: 'Paris', group: 'eu' },
                { title: 'Milan', group: 'eu' },
                { title: 'New York', group: 'na' },
                { title: 'Mexico City', group: 'sa' },
                { title: 'Rio de Janeiro', group: 'sa' },
                { title: 'Sao Paolo', group: 'sa' }
            ];
            for (var i = 0; i < cities.length; i++) {
                var theCity = cities[i];
                var v = Math.random();
                result.data.push({
                    value: v * 100,
                    valueTitle: Math.round(v * 100) + '%',
                    valueTitle2: Math.round(Math.random() * 1000),
                    title: theCity.title,// _colors[i].title,
                    color: theColor.color,
                    group: theCity.group
                });
            }
        } else if (chartType === 'by-category') {
            result = {
                data: [],
                groups: [{ title: '65% CHROMATIC COLORS', name: 'chr' },
                    { title: '35% ACHROMATIC COLORS', name: 'achr' }]
            };
            for (var i = 0; i < _colors.length; i++) {
                var d = [];
                for (var k = 0; k < 3; k++) {
                    var v = Math.random();
                    d.push({
                        title: Math.round(v * 100) + '%',
                        value: v
                    });
                }
                
                result.data.push({
                    title: _colors[i].title,
                    color: _colors[i].color,
                    group: _colors[i].group,
                    value: Math.round(Math.random() * 1000),
                    data: d
                });

            }
            result.periods = [
                {
                    title: 'Culture'
                },
                {
                    title: 'Menswear'
                },
                {
                    title: 'RTW'
                }
            ];
        } else if (chartType === 'of-rtw') {
            result = {
                data: [],
                groups: [{ title: '65% CHROMATIC COLORS', name: 'chr' },
                    { title: '35% ACHROMATIC COLORS', name: 'achr' }]
            };
            for (var i = 0; i < _colors.length; i++) {
                var d = [];
                for (var k = 0; k < 3; k++) {
                    var v = Math.random();
                    d.push({
                        title: Math.round(v * 100) + '%',
                        value: v
                    });
                }
                
                result.data.push({
                    title: _colors[i].title,
                    color: _colors[i].color,
                    group: _colors[i].group,
                    value: Math.round(Math.random() * 1000),
                    data: d
                });

            }
            result.periods = [
                {
                    title: 'RTW\n2017'
                },
                {
                    title: 'RTW\n2016'
                },
                {
                    title: 'RTW\n2015'
                }
            ];
        } else if (chartType === 'of-rtw-ss17') {
            result = {
                data: [],
                groups: [{ title: '65% CHROMATIC COLORS', name: 'chr' },
                    { title: '35% ACHROMATIC COLORS', name: 'achr' }]
            };
            var d = [];
            for (var i = 0; i < _colors.length; i++) {

                var v = Math.random();
                d.push({
                    title: _colors[i].title,
                    value: v,
                    valueTitle: Math.round(v * 100) + '%',
                    valueTitle2: '1233',
                    color: _colors[i].color,
                    group: _colors[i].group
                });


            }
                result.data = d;
        } else if (chartType === 'levels' || chartType === 'linear-h' || chartType === 'linear-v' || chartType === 'for-designer-v') {
            result = getRegionData();
        } else if (chartType === 'dots') {
            result = getRegionData();
        } else if (chartType === 'dots-4') {
            result = getRegionData();
            while (result.length > 4) {
                result.splice(Math.round(Math.random() * result.length - 1), 1);
            }
        } else if (chartType === 'five-year-color') {
            result = {
                periods: [],
                data: []
            };

            var periodsCount = 5;
            for (var m = 0; m < periodsCount; m++) {
                result.periods.push({
                    title: 2017 - (5 - m)
                });
            }

            var barsCount = 11;
            var pointsValues = [];
            for (var q = 0; q < periodsCount; q++) {
                var points = [];
                pointsValues.push(points);
                for (var p = 0; p < barsCount; p++) {
                    if (Math.random() > .5) {
                        points.push(p);
                    } else {
                        points.splice(0, 0, p);
                    }
                }
            }

            for (var o = 0; o < barsCount; o++) {
                var color = _colors[o];
                var points = [];

                for (var m = 0; m < periodsCount; m++) {
                    points.push({ value: pointsValues[m][o] });
                }

                result.data.push({
                    title: o + 1,
                    points: points,
                    color: color.color
                });
            }
        } else if (chartType === 'bricks-random') {
            var colors = [];
            var n = Math.round(Math.random() * 4 - .5);
            var maxR = n !== 1 ? 255 : Math.round(Math.random() * 255 - .5);
            var maxG = n !== 2 ? 255 : Math.round(Math.random() * 255 - .5);
            var maxB = n !== 3 ? 255 : Math.round(Math.random() * 255 - .5);
            var count = Math.random() * 1000 + 100;
            for (var l = 0; l < count; l++) {
                var color = String.format('rgb({0},{1},{2})', Math.round(Math.random() * maxR - .5), Math.round(Math.random() * maxG - .5), Math.round(Math.random() * maxB - .5));
                colors.push({
                    color: color,
                    title: color
                });
            }
            var isRandom = Math.random() > .5;
            result = { groups: isRandom ? [_colors[12]] : _colors, colors: colors, _isRandom: isRandom };
        } else if (chartType.indexOf('season-') === 0) {
            result = [];
            var n = Math.round(Math.random() * 4 - .5);
            var maxR = n !== 1 ? 255 : Math.round(Math.random() * 255 - .5);
            var maxG = n !== 2 ? 255 : Math.round(Math.random() * 255 - .5);
            var maxB = n !== 3 ? 255 : Math.round(Math.random() * 255 - .5);
            var count = Math.random() * 1000 + 100;
            for (var l = 0; l < count; l++) {
                var color = String.format('rgb({0},{1},{2})', Math.round(Math.random() * maxR), Math.round(Math.random() * maxG), Math.round(Math.random() * maxB));
                result.push({
                    color: color,
                    title: color
                });
            }
        } else if (chartType === 'by-region-linear-bar') {
            result = [];

            var left = 1;
            var d = [];
            for (var ii = 0; ii < 4; ii++) {
                var v = Math.random() * left;
                if (ii < 3 && v > .5) {
                    v = Math.random() * .5;
                }
                if (ii === 3) {
                    v = left;
                } else {
                    left -= v;
                }
                var color;
                do {
                    color = _colors[Math.round(Math.random() * 13)].color;
                }
                while (color === '#ffffff' || _.any(d, function (c) { return c.color === color; }))
                d.push({
                    value: v,
                    title: Math.round(v * 100) + '%',
                    color: color
                });
            }
            result = _.sortBy(d, 'value').reverse();
        } else if (chartType === 'region-na-h') {
            result = getRegionData('na');
        } else if (chartType === 'region-sa-h') {
            result = getRegionData('sa');
        } else if (chartType === 'region-eu-h') {
            result = getRegionData('eu');
        } else if (chartType === 'region-as-h') {
            result = getRegionData('ai');
        }else if (chartType === 'region-na') {
            result = getRegionData('na-ny');
            
            result = {
                region: {
                    name: 'namerica',
                    cities: {
                        title: 'Top 4 colors',
                        settings: {},
                        data: [
                            {
                                name: 'ny',
//                                title: '',
                                data: []
                            }
                        ]
                    }
                },
                charts: {
                    settings: {},
                    data: result
                }
            };

            var left = 1;
            var d = [];
            for (var ii = 0; ii < 4; ii++) {
                var v = Math.random() * left;
                if (ii < 3 && v > .5) {
                    v = Math.random() * .5;
                }
                if (ii === 3) {
                    v = left;
                } else {
                    left -= v;
                }
                var color;
                do {
                    color = _colors[Math.round(Math.random() * 13)].color;
                }
                while (color === '#ffffff' || _.any(d, function (c) { return c.color === color; }))
                d.push({
                    value: v,
                    title: Math.round(v * 100) + '%',
                    color: color
                });
            }
            result.region.cities.data[0].data = _.sortBy(d, 'value').reverse();
            result.region.cities.settings = {
                bars: {
                    radius: 62,
                    radiusInner: 46
                }
            };
        }else if (chartType === 'region-sa') {
            result = getRegionData('sa');
            
            result = {
                region: {
                    name: 'samerica',
                    cities: {
                        title: 'Top 4 colors',
                        settings: {},
                        data: [
                            
                            {
                                name: 'sao',
//                                title: '',
                                data: []
                            },
                            {
                                name: 'rio',
//                                title: '',
                                data: []
                            },
                            {
                                name: 'mex',
//                                title: '',
                                data: []
                            }
                        ]
                    }
                },
                charts: {
                    settings: {},
                    data: result
                }
            };

            result.region.cities.data[0].data = _.sortBy(generateCityData(), 'value').reverse();
            result.region.cities.data[1].data = _.sortBy(generateCityData(), 'value').reverse();
            result.region.cities.data[2].data = _.sortBy(generateCityData(), 'value').reverse();
            result.region.cities.settings = {
                bars: {
                    radius: 62,
                    radiusInner: 46
                }
            };
        } else if (chartType.indexOf('by-region-area-') === 0) {
            var regionType = chartType.substr(chartType.length - 2);
            result = {
                region: {
                    name: regionType === 'eu' ? 'europe' : regionType === 'as' ? 'asia' : regionType === 'na' ? 'namerica' : 'samerica',
                    cities: {
                        settings: {}
                    }
                },
                charts: {
                    settings: {},
                    data: result
                }
            };

        } else if (chartType === 'region-eu') {
            result = getRegionData('eu');
            
            result = {
                region: {
                    name: 'europe',
                    cities: {
                        title: 'Top 4 colors',
                        settings: {},
                        data: [
                            {
                                name: 'par',
//                                title: '',
                                data: []
                            },
                            
                            {
                                name: 'lon',
//                                title: '',
                                data: []
                            },
                            {
                                name: 'mil',
//                                title: '',
                                data: []
                            }
                        ]
                    }
                },
                charts: {
                    settings: {},
                    data: result
                }
            };

            result.region.cities.data[0].data = _.sortBy(generateCityData(), 'value').reverse();
            result.region.cities.data[1].data = _.sortBy(generateCityData(), 'value').reverse();
            result.region.cities.data[2].data = _.sortBy(generateCityData(), 'value').reverse();
            result.region.cities.settings = {
                bars: {
                    radius: 62,
                    radiusInner: 46
                }
            };
        } else if (chartType === 'region-as') {
            result = getRegionData('as');
            
            result = {
                region: {
                    name: 'asia',
                    cities: {
                        title: 'Top 4 colors',
                        settings: {},
                        data: [
                            
                            {
                                name: 'seo',
//                                title: '',
                                data: []
                            },
                            {
                                name: 'tok',
//                                title: '',
                                data: []
                            }
                        ]
                    }
                },
                charts: {
                    settings: {},
                    data: result
                }
            };

            result.region.cities.data[0].data = _.sortBy(generateCityData(), 'value').reverse();
            result.region.cities.data[1].data = _.sortBy(generateCityData(), 'value').reverse();
            result.region.cities.settings = {
                bars: {
                    radius: 62,
                    radiusInner: 46
                }
            };
        } else if (chartType === 'for-designer-bagel' || chartType === 'for-designer-city-bagel') {
            result = [];
            var wholePercentage = 1;
            for (var i = 0; i < 4; i++) {
                var percentage = Math.random() * wholePercentage;
                wholePercentage -= percentage;

                var c;
                do {
                    c = _colors[Math.round(Math.random() * 13)];
                }
                while (c.color === '#ffffff_' || _.any(result, function (c0) { return c0.color === c.color; }))

                result.push({
                    value: i === 3 ? wholePercentage : percentage,
                    title: c.title,
                    color: c.color
                });
                result = _.sortBy(result, 'value').reverse();
            }
        } else if (chartType === 'annual-by-age-gender') {
            var data1 = copyWithRemove(data.data, 0);
            result = [];

            _.each(data1[0].data, function(d, index) {
                var it = { title: d[0], value: [d[1], data1[1].data[index][1]], titles: ['Male', 'Female'] };
                result.push(it);
            });
        } else if (chartType === 'victim-numbers' || chartType === 'victim-outcome' || chartType === 'victim-nationality') {
            var data1 = copyWithRemove(data.data, 0);
            result = _.map(data1, function(d, index) {
                var it = { title: d[0], value: d[1], color: d[2] };
                return it;
            });
        } else if (chartType === 'attack-type' || chartType === 'target-location') {
            var data1 = copyWithRemove(data.data, 0);
            result = _.map(data1[0], function(d, index, obj) {
                var it = { title: d[0], value: d[1], color: chartOptions.colors[index] };
                return it;
            });
        } else if (chartType === 'victim-sector') {
            var data1 = copyWithRemove(data.data, 0);
            result = _.map(data1[0], function(d, key, obj) {
                var it = { title: key, value: d, color: '' };
                return it;
            });
            _.each(result, function(el, index) {
                el.color = chartOptions.colors[index];
            });
        } else if(chartType === 'other-report') {
            result = _.map(copyWithRemove(data.data, 0), function (el) {
                var value = el[1];
                var col1 = '#c03229';
                var maxValue = 5;
                var v = value / maxValue * 100;
                if (v <= 20) {
                    col1 = '#bcd6e3';
                } else if (v <= 40) {
                    col1 = '#a6a6a6';
                } else if (v <= 60) {
                    col1 = '#ee8879';
                } else if (v <= 80) {
                    col1 = '#e64533';
                }

                return { title: el[0], value: value, color: col1 };
            });
        } else if(chartType === 'country-summary') {
            result = _.map(copyWithRemove(data.data, 0), function (el) {

                var icon = '<path fill="#949393" d="M8,7.6c0.7-1.3,1.8-2.4,3.1-3.1l-0.7-0.7c-0.2-0.2-0.5-0.2-0.7,0L7.4,6.2c-0.2,0.2-0.2,0.5,0,0.7L8,7.6z M8,7.6"/>';
                switch (el[2].toLowerCase()) {
                    case 'srcc': icon = '<path fill="#949393" d="M8,7.6c0.7-1.3,1.8-2.4,3.1-3.1l-0.7-0.7c-0.2-0.2-0.5-0.2-0.7,0L7.4,6.2c-0.2,0.2-0.2,0.5,0,0.7L8,7.6z M8,7.6"/>'; break;
                    
                    default:
                }

                return {
                    title: el[0], value: el[1],
                    svgIcon: icon
                };
            });
        } else if (chartType === 'trends-year' || chartType === 'trends-all-years') {
            result = _.map(copyWithRemove(data.data, 0), function (el) {

                var name = el.name.toLowerCase();
                var col1 = '';
                switch (name) {
                    case 'crime': col1 = '#A9D6E7'; break;
                    case 'terrorism': col1 = '#DA3C1E'; break;
                    case 'civil unrest': col1 = '#424141'; break;
                    case 'kidnapping': col1 = '#F0DAD4'; break;
                    case 'extortion': col1 = '#DCDDDE'; break;
                    case 'wrongful detention': col1 = '#942815'; break;
                    case 'evacuation': col1 = '#718BA5'; break;
                }
                return {
                    title: el.name,
                    value: el.data,
                    color: col1
                };
            });
        } else {
            result = _.map(copyWithRemove(data.data, 0), function (el) {
                return { title: el[0], value: el[1] };
            });
        }

        return result;
    }
    function getOptionsByChartType(chartType){

        var options = {};
        if (chartType === 'chart-compare') {
            options = {
                isVertical: false,
                layout: {
                    padding: {
                        top: 33
                    }
                },
                axis: {
                    x: {
                        style: 'solid',
                        width: 2,
                        wholeLength: false,
                        text: {
                            margin: '6',
                            size: '12px',
                            height: 30
                        }
                    },
                    y: {
                        style: 'solid',
                        width: 2,
                        lines: {
                            style: 'dashed',
                            width: 2,
                            count: 6,
                            isFirstHidden: true,
                        },
                        text: {
                            width: 15,
                            margin: '4',
                            align: 'right',
                            size: '12px'
                        },
                        titles: ['0', 15, 30, 45, ' ']
                    }
                },
                bars: {
                    style: 'rounded',
                    color: '#A9D6E7',
                    width: 9,
                    maxValueRangeMultiplier: 1,
                    maxValue: 5
                }
            }

        } else if (chartType === 'kidnap-duration' || chartType === 'attack-results') {
            options = {
                isVertical: false,
                axis: {
                    x: {
                        style: 'solid',
                        width: 2,
                        wholeLength: false,
                        text: {
                            margin: '6',
                            size: '12px',
                            height: '20'
                        }
                    },
                    y: {
                        style: 'solid',
                        width: 2,
                        lines: {
                            style: 'dashed',
                            width: 2,
                            count: 5,
//                            isLastHidden: true,
                        },
                        text: {
                            width: 27,
                            margin: '8',
                            align: 'right',
                            size: '12px'
                        },
                        titles: ['0', 15, 30, 45, ' ']
                    }
                },
                bars: {
                    style: 'rounded',
                    color: '#A9D6E7',
                    width: 9,
                    maxValueRangeMultiplier: 1.45,
                    maxValue: 80
                }
            }

        } else if (chartType === 'trends-year' || chartType === 'trends-all-years') {
            options = {
                isVertical: false,
                layout: {
                    padding: {
                        top: 4
                    }
                },
                axis: {
                    x: {
                        style: 'solid',
                        width: 2,
                        wholeLength: false,
                        text: {
                            margin: '6',
                            size: '12px',
                            height: '20'
                        }
                    },
                    y: {
                        style: 'solid',
                        width: 2,
                        lines: {
                            style: 'dashed',
                            width: 2,
                            count: 5,
                            isLastHidden: true,
                        },
                        text: {
                            width: 30,
                            margin: '8',
                            align: 'right',
                            size: '12px'
                        },
                        titles: ['0', 15, 30, 45, ' ']
                    }
                },
                bars: {
                    style: 'rounded',
                    color: '#A9D6E7',
                    width: 9,
                    maxValueRangeMultiplier: 1,
                    maxValue: 20
                }
            }
        } else if (chartType === 'kidnap-location') {
            options = {
                isVertical: true,
                layout: {
                    padding: {
                        right: 10
                    }
                },
                axis: {
                    x: {
                        style: 'solid',
                        width: 2,
                        wholeLength: true,
                        text: {
                            margin: 6,
                            size: 12,
                            height: 20
                        }
                    },
                    y: {
                        style: 'solid',
                        width: 2,
                        lines: {
                            style: 'dashed',
                            width: 2
                        },
                        text: {
                            width: 87,
                            margin: 11,
                            align: 'right',
                            size: 12
                        },
                        titles: ['0', 15, 30, 45, ' ']
                    }
                },
                bars: {
                    style: 'rounded',
                    color: '#A9D6E7',
                    width: 9,
                    maxValueRangeMultiplier: 1,
                    maxValue: 60
                }
            }

        } else if (chartType === 'monthly-kidnap') {
            options = {
                isVertical: true,
                layout: {
                    padding: {
                        right: 10
                    }
                },
                axis: {
                    x: {
                        style: 'solid',
                        width: 2,
                        wholeLength: true,
                        text: {
                            margin: '6',
                            size: '12px',
                            height: '20'
                        }
                    },
                    y: {
                        style: 'solid',
                        width: 2,
                        lines: {
                            style: 'dashed',
                            width: 2,
                            count: 5
                        },
                        text: {
                            width: 35,
                            margin: '8',
                            align: 'right',
                            size: '12px'
                        },
                        titles: ['0', 12.5, 25, 37.5, ' ']
                    }
                },
                bars: {
                    style: 'rounded',
                    color: '#A9D6E7',
                    width: 9,
                    maxValue: 60,
                    maxValueRangeMultiplier: 1
                }
            }

        } else if (chartType === 'average-demanded-randoms') {
            options = {
                isVertical: false,
                axis: {
                    x: {
                        style: 'solid',
                        width: 2,
                        wholeLength: false,
                        text: {
                            margin: '6',
                            size: '12px',
                            height: '20'
                        }
                    },
                    y: {
                        style: 'solid',
                        width: 2,
                        lines: {
                            style: 'dashed',
                            width: 2,
                            count: 5,
                            isLastHidden: true,
                            renderTitle: function(value) {
                                if (value > 10000000)
                                    return String.format('{0} mln.', Math.round(value / 1000000));
                                else if (value > 1000000)
                                    return String.format('{0} mln.', Math.round(value * 10 / 1000000) / 10);
                                else if (value > 100000)
                                    return String.format('{0} mln.', Math.round(value * 100 / 1000000) / 100);
                                else //if (value > 100000)
                                    return String.format('{0}', value);
                            }
                        },
                        text: {
                            width: 50,
                            margin: 8,
                            align: 'right',
                            size: '12px'
                        },
                        titles: [' ', 500, 1000, 1500, 2000, ' ']
                    }
                },
                bars: {
                    style: 'rounded',
                    color: '#A9D6E7',
                    width: 9,
                    maxValueRangeMultiplier: 1
                }
            }

        } else if (chartType === 'annual-by-age-gender') {
            options = {
                isVertical: false,
                axis: {
                    x: {
                        style: 'solid',
                        width: 2,
                        wholeLength: false,
                        text: {
                            margin: '6',
                            size: '12px',
                            height: '20'
                        }
                    },
                    y: {
                        style: 'solid',
                        width: 2,
                        lines: {
                            style: 'dashed',
                            width: 2,
                            count: 5
                        },
                        text: {
                            width: 35,
                            margin: '8',
                            align: 'right',
                            size: '12px'
                        },
                        titles: ['0', 25, 50, 75, ' ']
                    }
                },
                bars: {
                    style: 'rounded',
                    color: ['#435B78', '#C9513B'],
                    gapSize: 2,
                    width: 9
                }
            }
        } else if (chartType === 'terror-events-by-month') {
            options = {
                isVertical: true,
                layout: {
                    padding: {
                        right: 10
                    }
                },
                axis: {
                    x: {
                        style: 'solid',
                        width: 2,
                        wholeLength: true,
                        text: {
                            margin: '6',
                            size: '12px',
                            height: '20'
                        }
                    },
                    y: {
                        style: 'solid',
                        width: 2,
                        lines: {
                            style: 'dashed',
                            width: 2,
                            count: 6,
                            isLastHidden: false,
                            isLastLabelHidden: false,
                            isFirstHidden: false,
                            isFirstLabelHidden: false,

                        },
                        text: {
                            width: 30,
                            margin: 8,
                            align: 'right',
                            size: 12
                        },
//                        titles: ['0', 10, 20, 30, 40, '50']
                    }
                },
                bars: {
                    style: 'rounded',
                    color: '#A9D6E7',
                    width: 9,
                    maxValue: 50,
                    maxValueRangeMultiplier: 1
                }
            }
        } else if (chartType === 'recalls-top-categories') {
            options = {
                isVertical: true,
                layout: {
                    padding: {
                        right: 10
                    }
                },
                axis: {
                    x: {
                        style: 'solid',
                        width: 2,
                        wholeLength: false,
                        text: {
                            margin: '6',
                            size: '12px',
                            height: '20'
                        }
                    },
                    y: {
                        style: 'solid',
                        width: 2,
                        lines: {
                            style: 'dashed',
                            width: 2,
                            count: 6,
                            isLastHidden: false,
                            isLastLabelHidden: false,
                            isFirstHidden: false,
                            isFirstLabelHidden: false,

                        },
                        text: {
                            width: 100,
                            margin: 8,
                            align: 'right',
                            size: 12
                        },
//                        titles: ['0', 10, 20, 30, 40, '50']
                    }
                },
                bars: {
                    style: 'rounded',
                    color: '#A9D6E7',
                    width: 9,
                    //maxValue: 50,
                    maxValueRangeMultiplier: 1
                }
            }
        } else if (chartType === 'other-report') {
            options = {
                isVertical: true,
                axis: {
                    x: {
                        style: 'solid',
                        width: 2,
                        wholeLength: true,
                        text: {
                            margin: '6',
                            size: '12px',
                            height: '20'
                        }
                    },
                    y: {
                        style: 'solid',
                        width: 2,
                        lines: {
                            style: 'dashed',
                            width: 2
                        },
                        text: {
                            width: 100,
                            margin: '14',
                            align: 'right',
                            size: '12px'
                        },
                        titles: ['0', 1, 2, 3, 4, 5]
                    }
                },
                tooltip: {
                    type: 'installed',
                },
                bars: {
                    style: 'rounded',
                    color: '#A82F18',
                    width: 16,
                    maxValue: 5
                }
            }
        } else if (chartType === 'country-summary') {
            options = {
                isVertical: true,
                axis: {
                    x: {
                        style: 'solid',
                        width: 2,
                        color: '#b5b5b5',
                        wholeLength: true,
                        text: {
                            margin: '6',
                            size: '12px',
                            height: '20'
                        }
                    },
                    y: {
                        style: 'solid',
                        width: 2,
                        color: '#b5b5b5',
                        lines: {
                            style: 'dashed',
                            width: 2
                        },
                        text: {
                            width: 40,
                            margin: '7',
                            align: 'right',
                            size: '12px'
                        },
                        titles: ['0', 3, 5]
                    }
                },
                tooltip: {
                    type: 'installed',
                    enabled: false
                },
                bars: {
                    style: 'rounded',
                    color: '#939393',
                    width: 15,
                    maxValue: 5
                }
            }
        } else if (chartType === 'for-designer-bagel') {
            options = {
                bars: {
                    radius: 85,
                    radiusOuter: 1,
                    radiusInner: 62,
                    legend:{}
                }
            };
            if (chartOptions.version === 'v2') {
                options.bars = { 
                    radius: 85,
                    radiusOuter: 1,
                    radiusInner: 62,
                    legend: {
                    position: 'left'
                } };
            }
        } else if (chartType === 'for-designer-city-bagel') {
            options = {
                bars: {
                    radius: 130,
                    radiusOuter: 1,
                    radiusInner: 105,
                    legend: {
                        radius: 50,
                        radiusInner: 40,
                        position: 'none'
                    }
                }
            };
        } else if (chartType === 'for-designer-v') {
            options = {
                layout: {
                    bars: {
                        bar: {
                            height: 130,
                            width: 25,
                            margin: {
                                left: 6,
                                right: 6
                            },
                            background: '#e3e3e3'
                        },
                        separator: {
                            height: 24,
                            radius: 4
                        },
                        value: {
                            height: 22
                        },
                        value2: {
                            height: 22
                        }
                    },
                padding: {
                    left: 10,
                    right: 10,
                    top: 0,
                    bottom: 10
                }
                }
            };

        } else if (chartType === 'victim-numbers' || chartType === 'victim-outcome' || chartType === 'victim-nationality' || chartType === 'victim-sector'
            || chartType === 'attack-type' || chartType === 'target-location') {
            options = {
                bars: {
                    radius: 54,
                    radiusOuter: 4,
                    radiusInner: 16,
                }
            };
        } else if (chartType === 'attack-results') {
            options = {
                axis: {
                    y: {
                        titles: [3, 6, 9]
                    }
                }
            }
        } else if (chartType === 'region-na-zzz') {
            options = {
                axis: {
                    y: {
                        titles: [3, 6, 9]
                    }
                }
            }
        }
        return options;
    }
}