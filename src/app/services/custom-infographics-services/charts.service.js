(function () {
  'use strict';
  var serviceId = 'charts';
  angular
    .module('app')
    .service(serviceId,
      [
        '$q', 'repo.hue',
        function ($q, hue) {

          var regions = ['europe', 'asia', 'namerica', 'samerica'];

          function colorGroupsByCityPeriod(req) {
            return hue.colorGroupsByCityPeriod(req)
              .then(function (result) {
                _.each(result, function (d) {
                  var value = d.value;
                  // d.value = d.percentage * 100; // overriding
                  d.valueTitle = Math.round(d.percentage * 100) + '%';
                  d.valueTitle2 = value;
                  d.color = d.name;
                });
                result = _.sortBy(result, 'group');
                return result;
              });
          }

          function citiesByColorPeriod(req) {
            return hue.citiesByColorPeriod(req)
              .then(function (result) {
                _.each(result, function (d) {
                  var value = d.value;
                  // d.value = d.percentage * 100;
                  d.valueTitle = d.percentage === null ? 'N/A' : Math.round(d.percentage * 100) + '%';
                  d.valueTitle2 = d.percentage === null ? '' : value;
                  d.color = '#' + req.color;
                });
                result = _.sortBy(result, 'group');
                return result;
              });
          }

          function colorsPerRegions(req) {
            return $q.all(_.map(regions, function (r) {
                return hue.colorsByRegionCityPeriod({
                  year: req.year,
                  season: req.season,
                  category: req.category,
                  region: r
                }).then(function (response) {
                  return {
                    name: r,
                    title: r,
                    data: response
                  };
                });
              })
            )/*.then(function(responses) {
             return responses;
             })*/;
          }

          function colorsByPeriodYearsRange(req, yearsRange) {
            return $q.all(_.map(yearsRange, function (y) {
              req.year = y;
              return $q.all([
                hue.colorsByRegionPeriod(req),
                hue.colorsUniqueByRegionPeriod(req)
              ]).then(function (responses) {
                return {
                  year: y,
                  season: req.season,
                  colors: responses[0],
                  colorsUnique: responses[1]
                };
              });

            })).then(function (responses) {
              return responses;
            });
          }

          function colorsUniqueGroupsPerSeason(year, city, category) {
            // var seasons = ['spring', 'spring', 'fall', 'fall'];
            var seasons = ['winter', 'spring', 'summer', 'fall'];
            return $q.all(_.map(seasons, function (s) {
              var req = {year: year, season: s, city: city, category: category};
              if (s === 'winter') {
                req.season = 'spring';
              } else if (s === 'summer') {
                req.season = 'fall';
              }
              return $q.all([
                hue.colorGroupsByCityPeriod(req),
                hue.colorsUniqueByRegionPeriod(req)])
                .then(function (responses) {
                  return {
                    year: year,
                    name: s,
                    groups: responses[0],
                    unique: responses[1]
                  };
                });
            })).then(function (responses) {
              return responses;
            });
          }

          function colorGroupsByCategories(categories, region, year, season) {
            return $q.all(_.map(categories, function (c) {
              return hue.colorGroupsByCategories({category: c, region: region, year: year, season: season})
                .then(function (response) {
                  return {
                    name: c,
                    title: c,
                    data: response
                  };
                });

            })).then(function (responses) {
              return responses;
            });
          }

          function colorsWithGroupsByRegionPeriod(req, region) {
            return $q.all([
              hue.colorGroupsByCityPeriod(req),
              hue.colorsByRegionCitiesPeriod(req)
            ]).then(function (results) {
              var cities = results[1];
              var data = results[0];

              var result = {
                region: {
                  name: region,
                  cities: {
                    title: 'Top 4 colors',
                    settings: {},
                    data: cities
                  }
                },
                charts: {
                  settings: {},
                  data: data
                }
              };

              _.each(result.region.cities.data, function (c) {
                // c.name = 'ny';
                _.each(c.data, function (d) {
                  d.value = d.percentage;
                });
              });

              result.region.cities.settings = {
                bars: {
                  radius: 62,
                  radiusInner: 46
                }
              };

              return result;
            });
          }

          function colorsWithGroups(req, year) {
            req.year = year;
            return $q.all([
              hue.colorGroupsByCityPeriod(req),
              hue.colorsByRegionCityPeriod(req)
            ]).then(function (results) {
              var groups = results[0];
              var colors = results[1];
              return {
                groups: groups,
                colors: colors
              };
            });
          }

          function colorsUniqueGroupsCommon(req) {
            return $q.all([
              hue.colorGroupsByCityPeriod(req),
              hue.colorsByCityPeriod(req),
              hue.colorsUniqueByRegionPeriod(req)
            ]).then(function (results) {
              var data = results[0];
              var common = results[1];
              var unique = results[2];

              return {
                groups: data,
                common: common,
                unique: unique
              };
            });
          }

          function designersWithTopColors(req) {
            var params = {region: req.region, year: req.year, season: req.season};
            return hue.designersWithTopColors(params)
              .then(function (results) {
                return results;
              });
          }

          function colorsGroupsCommon(req) {
            return $q.all([
              hue.colorGroupsByCityPeriod(req),
              hue.colorsByCityPeriod(req)
            ]).then(function (results) {
              var data = results[0];
              var common = results[1];

              return {
                groups: data,
                common: common
              };
            });
          }

          function colorsUniqueGroups(req) {
            return $q.all([
              hue.colorGroupsByCityPeriod(req),
              hue.colorsUniqueByRegionPeriod(req)
            ]).then(function (results) {
              var data = results[0];
              var unique = results[1];
              return {
                groups: data,
                unique: unique
              };
            });
          }

          return {
            colorGroupsByCityPeriod: colorGroupsByCityPeriod,
            colorsWithGroupsByRegionPeriod: colorsWithGroupsByRegionPeriod,
            colorsWithGroups: colorsWithGroups,
            citiesByColorPeriod: citiesByColorPeriod,
            colorsUniqueGroupsPerSeason: colorsUniqueGroupsPerSeason,

            colorsByPeriodYearsRange: colorsByPeriodYearsRange,
            colorGroupsByCategories: colorGroupsByCategories,
            colorsUniqueGroupsCommon: colorsUniqueGroupsCommon,
            colorsGroupsCommon: colorsGroupsCommon,
            designersWithTopColors: designersWithTopColors,
            colorsUniqueGroups: colorsUniqueGroups,
            colorsPerRegions: colorsPerRegions
          }
        }
      ]);
}());
