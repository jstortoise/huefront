function chartComplexRegion(settings) {

  var self = this;
  self.name = 'complex-region';

  chartBase(self);
  initialize();

  self.settings = settings;
  self.container = settings.container;
  self.data = settings.data;

  var _opts = self.mergeDefaults(settings.options);
  var _charts = null;

  var lib = {
    regions: {
      'namerica': {
        cities: {
          'ny': {
            label: {
              title: 'New York',
              dy: -35,
              dx: -40
            },
            x: 286,
            y: 236
          }
        }
      },
      'samerica': {
        cities: {
          'mex': {
            label: {
              title: 'Mexico City'
            },
            x: 65,
            y: 5
          },
          'sao': {
            label: {
              title: 'Sao Paolo',
              dy: 30,
              dx: -40
            },
            x: 255,
            y: 196
          },
          'rio': {
            label: {
              title: 'Rio de Janerio',
              anchor: 'end',
              dy: -35,
              dx: -45
            },
            x: 281,
            y: 186
          }
        }
      },
      'europe': {
        cities: {
          'milan': {
            label: {
              title: 'Milan',
              dy: 25
            },
            x: 120,
            y: 273
          },
          'paris': {
            label: {
              title: 'Paris',
              dy: -10
            },
            x: 95,
            y: 257
          },
          'london': {
            label: {
              title: 'London',
              dx: -5,
              dy: -40
            },
            x: 75,
            y: 240
          }
        }
      },
      'asia': {
        cities: {
          'seoul': {
            label: {
              title: 'Seoul',
              anchor: 'end'
            },
            x: 215,
            y: 199
          },
          'tokyo': {
            label: {
              title: 'Tokyo'
            },
            x: 240,
            y: 200
          }
        }
      }
    }
  };

  function initialize() {
    self.getDefaults = function () {
      var d = {
        meta: {},
        layout: {},
        axis: {},
        bars: {}
      };

      d.layout.padding = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      };

      //            d.bars.maxValue = 100;
      //            d.bars.maxValueRangeMultiplier = 1.05;

      return d;
    }
  }


  function prepareContainer() {

    self.initializeLayout(_opts);

    self.x = self.w / 2;
    self.y = self.h / 2;

    self._m = {};
    // inserted to the background
    self._m.container = d3.select(self.container)
      .insert('div', ":first-child")
      .style({position: 'relative'})
      .append('div');
//            .style({ position: 'absolute' });
//            .attr('transform', String.format('translate({0},{1})', self.x, self.y));

    var imgWidth = 382.68;
    var smallestSide = self.w > self.h ? self.h : self.w;
    self.proportion = Math.round(smallestSide / imgWidth * 100) / 100 * 1.1;

    self._m.image = self._m.container.append('img');
    $(self._m.image[0][0]).css('transform', String.format('scale({0}, {0})',
      Math.round(self.proportion * 100) / 100))
      .css('transform-origin', 'top left');
//            .attr('src', '/content/charts/namerica.svg');

    // must be exactly over the svg image position
    self._c.attr('transform', 'translate(0, 0)'); //self.x, self.y));
    self._svg.style({position: 'absolute', top: 0});

    // bagels charts on the left
    self._bagels = self._layout.append('g');
    // charts data on the right
    self._charts = self._layout.append('g')
      .attr('transform', self.formatTranslate(self.w - 400, 0));
  }

  function prepareData() {


  }

  function bindData() {

    var regionFileName;
    var region = self.data.region || {};
    switch (region.name) {
      case 'namerica':
        regionFileName = 'namerica';
        break;
      case 'samerica':
        regionFileName = 'samerica';
        break;
      case 'europe':
        regionFileName = 'europe';
        break;
      case 'asia':
        regionFileName = 'asia';
        break;
      default:
    }

    self._m.image.attr('src', regionFileName ? '/content/charts/' + regionFileName + '.svg' : '');
    var noCitiesData = !region.cities || !region.cities.data;

    var imgWidth = 382.68;
    var dShift = (imgWidth - imgWidth * self.proportion) / 2;
    var imgTransformFormat = String.format('scale({0}, {0}){1}',
      Math.round(self.proportion * 100) / 100,
      String.format(' translate({0}px,{1}px)',
        (noCitiesData ? -75 * (self.proportion / 1.5) : 80 * (self.proportion / 1.5)),
        (noCitiesData ? -50 * (self.proportion / 1.5) : -35 * (self.proportion / 1.5))));
    $(self._m.image[0][0]).css('transform', imgTransformFormat);
    $(self._m.image[0][0]).css('transform-origin', 'top left');

    self._layout.style({
      'transform': String.format("scale({0}, {0})",
        self.proportion / 1.5 * 1, 0, 0),
      'transform-origin': 'top left'
    }); // -600 -500

    var cities = region.cities || {};
    if (!cities.data) {
      cities.data = _.map(self.clone(lib.regions[region.name].cities), function (c) {
        c._noConnection = true;
        return c;
      });
    }

    self._c.html('');
    self._bagels.html('');

    var titlesGroup = self._c.append('g')
      .style('font-size', String.format('{0}em', 1.4 / (self.proportion < 1 ? self.proportion : 1)));

    var cb = null;
    for (var j = 0; j < (cities.data || []).length; j++) {
      var city = cities.data[j] || {};

      // bagel options (in case if it's creating)
      var options = cities.settings;
      options.layout = options.layout || {};
      options.layout.width = 250;
      options.layout.height = (self.h - 20) / 3;
      options.bars = options.bars || {};
      options.bars.legend = options.bars.legend || {};
      options.bars.legend.position = 'left';

      cb = {
        // connection binding
        position: {
          x: (noCitiesData ? -50 * (self.proportion / 1.5) : 145 * (self.proportion / 1.5)),
          y: (noCitiesData ? 65 * (self.proportion / 1.5) : 8 * (self.proportion / 1.5))
        },
        scale: {
          x: 1.25,
          y: 1.25
        },
        chart: {
          position: {
            x: 40,
            y: self.h - (options.layout.height + 0) * (j + 1)
          },
          size: {
            width: options.layout.width,
            height: options.layout.height
          },
          point: {
            dx: 190,
            dy: 35
          }
        }
      };

      var cityLib = city._noConnection ? city : ((lib.regions[region.name] || {}).cities || {})[city.name];
      // bagels
      if (cityLib) { // if city found in library
        cb.connection = {
          from: {
            x: cityLib.x * cb.scale.x + cb.position.x + 45,
            y: cityLib.y * cb.scale.y + cb.position.y
          },
          to: {
            x: cb.chart.position.x + cb.chart.point.dx,
            y: cb.chart.position.y + cb.chart.point.dy
          }
        };
        options.bars.legend.title = cityLib.label.title;

        if (city.data && city.data.length) { // if data for city presents
          var cont = self._bagels.append('g')
            .attr('transform', self.formatTranslate(
              cb.chart.position.x,
              cb.chart.position.y));

          var ch = new chartBoxBagel({
            data: city.data,
            container: cont,
            options: options
          });

          var connection = self._c.append('path')
            .attr('d', String.format('M{0},{1} A250,250 0 0 0 {2},{3}',
              cb.connection.from.x,
              cb.connection.from.y,
              cb.connection.to.x,
              cb.connection.to.y))
            .attr('stroke-dasharray', '4.5,4')
            .style({stroke: '#ccc', 'stroke-width': 2, fill: 'none'});
        }

        titlesGroup.append('text')
          .text(cityLib.label.title)
          .attr('transform', self.formatTranslate(cb.connection.from.x
            + (5.75 * 2 + (cityLib.label.dx || 0)) * (cityLib.label.anchor === 'end' ? -1 : 1),
            cb.connection.from.y + (cityLib.label.dy || 0)))
          .attr('text-anchor', cityLib.label.anchor || 'start')
          .attr('dominant-baseline', 'central');

        // show points anyway
        var c = self._c.append('circle')
          .attr('r', 5.75)
          .attr('cx', cb.connection.from.x)
          .attr('cy', cb.connection.from.y)
          .style({fill: '#bc0076'})
          .style({stroke: '#fff'})
          .style({'stroke-width': 2});
      }
    }

    if (cb && cities.title) {
      self._c.append('g')
        .attr('transform', self.formatTranslate(cb.chart.position.x + cb.chart.size.width / 2,
          self.h - cb.chart.size.height * cities.data.length))
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('class', 'legend-header')
        .text(cities.title);
    }
  }

  function animateChanges(callback) {
    var delay = 0;
    self._c.selectAll('g[data-eltype="block"]').data(self.data);
    d3.selectAll(self._c[0][0].childNodes).filter('[data-eltype="block"]')
      .each(function (d, i) {
        if (!d) {
          return;
        }

        var g0 = d3.select(this);

        var g = g0.selectAll('[data-eltype="bar"]');

        var b = g.selectAll('[isvalue="1"]');
        var duration = 1000;
//                var duration = d._data.percent * 1500;
        b.transition()
          .ease('cubic-out')
          .duration(duration)
          .delay(delay)
          .attrTween("d", translateDonut(_opts.bars.radius, _opts.bars.radiusInner))
        //                    .attr('d', getPathByPercentage(d._data.from, d._data.to, _opts.bars.radius, _opts.bars.radiusInner));
        ;
//                delay += duration;
      });

    function translateDonut(r, rIn) {
      return function (obj) {
        return function (t) {
          var dP = obj._data.percent * t;
          var fromPrev = obj._data._prev ? obj._data._prev.to * t : 0;
          return getPathByPercentage(obj._data.from + fromPrev, obj._data.from + fromPrev + dP, r, rIn);
        }
      }
    }
  }

  function checkAndIndicateIfDataEmpty() {

    return;
    var total = 0;
    _.each(self.data, function (d) {
      if (!!d._data)
        total += d._data.percent;
    });

    if (total < 0.01) {
      self._empty.selectAll('*').remove();
      self._empty.append('text')
        .attr('class', 'data-empty')
        .text('No relevant analytics')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle');
    }
    self._empty.style('display', total < 1 ? '' : 'none');
  }

  self.applyValues = function (data) {
    if (data.length === self.data.length) { // animating changes
      self.dataPrev = self.data;
      self.data = data;
      prepareData();
      animateChanges(function () {
        self.dataPrev = null;
      });
    } else {
      self.data = data;
      prepareContainer();
      bindData();
    }
  };

  prepareData();
  prepareContainer();

//    try{
  bindData();
//    } catch (e) { alert(e)}
//    try {
  animateChanges();
//    } catch (e) {

//    }

  checkAndIndicateIfDataEmpty();
}