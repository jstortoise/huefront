(function (angular) {
  'use strict';
  var controllerName = 'CustomInfographicsController';
  angular.module('app').controller(controllerName, ['$http', 'appConfig', 'statsService', 'common', 'repo.common', '$interpolate', '$scope', 'charts',
    '$q', 'repo.meta', 'repo.designers', '$timeout', '$location', 'dashboardOverlayService', 'authService', 'dashboardRepository', 'anchorSmoothScroll',
    function ($http, appConfig, statsService, common, data, $interpolate, $scope, charts, $q, meta, designers, timeout, $location, dashboardOverlayService, authService, dashboardRepository, anchorSmoothScroll) {
      var vm = this;

      $scope.gotoElement = function (eID) {
        $location.hash('prefooter');
        anchorSmoothScroll.scrollTo(eID);
        $location.hash('');
      };

      vm.grayList = {};
      vm.meta = {};
      vm.filter = {};
      vm.showDashboardOverlay = false;
      vm.isUserAdmin = function () {
        return authService.getCurrentUser().username === 'admin';
      };

      var groupTitlesTemplates = {
        beige: {
          name: '#f5f5dc',
          template: '#f5f5{0}'
        },
        black: {
          name: '#000000',
          template: '#{0}{0}{0}'
        },
        blue: {
          name: '#0000ff',
          template: '#{0}{0}ff'
        },
        brown: {
          name: '#964b00',
          template: '#{0}{1}00'
        },
        cyan: {
          name: '#00ffff',
          template: '#{0}ffff'
        },
        gray: {
          name: '#c0c0c0',
          template: '#{0}{0}{0}'
        },
        green: {
          name: '#008000',
          template: '#{0}80{0}'
        },
        magenta: {
          name: '#ff00ff',
          template: '#ff{0}ff'
        },
        orange: {
          name: '#ff7f00',
          template: '#ff{0}00'
        },
        red: {
          name: '#ff0000',
          template: '#ff{0}{1}'
        },
        violet: {
          name: '#8f00ff',
          template: '#{0}00ff'
        },
        white: {
          name: '#ffffff',
          template: '#{0}{0}{0}'
        },
        yellow: {
          name: '#ffff00',
          template: '#ffff{0}'
        },
        yellowgreen: {
          name: '#8db600',
          template: '#8d{0}00'
        }
      };

      var cache = {
        designers: [],
        categories: [],
        regions: {},
        cities: []
      };

      var loading = {
        ready: false,
        designersReady: $q.defer(),
        metaLoaded: $q.defer(),
        metaReady: $q.defer()
      };

      vm.scrollToLetter = function (anchor) {
        $location.hash(anchor);
        $anchorScroll();
        $location.hash('');
      };

      vm.alphabet = [
        "a",
        "à",
        "b",
        "c",
        "d",
        "e",
        "é",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "ö",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
      ];

      vm.prepareRequestParams = function () {
        var reg = new RegExp('ALL ');
        var city = reg.test(vm.filter.city.title) ? 'all' : vm.filter.city.title;
        var season = reg.test(vm.filter.season.title) ? 'all' : vm.filter.season.title;
        var category = reg.test(vm.filter.category.title) ? 'all' : vm.filter.category.title;
        var designer = reg.test(vm.filter.designer.title) ? 'all' : vm.filter.designer.title.replace(/ /g, '_');

        return {
          city: city,
          year: vm.filter.year.id,
          season: season,
          category: category,
          region: vm.filter.region.id,
          designer: designer
        };
      };

      vm.prepareColorsParams = function () {
        var reg = new RegExp('ALL ');
        var param = {};
        if (!reg.test(vm.filter.city.title)) {
          param.city_id = vm.filter.city.id;
        }
        if (!reg.test(vm.filter.season.title)) {
          param.season_id = vm.filter.season.id;
        }
        if (!reg.test(vm.filter.category.title)) {
          param.category_id = vm.filter.category.id;
        }
        if (!reg.test(vm.filter.designer.title)) {
          param.designer_id = vm.filter.designer.id;
        }
        param.year_id = vm.filter.year.id;
        return param;
      };

      vm.prepareColors = function () {
        var reg = new RegExp('ALL ');
        if (!reg.test(vm.filter.season.title)) {
          return {all: vm.filter.season, category: 'season'};
        }
        if (!reg.test(vm.filter.city.title)) {
          return {all: vm.filter.city, category: 'city'};
        }
        if (!reg.test(vm.filter.category.title)) {
          return {all: vm.filter.category, category: 'category'};
        }
        if (!reg.test(vm.filter.designer.title)) {
          return {all: vm.filter.designer, category: 'designer'};
        }
        return {all: {id: 2018}, category: 'year'};
      };

      loading.metaLoadedStrongLink = loading.metaLoaded;
      loading.filtersReady = $q.all([loading.designersReady.promise, loading.metaReady.promise]);

      meta.objects().then(function (result) {
        var years = [];
        for (var i = result.years.to; i >= result.years.from; i--) {
          years.push({id: i, title: i});
        }

        vm.meta.years = years;
        vm.meta.colorGroups = result.colorGroups;
        vm.meta.categories = result.categories;
        vm.meta.seasons = result.seasons;
        vm.meta.regions = common.generic.regions;
        vm.meta.cities = result.cities;

        _.each(vm.meta, function (item, key) {
          var newTitle = 'All ' + key;
          if (key !== 'colorGroups') {
            item.unshift({id: 'all', title: newTitle.toUpperCase(), region: 'all', serverName: 'all', all: true})
          }
        });

        angular.copy(vm.meta.cities, cache.cities);

        vm.filter.color = vm.meta.colorGroups[0];
        // vm.filter.year = _.find(vm.meta.years, {id: 2017}) || vm.meta.years[vm.meta.years.length - 1];
        vm.filter.year = vm.meta.years[0];
        vm.filter.season = vm.meta.seasons[0];
        vm.filter.category = vm.meta.categories[0];
        vm.filter.city = vm.meta.cities[0];
        vm.filter.region = vm.meta.regions[0];

        loading.metaLoaded.resolve();
      });

      designers.search().then(function (result) {
        vm.meta.designers = result;
        vm.meta.designers.unshift({id: 'all', title: 'ALL DESIGNERS', all: true});

        vm.filter.designer = vm.meta.designers[0];

        loading.designersReady.resolve();
      });

      vm.refresh = function () {
        loadData();
      };

      var defaultDescription = {
        years: '2015-2016',
        colors: '45.567',
        cities: '4',
        region: '1',
        designer: '234',
        season: '3'
      };

      vm.cityOrRegionTitle = function () {
        return vm.filter.city.all && vm.filter.region.all ? null : vm.filter.city.all ? vm.filter.region.title : vm.filter.city.title
      };

      var citiesAbbrevs = {
        London: 'LN',
        Milan: 'MI',
        Paris: 'PR',
        Berlin: 'BR',
        NewYork: 'NY',
        Mexico: 'MX',
        RioDeJaneiro: 'RJ',
        Seoul: 'SE',
        Tokyo: 'TK',
        SaoPaulo: 'SP',
        Istanbul: 'IS',
        Monaco: 'MN',
        Florence: 'FL',
        Rome: 'RO',
        Kiev: 'KI',
        LosAngeles: 'LA',
        LakmeIndia: 'LI',
        Copenhagen: 'CP',
        Salzburg: 'SA',
        Stockholm: 'ST',
        Madrid: 'MA',
        Sydney: 'SY',
        Dubai: 'DU',
        Kaliningrad: 'KA',
        Moscow: 'MO',
        PalmSprings: 'PS',
        Cannes: 'CN',
        Cambridge: 'CB',
        Tbilisi: 'TB',
        Havana: 'HA',
        Kyoto: 'KO',
        SaintPetersburg: 'SG',
        Shanghai: 'SH'
      };

      var regionsAbbrevs = {
        AsiaAndPacific: 'AP',
        Europe: 'EU',
        SouthAmerica: 'LA',
        NorthAmerica: 'NA'
      };

      vm.getTitle = function (type) {
        if (type === 'region') {
          return vm.cityOrRegionTitle()
        } else {
          return !vm.filter[type].all ? vm.filter[type].title : null
        }
      };

      vm.getAbbrv = function (type) {
        var value;
        if (type === 'category') {
          value = vm.filter.category.title;
          if (value === 'Couture') {
            return 'CT';
          } else if (value === 'Menswear') {
            return 'MW';
          } else {
            return value;
          }
        } else if (type === 'season') {
          value = vm.filter.season.title;
          if (value === 'Fall') {
            return 'FW';
          } else if (value === 'Pre-Fall') {
            return 'PF';
          } else if (value === 'Spring') {
            return 'SS';
          } else if (value === 'Resort') {
            return 'RS';
          } else if (value === 'ALL SEASONS') {
            return 'ALL';
          } else {
            return value;
          }
        } else if (type === 'city') {
          value = vm.filter.city.title.replace(/\s/g, '').toLowerCase();
          return _.find(citiesAbbrevs, function (item, key) {
            return value == key.toLowerCase();
          });
        } else if (type === 'region') {
          value = vm.filter.region.title.replace(/\s/g, '').toLowerCase();
          return _.find(regionsAbbrevs, function (item, key) {
            return value == key.toLowerCase();
          });
        }
      };

      vm.parseTitle = function (number) {
        var divider = '';
        var result = '';
        _.map(vm.currentChart.titleGroups[number], function (title) {
          if (vm.getTitle(title) !== null) {
            divider = '//';
          }
          if (vm.getTitle(title)) {
            result = result + ' ' + vm.getTitle(title)
          }
        });
        return divider + result;
      };

      vm.charts = [
        {
          qNumber: 'CO1a',
          id: 'colorsByCityPeriod',
          group: 'colorsByCityPeriod',
          title: 'Color Popularity Overview',
          chartTitle: 'Color Popularity Overview {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            return charts.colorGroupsByCityPeriod(vm.prepareRequestParams())
              .then(function (results) {
                return results;
              });
          },
          filters: {
            category: true,
            season: true,
            year: true,
            region: true,
            city: true
          },
          titleGroups: [
            ['category', 'season', 'year'],
            ['region']
          ],
          options: {
            extraView: true
          }
        },
        {
          qNumber: 'CO1b',
          id: 'colorsByCityPeriod1',
          group: 'colorsByCityPeriod1',
          title: 'Expanded Color Popularity Overview',
          chartTitle: 'Expanded Color Popularity Overview {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            return $q(function (resolve) {
              charts.colorGroupsByCityPeriod(vm.prepareRequestParams())
                .then(function (results) {
                  var param = vm.prepareColors();
                  dashboardRepository[param.category].getColorPalette(param.all.id, vm.prepareColorsParams(), 250)
                    .then(function (data) {
                      _.each(results, function (colorGroup) {
                        colorGroup.colors = [];
                        data.forEach(function (t) {
                          if (colorGroup.title.toLowerCase() === t.color.family.toLowerCase() && colorGroup.colors.length < 17) {
                            colorGroup.colors.push(t.color.color.hex);
                          }
                        });
                        resolve(results);
                      });
                    });
                });
            });
          },
          filters: {
            category: true,
            region: true,
            city: true,
            season: true,
            year: true
          },
          titleGroups: [
            ['category', 'season', 'year'],
            ['region']
          ],
          options: {
            extraView: true
          }
        },
        {
          qNumber: 'CO2a',
          id: 'colorsUniqueWithLevels',
          group: 'colorsUniqueWithLevels',
          title: 'Color Mosaic View With Popularity',
          chartTitle: 'Color Mosaic View With Popularity {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            return charts.colorsUniqueGroups(vm.prepareRequestParams());
          },
          filters: {
            category: true,
            season: true,
            year: true,
            region: true,
            city: true
          },
          titleGroups: [
            ['category', 'season', 'year'],
            ['region']
          ]
        },
        {
          qNumber: 'CO3a',
          id: 'trends',
          group: 'trends',
          title: 'Five Year Color Comparison',
          chartTitle: 'Five Year Color Comparison {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            var yearsRange = _.range(vm.filter.year.id - 4, vm.filter.year.id + 1);
            var customParams = vm.prepareRequestParams();
            if (vm.filter.year.all) {
              yearsRange = _.range(vm.meta.years[1].title - 4, vm.meta.years[1].title + 1);
            } else if (yearsRange[0] < vm.meta.years[vm.meta.years.length - 1].title) {
              yearsRange = _.range(vm.meta.years[vm.meta.years.length - 1].title, vm.meta.years[vm.meta.years.length - 1].title + 5);
            }

            return $q.all(_.map(yearsRange, function (year) {
              customParams.year = year;
              return charts.colorGroupsByCityPeriod(customParams);
            })).then(function (results) {
              return _.map(results, function (result, i) {
                return {
                  title: yearsRange[i],
                  data: result
                };
              });
            });
          },
          filters: {
            category: true,
            season: true,
            year: true,
            region: true,
            city: true
          },
          titleGroups: [
            ['category', 'season', 'year'],
            ['region']
          ]
        },
        {
          qNumber: 'RE1a',
          id: 'colorsByRegionPeriodNA',
          group: 'colorsByRegionPeriod',
          title: 'Color Popularity By Region With City Breakdown',
          chartTitle: 'Color Popularity By Region With City Breakdown {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            return charts.colorsWithGroupsByRegionPeriod(vm.prepareRequestParams(), vm.filter.region.name);
          },
          filters: {
            category: true,
            region: true,
            season: true,
            year: true
          },
          titleGroups: [
            ['category', 'season', 'year'],
            ['region']
          ],
          options: {}
        },
        {
          qNumber: 'RE2a',
          id: 'colorsPerRegions',
          group: 'colorsPerRegions',
          title: 'Cross Region Top Four Colors',
          chartTitle: 'Cross Region Top Four Colors {{vm.parseTitle(0)}}',
          api: function () {
            return charts.colorsPerRegions(vm.prepareRequestParams());
          },
          filters: {
            category: true,
            season: true,
            year: true
          },
          titleGroups: [
            ['category', 'season', 'year']
          ]
        },
        {
          qNumber: 'SE1a',
          id: 'colorsUniqueGroupsCommon',
          group: 'colorsUniqueGroupsCommon',
          title: 'Color Popularity By Season',
          chartTitle: 'Color Popularity By Season {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            return charts.colorsUniqueGroupsCommon(vm.prepareRequestParams());
          },
          apiAfter: function (model) {
            model.season = vm.filter.season.title;
            model.year = vm.filter.year.title;
          },
          filters: {
            category: true,
            region: true,
            city: true,
            season: true,
            year: true
          },
          titleGroups: [
            ['category', 'season', 'year'],
            ['region']
          ]
        },
        {
          qNumber: 'SE2a',
          id: 'colorsUniqueByPeriodFiveYears',
          group: 'colorsUniqueByPeriodFiveYears',
          title: 'Five Year Comparison Of Seasons Colors',
          chartTitle: 'Five Year Comparison Of Seasons Colors {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            var yearsRange = _.range(vm.filter.year.id - 4, vm.filter.year.id + 1);
            if (vm.filter.year.all) {
              yearsRange = _.range(vm.meta.years[1].title - 4, vm.meta.years[1].title + 1);
            } else if (yearsRange[0] < vm.meta.years[vm.meta.years.length - 1].title) {
              yearsRange = _.range(vm.meta.years[vm.meta.years.length - 1].title, vm.meta.years[vm.meta.years.length - 1].title + 5);
            }
            return charts.colorsByPeriodYearsRange(vm.prepareRequestParams(), yearsRange);
          },
          filters: {
            category: true,
            region: true,
            city: true,
            season: true,
            year: true
          },
          titleGroups: [
            ['category', 'season', 'year'],
            ['region']
          ],
          options: {
            extraView: true
          }
        },
        {
          qNumber: 'SE2b',
          id: 'colorsUniqueByPeriodFiveYears2',
          group: 'colorsUniqueByPeriodFiveYears2',
          title: 'Expanded Five Year Comparison Of Seasons Colors',
          chartTitle: 'Expanded Five Year Comparison Of Seasons Colors {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            var yearsRange = _.range(vm.filter.year.id - 4, vm.filter.year.id + 1);
            if (vm.filter.year.all) {
              yearsRange = _.range(vm.meta.years[1].title - 4, vm.meta.years[1].title + 1);
            } else if (yearsRange[0] < vm.meta.years[vm.meta.years.length - 1].title) {
              yearsRange = _.range(vm.meta.years[vm.meta.years.length - 1].title, vm.meta.years[vm.meta.years.length - 1].title + 5);
            }
            var param = vm.prepareColors();
            var palettes = {};
            return charts.colorGroupsByCityPeriod(vm.prepareRequestParams())
              .then(function (results) {
                return $q.all(yearsRange.map(function (d) {
                  return dashboardRepository['year'].getColorPalette(d, vm.prepareColorsParams(), 250);
                }))
                  .then(function (data) {
                    _.each(data, function (r, i) {
                      _.each(r, function (a) {
                        a.colorHex = a.color.color.hex;
                      });
                      _.sortBy(r, 'percentage');
                      palettes[vm.getAbbrv('season') + yearsRange[i]] = r;
                    });
                    results.push(palettes);
                    return results;
                  });
              });
          },
          filters: {
            category: true,
            city: true,
            season: true,
            year: true,
            region: true
          },
          titleGroups: [
            ['category', 'season', 'year'],
            ['region']
          ],
          options: {
            extraView: true
          }
        },
        {
          qNumber: 'SE3a',
          id: 'uniqueWithGroupsPerSeason',
          group: 'uniqueWithGroupsPerSeason',
          title: 'Color Mosaic View By Season With Popularity',
          chartTitle: 'Color Mosaic View By Season With Popularity {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            var customParams = vm.prepareRequestParams();
            return charts.colorsUniqueGroupsPerSeason(customParams.year, customParams.city, customParams.category);
          },
          apiAfter: function (model) {
            model.city = vm.cityOrRegionTitle();
          },
          filters: {
            category: true,
            year: true,
            region: true,
            city: true
          },
          titleGroups: [
            ['category', 'season', 'year'],
            ['region']
          ]
        },
        {
          qNumber: 'CA1a',
          id: 'colorsByCategoryPeriod',
          group: 'colorsByCategoryPeriod',
          title: 'Color Popularity By Category',
          chartTitle: 'Color Popularity By Category {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            return charts.colorGroupsByCityPeriod(vm.prepareRequestParams());
          },
          filters: {
            category: true,
            season: true,
            year: true,
            region: true,
            city: true
          },
          titleGroups: [
            ['category', 'season', 'year'],
            ['region']
          ]
        },
        {
          qNumber: 'CA2a',
          id: 'colorsByCategory',
          group: 'colorsGridNails',
          title: 'Cross Category Color Popularity',
          chartTitle: 'Cross Category Color Popularity {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            var customParams = vm.prepareRequestParams();
            return $q.all(_.map(['couture', 'menswear', 'rtw'], function (category) {
              customParams.category = category;
              return charts.colorGroupsByCityPeriod(customParams)
                .then(function (groups) {
                  _.each(groups, function (gr) {
                    gr.colors = _.map(_.range(3), function () {
                      return {color: generateRandomGroupColorByGroupTitle(gr.title)};
                    });
                  });
                  return {
                    name: category,
                    title: category,
                    data: groups
                  };
                });
            }));
          },
          filters: {
            season: true,
            year: true,
            region: true,
            city: true
          },
          titleGroups: [
            ['season', 'year'],
            ['region']
          ],
          options: {
            extraView: true
          }
        },
        {
          qNumber: 'CA2b',
          id: 'colorsByCategory2',
          group: 'colorsGridNails2',
          title: 'Cross Category Top Three Colors',
          chartTitle: 'Cross Category Top Three Colors {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            var customParams = vm.prepareRequestParams();

            return $q(function (resolve) {
              charts.colorGroupsByCityPeriod(customParams).then(function (group) {
                var groups = [
                  {
                    name: customParams.category + '\n' + 'couture',
                    title: customParams.category + '\n' + 'couture',
                    data: group
                  },
                  {
                    name: customParams.category + '\n' + 'menswear',
                    title: customParams.category + '\n' + 'menswear',
                    data: group
                  }, {
                    name: customParams.category + '\n' + 'rtw',
                    title: customParams.category + '\n' + 'rtw',
                    data: group
                  }];
                async.waterfall([function (cb) {
                  dashboardRepository["category"].getColorPalette(3, vm.prepareColorsParams(), 250)
                    .then(function (data) {
                      _.each(groups[0].data, function (colorGroup) {
                        colorGroup.colors = [];
                        data.forEach(function (t) {
                          if (colorGroup.title.toLowerCase() === t.color.family.toLowerCase() && colorGroup.colors.length < 3) {
                            colorGroup.colors.push(t.color.color.hex);
                          }
                        });
                      });
                      cb();
                    });
                }, function (cb) {
                  dashboardRepository["category"].getColorPalette(2, vm.prepareColorsParams(), 250)
                    .then(function (data) {
                      _.each(groups[1].data, function (colorGroup) {
                        colorGroup.colors = [];
                        data.forEach(function (t) {
                          if (colorGroup.title.toLowerCase() === t.color.family.toLowerCase() && colorGroup.colors.length < 3) {
                            colorGroup.colors.push(t.color.color.hex);
                          }
                        });
                      });
                      cb();
                    });
                }, function (cb) {
                  dashboardRepository["category"].getColorPalette(1, vm.prepareColorsParams(), 250)
                    .then(function (data) {
                      _.each(groups[2].data, function (colorGroup) {
                        colorGroup.colors = [];
                        data.forEach(function (t) {
                          if (colorGroup.title.toLowerCase() === t.color.family.toLowerCase() && colorGroup.colors.length < 3) {
                            colorGroup.colors.push(t.color.color.hex);
                          }
                        });
                      });
                      cb();
                    });
                }], function () {
                  resolve(groups);
                });
              });
            });
          },
          filters: {
            season: true,
            year: true,
            region: true,
            city: true
          },
          titleGroups: [
            ['season', 'year'],
            ['region']
          ],
          options: {
            extraView: true
          }
        },
        {
          qNumber: 'CA3a',
          id: 'colorsByRtwCategory',
          group: 'colorsGridNails',
          title: 'Three Year Comparison Of Color Popularity',
          chartTitle: 'Three Year Comparison Of Color Popularity {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            var yearsRange = _.range(vm.filter.year.id, vm.filter.year.id - 3);
            var customParams = vm.prepareRequestParams();
            if (vm.filter.year.all) {
              yearsRange = _.range(vm.meta.years[1].title, vm.meta.years[1].title - 3);
            } else if (yearsRange[2] < vm.meta.years[vm.meta.years.length - 1].title) {
              yearsRange = _.range(vm.meta.years[vm.meta.years.length - 1].title + 2, vm.meta.years[vm.meta.years.length - 1].title - 1);
            }

            return $q.all(_.map(yearsRange, function (dy) {
              customParams.year = dy;
              return charts.colorGroupsByCityPeriod(customParams)
                .then(function (groups) {
                  _.each(groups, function (gr) {
                    gr.colors = _.map(_.range(3), function () {
                      return {color: generateRandomGroupColorByGroupTitle(gr.title)};
                    });
                  });

                  return {
                    name: customParams.category + '\n' + dy,
                    title: customParams.category + '\n' + dy,
                    data: groups
                  };
                });
            }));
          },
          filters: {
            category: true,
            season: true,
            year: true,
            region: true,
            city: true
          },
          titleGroups: [
            ['category', 'season', 'year'],
            ['region']
          ],
          options: {
            extraView: true
          }
        },
        {
          qNumber: 'CA3b',
          id: 'colorsByRtwCategory2',
          group: 'colorsGridNails2',
          title: 'Expanded Three Year Comparison Of Color Popularity',
          chartTitle: 'Expanded Three Year Comparison Of Color Popularity {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            var yearsRange = _.range(vm.filter.year.id, vm.filter.year.id - 3);
            var customParams = vm.prepareRequestParams();
            if (vm.filter.year.all) {
              yearsRange = _.range(vm.meta.years[1].title, vm.meta.years[1].title - 3);
            } else if (yearsRange[2] < vm.meta.years[vm.meta.years.length - 1].title) {
              yearsRange = _.range(vm.meta.years[vm.meta.years.length - 1].title + 2, vm.meta.years[vm.meta.years.length - 1].title - 1);
            }
            return $q(function (resolve) {
              charts.colorGroupsByCityPeriod(customParams).then(function (group) {
                var groups = [
                  {
                    name: customParams.category + '\n' + yearsRange[0],
                    title: customParams.category + '\n' + yearsRange[0],
                    data: group
                  },
                  {
                    name: customParams.category + '\n' + yearsRange[1],
                    title: customParams.category + '\n' + yearsRange[1],
                    data: group
                  }, {
                    name: customParams.category + '\n' + yearsRange[2],
                    title: customParams.category + '\n' + yearsRange[2],
                    data: group
                  }];
                async.waterfall([function (cb) {
                  dashboardRepository["year"].getColorPalette(yearsRange[0], vm.prepareColorsParams(), 250)
                    .then(function (data) {
                      _.each(groups[0].data, function (colorGroup) {
                        colorGroup.colors = [];
                        data.forEach(function (t) {
                          if (colorGroup.title.toLowerCase() === t.color.family.toLowerCase() && colorGroup.colors.length < 3) {
                            colorGroup.colors.push(t.color.color.hex);
                          }
                        });
                      });
                      cb();
                    });
                }, function (cb) {
                  dashboardRepository["year"].getColorPalette(yearsRange[1], vm.prepareColorsParams(), 250)
                    .then(function (data) {
                      _.each(groups[1].data, function (colorGroup) {
                        colorGroup.colors = [];
                        data.forEach(function (t) {
                          if (colorGroup.title.toLowerCase() === t.color.family.toLowerCase() && colorGroup.colors.length < 3) {
                            colorGroup.colors.push(t.color.color.hex);
                          }
                        });
                      });
                      cb();
                    });
                }, function (cb) {
                  dashboardRepository["year"].getColorPalette(yearsRange[2], vm.prepareColorsParams(), 250)
                    .then(function (data) {
                      _.each(groups[2].data, function (colorGroup) {
                        colorGroup.colors = [];
                        data.forEach(function (t) {
                          if (colorGroup.title.toLowerCase() === t.color.family.toLowerCase() && colorGroup.colors.length < 3) {
                            colorGroup.colors.push(t.color.color.hex);
                          }
                        });
                      });
                      cb();
                    });
                }], function () {
                  resolve(groups);
                });
              });
            });
          },
          filters: {
            category: true,
            season: true,
            year: true,
            region: true,
            city: true
          },
          titleGroups: [
            ['category', 'season', 'year'],
            ['region']
          ],
          options: {
            extraView: true
          }
        },
        {
          qNumber: 'CI1a',
          id: 'citiesByColorPeriod',
          group: 'citiesByColorPeriod',
          title: 'Cross City Popularity By Color',
          chartTitle: 'Cross City Popularity By Color {{vm.parseTitle(0)}} {{vm.parseTitle(1)}} {{vm.parseTitle(2)}}',
          api: function () {
            var customParams = vm.prepareRequestParams();
            customParams.color = vm.filter.color.hex.replace('#', '');
            return charts.citiesByColorPeriod(customParams);
          },
          filters: {
            category: true,
            season: true,
            year: true,
            region: true,
            color: true
          },
          titleGroups: [
            ['color'],
            ['category', 'season', 'year'],
            ['region']
          ]
        },
        {
          qNumber: 'DE1a',
          id: 'colorsGroupsCommon',
          group: 'colorsGroupsCommon',
          title: 'Color Popularity By Designer',
          chartTitle: 'Color Popularity By Designer {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            return charts.colorsGroupsCommon(vm.prepareRequestParams())
              .then(function (results) {
                return results;
              });
          },
          filters: {
            category: true,
            season: true,
            year: true,
            designer: true
          },
          titleGroups: [
            ['designer'],
            ['category', 'season', 'year']
          ],
          options: {
            extraView: true
          }
        },
        {
          qNumber: 'DE1b',
          id: 'colorsGroupsCommon2',
          group: 'colorsGroupsCommon2',
          title: 'Expanded Color Popularity By Designer',
          chartTitle: 'Expanded Color Popularity By Designer {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            return charts.colorsGroupsCommon(vm.prepareRequestParams())
              .then(function (results) {
                return dashboardRepository['year'].getColorPalette(vm.filter.year.all ? 2018 : vm.filter.year.id, vm.prepareColorsParams(), 250)
                  .then(function (data) {
                    results['palettes'] = data;
                    return results;
                  });
              });
          },
          filters: {
            category: true,
            season: true,
            year: true,
            designer: true
          },
          titleGroups: [
            ['designer'],
            ['category', 'season', 'year']
          ],
          options: {
            extraView: true
          }
        },
        {
          qNumber: 'DE2a',
          id: 'top4forDesigner',
          group: 'top4forDesigner',
          title: 'Two Year Comparison of Color Popularity By Designer',
          chartTitle: 'Two Year Comparison of Color Popularity By Designer {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            var yearsRange = _.range(vm.filter.year.id - 1, vm.filter.year.id + 1);
            if (vm.filter.year.all) {
              yearsRange = _.range(vm.meta.years[1].title - 1, vm.meta.years[1].title + 1);
            } else if (yearsRange[0] < vm.meta.years[vm.meta.years.length - 1].title) {
              yearsRange = _.range(vm.meta.years[vm.meta.years.length - 1].title, vm.meta.years[vm.meta.years.length - 1].title + 2);
            }

            return $q.all([
              charts.colorsWithGroups(vm.prepareRequestParams(), yearsRange[0])
                .then(function (results) {
                  return results;
                }),
              charts.colorsWithGroups(vm.prepareRequestParams(), yearsRange[1])
                .then(function (results) {
                  return results;
                })
            ]).then(function (results) {
              return _.map(results, function (result, i) {
                return {
                  title: yearsRange[i],
                  data: result
                };
              });
            });
          },
          apiAfter: function (model) {
            model.city = vm.filter.city.title;
          },
          filters: {
            category: true,
            season: true,
            year: true,
            designer: true
          },
          titleGroups: [
            ['designer'],
            ['category', 'season', 'year']
          ],
          options: {
            extraView: true
          }
        },
        {
          qNumber: 'DE2b',
          id: 'top4forDesigner2',
          group: 'top4forDesigner2',
          title: 'Expanded Two Year Comparison of Color Popularity By Designer',
          chartTitle: 'Expanded Two Year Comparison of Color Popularity By Designer {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            var yearsRange = _.range(vm.filter.year.id - 1, vm.filter.year.id + 1);
            if (vm.filter.year.all) {
              yearsRange = _.range(vm.meta.years[1].title - 1, vm.meta.years[1].title + 1);
            } else if (yearsRange[0] < vm.meta.years[vm.meta.years.length - 1].title) {
              yearsRange = _.range(vm.meta.years[vm.meta.years.length - 1].title, vm.meta.years[vm.meta.years.length - 1].title + 2);
            }
            return $q.all([
              charts.colorsWithGroups(vm.prepareRequestParams(), yearsRange[0])
                .then(function (results) {
                  return results;
                }),
              charts.colorsWithGroups(vm.prepareRequestParams(), yearsRange[1])
                .then(function (results) {
                  return results;
                }),
              dashboardRepository['year'].getColorPalette(yearsRange[0], vm.prepareColorsParams(), 250)
                .then(function (data) {
                  return data;
                }),
              dashboardRepository['year'].getColorPalette(yearsRange[1], vm.prepareColorsParams(), 250)
                .then(function (data) {
                  return data;
                })
            ]).then(function (results) {
              return _.map(results,
                function (result, i) {
                  return {
                    title: yearsRange[i],
                    data: result
                  };
                });
            });
          },
          apiAfter: function (model) {
            model.city = vm.filter.city.title;
          },
          filters: {
            category: true,
            season: true,
            year: true,
            designer: true
          },
          titleGroups: [
            ['designer'],
            ['category', 'season', 'year']
          ],
          options: {
            extraView: true
          }
        },
        {
          qNumber: 'DE3a',
          id: 'top4Grid',
          group: 'top4Grid',
          title: 'Designers Top Four Colors',
          chartTitle: 'Designers Top Four Colors {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
          api: function () {
            return charts.designersWithTopColors(vm.prepareRequestParams());
          },
          filters: {
            season: true,
            year: true,
            region: true
          },
          titleGroups: [
            ['designer'],
            ['season', 'year']
          ]
        }
        /*           {
         id: 'colorsUniqueWithLevelsGrouped',
         group: 'colorsUniqueWithLevels',
         title: 'All colors with their distribution per region / city / season / year - GROUPED',
         chartTitle: 'A Comparative View of All Colors used in {{vm.filter.region.title}} {{vm.filter.city.title}} And Their Distribution {{vm.getAbbrv("season")}} {{vm.filter.year.title}}',
         api: function() {
         return charts.colorsUniqueGroups(vm.filter.year.id, vm.filter.season.title, null, vm.filter.city.title);
         },
         apiAfter:  function(model, results) {
         //                            vm.model.ordered = true;
         model.grouped = true;
         },
         filters: {
         seasons: true,
         years: true,
         regions: true,
         cities: true
         }
         },
         */
      ];

      vm.currentChart = vm.charts[0];
      vm.chartsCurrentViewType = null;

      $scope.$watch('[vm.currentChart, vm.filter]', loadData, true);

      $scope.$watch('vm.filter.region', function (regionNewV) {
        if (regionNewV) {
          if (!regionNewV.all) {
            vm.meta.cities = _.filter(cache.cities, function (city) {
              if (city.region) {
                return city.region.toLowerCase() === regionNewV.serverName.toLowerCase() || city.all
              }
            })
          } else if (regionNewV.all) {
            angular.copy(cache.cities, vm.meta.cities);
          }
          vm.filter.city = vm.meta.cities[0];
        }

        // var region = (cache.regions || {})[(vm.filter.region || {}).id] || {};
        // vm.meta.cities = region.cities;
        // vm.filter.city = (region.cities || [])[0];
        //
        // // city must be already selected before starting to filter

        if (!loading.isMetaLoadedSetup) {
          loading.metaLoaded.promise.then(function () {
            loading.metaReady.resolve();
          });
          loading.isMetaLoadedSetup = true;
        }
      });

      // $scope.$watch(function () {
      //   return dashboardOverlayService.showOverlay;
      // }, function (newValue, oldValue) {
      //   vm.showDashboardOverlay = newValue;
      // });

      function loadData(newV, oldV) {
        // dashboardOverlayService.loadingStart(10000);
        loading.currentRequestId = Math.random();
        if (newV && oldV) {
          if (newV[0].qNumber !== oldV[0].qNumber) {
            vm.filter.designer = vm.meta.designers[0];

            if (newV[0].qNumber === 'RE1a' || newV[0].qNumber === 'CI1a') {
              vm.meta.regions = _.filter(vm.meta.regions, function (item) {
                return !item.all;
              });
              vm.filter.region = vm.meta.regions[0];
            } else if (!_.find(vm.meta.regions, 'all')) {
              vm.meta.regions.unshift({id: 'all', title: 'ALL REGIONS', region: 'all', serverName: 'all', all: true});
              vm.filter.region = vm.meta.regions[0];
            }
          }
        }

        loading.filtersReady.then(function () {
          vm.model = null;

          (function (currentRequestId) {
            vm.currentChart.api().then(function (result) {

              if (currentRequestId !== loading.currentRequestId || !result) {
                return;
              }
              vm.model = result;
              if (vm.currentChart.apiAfter) {
                vm.currentChart.apiAfter(vm.model, result);
              }
              vm.title = prepareTitle(vm.currentChart.chartTitle);
              prepareDescription();
            });
            // dashboardOverlayService.loadingCompleted();
          })(loading.currentRequestId);
        });
      }

      function prepareTitle(title) {
        var exp = $interpolate(title);
        return exp($scope);
      }

      function prepareDescription() {
        vm.description = vm.description || (vm.filter.year.title + ' | COLORS-' + vm.currentChart.qNumber + ' | CITIES-' +
          vm.filter.city.title + ' | REGIONS-' + vm.filter.region.title + ' | DESIGNER-' + vm.filter.designer.title +
          ' | SEASONS-' + vm.filter.season.title);

        var regionId = null;
        switch (vm.filter.region.id) {
          case 'europe':
            regionId = 2;
            break;
          case 'north_america':
            regionId = 3;
            break;
          case 'latin_america':
            regionId = 4;
            break;
          case 'asia_pacific':
            regionId = 1;
            break;
        }

        var yearFrom = null;
        var yearTo = vm.filter.year.id === 'all' ? vm.meta.years[1].title : vm.filter.year.id;
        if (vm.currentChart.qNumber === 'CO3a' || vm.currentChart.qNumber === 'SE2a' || vm.currentChart.qNumber === 'SE2b') {
          yearFrom = yearTo - 4;
        } else if (vm.currentChart.qNumber === 'CA3a' || vm.currentChart.qNumber === 'CA3b') {
          yearFrom = yearTo - 2;
        } else if (vm.currentChart.qNumber === 'DE2a' || vm.currentChart.qNumber === 'DE2b') {
          yearFrom = yearTo - 1;
        }

        $http({
          url: (appConfig.webServiceUrl + 'stats'),
          method: 'GET',
          params: {
            fashionSeason: vm.filter.season.id === 'all' ? null : vm.filter.season.id,
            fashionDesigner: vm.filter.designer.id === 'all' ? null : vm.filter.designer.id,
            fashionRegion: regionId || null,
            fashionCity: vm.filter.city.id === 'all' ? null : vm.filter.city.id,
            fashionCategory: vm.filter.category.id === 'all' ? null : vm.filter.category.id,
            fashionYear: yearFrom || vm.filter.year.id === 'all' ? null : vm.filter.year.id,
            yearFrom: yearFrom || null,
            yearTo: yearFrom ? yearTo : null
          }
        }).then(function (res) {
          vm.grayList = res.data.data;
          vm.description = 'YEARS-' + res.data.counts.years + ' | COLORS-' + res.data.counts.colors +
            ' | CITIES-' + res.data.counts.cities + ' | REGIONS-' + res.data.counts.regions +
            ' | DESIGNER-' + res.data.counts.designers + ' | SEASONS-' + res.data.counts.seasons;
        });
      }

      vm.labelToGray = function (selector, title) {
        var result = true;

        if (title.indexOf('ALL ') === -1) {
          _.forEach(vm.grayList[selector], function (item) {
            if (item.title === title) {
              result = false;
            }
          });
        }
        return result;
      };

      vm.isFilterItems = function (selector, title) {
        if (selector === 'regions') {
          switch (title) {
            case 'Europe':
              title = 'Europe';
              break;
            case 'North America':
              title = 'North America';
              break;
            case 'South America':
              title = 'Latin America';
              break;
            case 'Asia and Pacific':
              title = 'Asia Pacific';
              break;
          }
        }

        var result = true;

        if (vm.grayList[selector] === undefined) {
          result = false;
        } else if (selector === 'years' && vm.filter.year.title === 'ALL YEARS' && (vm.currentChart.qNumber === 'CO3a' ||
            vm.currentChart.qNumber === 'SE2a' || vm.currentChart.qNumber === 'SE2b' ||
            vm.currentChart.qNumber === 'CA3a' || vm.currentChart.qNumber === 'CA3b' ||
            vm.currentChart.qNumber === 'DE2a' || vm.currentChart.qNumber === 'DE2b')) {
          result = false;
        } else if (selector === 'regions' && vm.currentChart.qNumber === 'RE1a') {
          result = false;
        } else if (vm.grayList === {} || title.toString().indexOf('ALL ') === -1) {
          _.forEach(vm.grayList[selector], function (item) {
            if (item.title === title.toString()) {
              result = false;
            }
          });
        } else {
          result = false;
        }
        return result;
      };

      vm.isFilterVisible = function (filterId) {
        var filterOptions = vm.currentChart.filters || {};

        var filter = filterOptions.all;
        if (!filter) {
          filter = filterOptions[filterId];
        }

        if (filter === true) {
          return true;
        } else if (angular.isFunction(filter)) {
          return filter();
        }

        return false;
      };

      vm.generateImgName = function (extension) {
        var abbrevs = {
          qNumber: vm.currentChart.qNumber,
          category: vm.filter.category.all ? 'AllCa' : vm.getAbbrv('category'),
          season: vm.filter.season.all ? 'AllSe' : vm.getAbbrv('season'),
          year: vm.filter.year.all ? 'AllYe' : '17',
          region: vm.filter.region.all ? 'AllRe' : vm.getAbbrv('region'),
          city: vm.filter.city.all ? 'AllCi' : vm.getAbbrv('city')
        };
        var result = '';
        var date = moment().format('L');

        _.map(abbrevs, function (item) {
          result += item + '.';
        });

        return result + date + '.jpg';
      };

      vm.exportJpg = function () {
        statsService.infographics();
        var captureEl = angular.element('#capture');
        var footer = angular.element('.customized-infographics-footer');
        var titles = angular.element('.graphic-titles');
        footer.css({display: 'block'});
        // titles.css({'text-align': 'left', 'font-size': '3em'});
        captureEl.css({'padding-top': '30px'});
        var captureElHeight = captureEl.height();
        var captureElWidth = captureEl.width();

        timeout(function () {
          html2canvas(captureEl[0], {
            height: captureElHeight + 20,
            width: captureElWidth + 10,
            background: '#fff'
          }).then(function (canvas) {
            var img = canvas.toDataURL("image/jpeg");
            download(img, vm.generateImgName('jpg'), "image/jpg");
            captureEl.css({'padding': '0'});
            footer.css({display: 'none'});
            titles.css({'font-size': '20px', 'text-align': 'center'});
          });
        }, 50);
      };

      vm.reportJpg = function () {
        var captureEl = angular.element('#capture');
        var captureElHeight = captureEl.height();
        var captureElWidth = captureEl.width();
        timeout(function () {
          html2canvas(captureEl[0], {
            height: captureElHeight + 20,
            width: captureElWidth + 20,
            background: '#fff'
          }).then(function (canvas) {
            var img = canvas.toDataURL("image/jpeg");
            download(img, vm.generateImgName('jpg'), "image/jpg");
          });
        }, 50);
      };

      function generateRandomGroupColorByGroupTitle(title) {
        title = (title || '').replace(/[^\w]/g, '').toLowerCase();
        var group = (groupTitlesTemplates[title] || {}).template || '#{0}{1}{2}';

        return String.format(group,
          randomColorFraction() + randomColorFraction(),
          randomColorFraction() + randomColorFraction(),
          randomColorFraction() + randomColorFraction());

        function randomColorFraction() {
          return Math.round(Math.random() * 15).toString(16);
        }
      }
    }

  ]);
}(angular));
