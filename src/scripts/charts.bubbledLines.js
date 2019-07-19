function chartBubbledLines(settings) {

  var self = this;

  chartBase(self);

  initialize();

  self.name = 'bubbled-lines';

  self.settings = settings;
  var _opts = self.mergeDefaults(settings.options);
  self.container = settings.container;

  self.data = settings.data && settings.data.data ? settings.data.data : settings.data;
  self.dataGroups = settings.data && settings.data.groups ? settings.data.groups : [];

  self.groupsExist = function () {
    return self.dataGroups && self.dataGroups.length;
  };

  function initialize() {
    self.getDefaults = function () {
      var d = {
        layout: {
          mode: 'default' // 'colors'
        },
        bars: {
          width: 80,
          dotRadius: 5.5,
          dotMargin: 1,
          title: {
            height: 60
          },
          margin: {
            top: 0,
            left: 7,
            right: 7,
            bottom: 10
          }
        },
        groups: {
          items: {},
          separator: {
            color: '#c6c6c6',
            width: 2
          },
          height: 40
        }
      };

      d.layout.padding = {
        left: 10,
        right: 10,
        top: 85,
        bottom: 0
      };

      d.bars.maxValue = .001;
      d.bars.maxValueRangeMultiplier = 1.05;

      return d;
    }
  }

  function prepareContainer() {

    self.initializeLayout(_opts);

    self._gr = self._layout.append('g');

    self._c = self._layout.append('g');//.attr('transform', 'translate(' + _opts.axis.y.text.width + ', ' + 0 + ')');
    self._x = self._layout.append('g');

    self._f = self._layout.append('g');

    self.xScale = d3.scale.ordinal()
      .domain(d3.range(0, self.data.length * 1))
      .rangeBands([0, self.w]);
//            .rangeBands([0, !_opts.isVertical ? self.w - _opts.axis.y.text.width : self.h - _opts.axis.x.text.height]);

    var d = [];
    _.each(self.data, function (el) {
      self.isArray(el.value) ? d.push.apply(d, el.value) : d.push(el.value);
    });
    self.maxValue = d3.max(d);
    if (_opts.bars.maxValue && _opts.bars.maxValue > self.maxValue) {
      self.maxValue = _opts.bars.maxValue;
    }

    var yMax = self.maxValue || .001;
    yMax *= _opts.bars.maxValueRangeMultiplier;
    self.maxRangeValue = yMax;
    self.yScale = d3.scale.linear()
      .domain([0, yMax])
      .range([0, self.h
      - (self.groupsExist() ? _opts.groups.height + _opts.bars.title.height : 0)]);
    //.range([0, self.h - _opts.axis.x.text.height]);
  }

  function bindData() {
    var prevGroup = null;
    var groupTitles = self._f.append('g')
      .attr('class', 'group-titles');

    var prevGroupSectionsFrom = 0;
    var prevGroupSectionsTo = 0;

    var tempMaxValue = _.maxBy(self.data, 'percentage') || {percentage: 0.1};
    var stuff = self._c.selectAll('g').data(self.data)
      .enter().append('g')
      .each(function (d, i) {

        var g = d3.select(this)
          .attr('data-eltype', 'bars');

        var h = self.yScale(d.value);

        var dx = self.w / self.data.length;

        var item = g.append('g')
          .attr('transform', String.format('translate({0}, {1})', i * dx, _opts.bars.margin.top));
//                            .attr('y', 0)
//                            .attr('width', dx)// self.w - (_opts.axis.x.wholeLength ? 0 : _opts.axis.y.text.width))
//                            .attr('transform', String.format('translate({0}, {1})', (!_opts.axis.x.wholeLength ? _opts.axis.y.text.width : 0)
//                                , self.h - _opts.axis.x.text.height))
//                            .attr('height', self.h - _opts.axis.x.height)
//                            .style({ fill: '#e9e9e9' });


        var barHeight = self.h - _opts.bars.title.height - (self.groupsExist() ? _opts.groups.height : 0)
          - _opts.bars.margin.top - _opts.bars.margin.bottom;

        // legend (titles within grey boxes) title
        var legend = item.append('g')
          .attr('class', 'chart-titles')
          .attr('transform', self.formatTranslate(0, barHeight
            + _opts.bars.margin.top + _opts.bars.margin.bottom));

        if (i === 0) {
          legend.append('path')
            .attr('d', String.format('M{0},{1} A{0},{0}, 0, 1, 1, {0} 0 L{2} 0 L{2} {1} z',
              _opts.bars.title.height / 2, _opts.bars.title.height, dx))
            .style({fill: '#eee'});
        } else if (i === self.data.length - 1) {
          legend.append('path')
            .attr('d', String.format('M{3},0 A{0},{0}, 0, 1, 1, {3} {1} L0 {1} L0 0 z',
              _opts.bars.title.height / 2, _opts.bars.title.height, dx, dx - _opts.bars.title.height / 2))
            .style({fill: '#eee'});
        } else {
          legend.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', dx)
            .attr('height', _opts.bars.title.height)
            .style('fill', '#eee');
        }

        if (i > 0) {
          legend.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', _opts.bars.title.height)
            .attr('stroke', '#fff')
            .attr('stroke-width', '1');
        }
        var titleGroup = legend.append('g')
          .attr({
            'transform': self.formatTranslate(dx / 2, _opts.bars.title.height / 2)
          });
        var lbl = titleGroup
          .append('text')
          .attr({
            'text-anchor': 'middle',
            'dominant-baseline': 'central'
          })
          .style({"font-family": "Oswald", "text-transform": "uppercase", 'font-size': '10px'})
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
            var lbl2 = titleGroup
              .append('text')
              .text(secondWord)
              .attr('text-anchor', 'middle')
              .attr('dominant-baseline', 'central')
              .attr('class', 'legend-title')
              .attr('transform', self.formatTranslate(0, box.height * 1.00));

            titleGroup
              .attr('transform', self.formatTranslate(dx / 2, _opts.bars.title.height / 2
                - box.height * (1 + .00) / 2));
          }
        }

        // groups separator
        var drawGroupTitle = function () {
          groupTitles.append('text')
            .text(prevGroup ? prevGroup.title : '')
            .attr({
              'text-anchor': 'middle',
              'dominant-baseline': 'central',
              'transform': self.formatTranslate(prevGroupSectionsFrom * dx
                + (prevGroupSectionsTo
                  - (prevGroupSectionsFrom === 0 || i === self.data.length - 1 ? 1 : 2)
                  - prevGroupSectionsFrom) * dx / 2,
                self.h - (self.groupsExist() ? _opts.groups.height / 2 : 0))
            });
        };
        prevGroupSectionsTo++;

        if (!prevGroup && (self.dataGroups || []).length) {
          prevGroup = _.find(self.dataGroups, {name: d.group || ''});
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
            'stroke-dasharray': '4,4',
            'box-shadow': '0 0 2px 2px #fff'
          });

          drawGroupTitle();

          prevGroup = _.find(self.dataGroups, {name: d.group || ''});
          prevGroupSectionsFrom = prevGroupSectionsTo;
        } else if (prevGroup && i === self.data.length - 1) {
          drawGroupTitle();
        }

        // dots values
        var barHeightCalculated = barHeight * (d.percentage || 0) / tempMaxValue.percentage; // self.yScale ...
        var dotOuterHeightHalf = _opts.bars.dotRadius + _opts.bars.dotMargin;
        var dotOuterHeight = dotOuterHeightHalf * 2;
        var dotsAmountVertical = Math.round(barHeightCalculated / dotOuterHeight - .5);
        if (d.value && dotsAmountVertical === 0) {
          dotsAmountVertical = 1;
        }

        var dxm = dx - _opts.bars.margin.left - _opts.bars.margin.right;

        var dotsAmountHorizontal = Math.round(dxm / dotOuterHeight - .5);
        var barHeightActual = dotsAmountVertical * dotOuterHeight;

        var dotHorizontalCenterCorrection = Math.round((dxm - dotOuterHeight * dotsAmountHorizontal) / 2 - .5)
          + _opts.bars.margin.left;

        var dotsContainer = item.append('g')
          .attr('class', 'dots-container')
          .attr('transform', self.formatTranslate(0, barHeight - barHeightActual));

        for (var nY = dotsAmountVertical - 1; nY >= 0; nY--) {
          var dotsLineContainer = dotsContainer.append('g');
          if (_opts.layout.mode == 'colors') {
            var color = d.colors && nY < d.colors.length ? d.colors[nY].color : null;
            if (color) {
              var r = 6;
              var path = String.format('M{0},{1}', dotOuterHeightHalf + 0 * dotOuterHeight + dotHorizontalCenterCorrection,
                -r + dotOuterHeightHalf + nY * dotOuterHeight);
              path += String.format('h{0}', dotsAmountHorizontal * dotOuterHeight - r * 2);
              path += String.format("a{0},{0} 0 0 1 {0},{0}", r);
              path += String.format("a{0},{0} 0 0 1 -{0},{0}", r);
              path += String.format('h{0}', -(dotsAmountHorizontal * dotOuterHeight - r * 2));
              path += String.format("a{0},{0} 0 0 1 -{0},-{0}", r);
              path += String.format("a{0},{0} 0 0 1 {0},-{0}Z", r);

              var rect = dotsLineContainer.append('path')
                .attr('d', path)
                .style('opacity', 0)
                .attr('fill', color);

              if (self.isWhite(color)) {
                rect.attr('stroke', '#ddd');
              }
            }
          } else {
            for (var nX = 0; nX < dotsAmountHorizontal; nX++) {
              var c = dotsLineContainer.append('circle')
                .attr('transform', self.formatTranslate(
                  dotOuterHeightHalf + nX * dotOuterHeight + dotHorizontalCenterCorrection,
                  dotOuterHeightHalf + nY * dotOuterHeight))
                .attr('r', 0)//_opts.bars.dotRadius)
                .attr('fill', d.color);

              if (self.isWhite(d.color)) {
                c.attr('stroke', '#ddd');
              }
            }
          }
        }


        if (_opts.layout.mode != 'colors') {
          // value
          var valueContainer = item.append('g')
            .attr('transform', self.formatTranslate(0, barHeight - barHeightActual));

          var valueContainerIn = valueContainer.append('g')
            .attr('class', 'value-core')
            .attr('transform', self.formatTranslate(dx / 2, self.maxValue * d.value / self.maxValue))
            .style('opacity', 0);

          valueContainerIn.append('text')
            .text(d.valueTitle)
            .attr('class', 'value-title')
            .attr('transform', self.formatTranslate(0, -70))
            .attr({
              'text-anchor': 'middle',
              'dominant-baseline': 'central'
            });

          valueContainerIn.append('text')
            .text(d.valueTitle2)
            .attr('class', 'value-title2')
            .attr('transform', self.formatTranslate(0, -45))
            .attr({
              'text-anchor': 'middle',
              'dominant-baseline': 'central'
            });

          valueContainerIn.append('line')
            .attr('x1', -16)
            .attr('y1', -31)
            .attr('x2', 16)
            .attr('y2', -31)
            .attr('stroke', '#ccc')
            .attr('stroke-width', '2');

          valueContainerIn.append('line')
            .attr('x1', 0)
            .attr('y1', -31)
            .attr('x2', 0)
            .attr('y2', -2)
            .attr('stroke', '#ccc')
            .attr('stroke-width', '2');
        }
      });
  }

  function animateChanges(callback) {

    var barsDelay = 25;
    var barRowsDelay = 8;
    var barDuration = 400;

    self._c.selectAll('g[data-eltype="bars"]').data(self.data);
    d3.selectAll(self._c[0][0].childNodes)//.filter('.f-bar-value')
      .each(function (d, i0) {
        if (!d) {
          return;
        }
        var g0 = d3.select(this);
        var data = d.value;

        var dotsLine = g0.selectAll('.dots-container>g');
        if (_opts.layout.mode == 'colors') {
          _.each(dotsLine[0],
            function (ln, i) {
              var g = d3.select(ln).selectAll('path');

              g.transition()
                .remove();
              g.transition()
                .ease('exp-out')
                .duration(barDuration)
                .delay(i * barRowsDelay + i0 * barsDelay)
                .style('opacity', 1);
            });
        } else {
          _.each(dotsLine[0],
            function (ln, i) {
              var g = d3.select(ln).selectAll('circle');

              g.transition()
                .remove();
              g.transition()
                .ease('exp-out')
                .duration(barDuration)
                .delay(i * barRowsDelay + i0 * barsDelay)
                .attr('r', _opts.bars.dotRadius);
            });

          var valueCore = g0.selectAll('.value-core');
          var dx = d3.transform(valueCore.attr('transform')).translate[0];
          valueCore.transition()
            .remove();
          valueCore.transition()
            .ease('cubic-out')
            .duration(barDuration * 1.2)
            .delay(i0 * barsDelay)
            .attr('transform', self.formatTranslate(dx, 0))
            .style('opacity', 1);
        }
      });
  }

  prepareContainer();
  bindData();
  animateChanges();
}