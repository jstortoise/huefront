(function () {
  'use strict';
  var serviceId = 'repo.hue';
  angular
    .module('app')
    .service(serviceId,
      ['data', 'common',
        function (dataContext, common) {

          var context = dataContext.context({
            controller: 'charts'
          });

          var $q = common.$q;

          function colorGroupsByCityPeriod(req) {
            var region = regionToServer(req.region || 'all');
            var city = req.city || 'all';
            if (city !== 'all') {
              region = regionToServer('all');
            }
            var designer = req.designer || 'all';
            var category = req.category || 'all';
            var year = req.year || 'all';
            var season = req.season || 'all';

            return context.get('colorGroups',
              {id: region, id1: city, id2: designer, id3: year, id4: season, id5: category})
              .then(function (response) {
                return _.map(response.result, processColor);
              });
          }

          var regions = common.generic.regions;

          function citiesByRegion(region) {
            var r = _.find(regions, {id: region});
            return r ? _.clone(r.cities) : [];
          }

          function regionToServer(region) {
            var r = _.find(regions, {name: region});
            return r ? r.serverName : region;
          }

          function citiesByColorPeriod(req) {
            var color = req.color || 'all';
            var region = regionToServer(req.region || 'all');
            var year = req.year || 'all';
            var season = req.season || 'all';

            return context.get('cities',
              {id: color, id1: region, id2: year, id3: season})
              .then(function (response) {
                return response.result;
              });
          }

          function processColor(colorData) {
            colorData.color = colorData.name;
            return colorData;
          }

          function colorsByCityPeriod(req) {
            req = _.merge({}, req, {region: 'all'});
            return colorsByRegionCityPeriod(req);
          }

          function colorsByRegionPeriod(req) {
            req = _.defaults(_.merge({}, req), {region: 'all'});
            return colorsByRegionCityPeriod(req);
          }

          function colorsUniqueByRegionPeriod(req) {
            req = _.defaults(_.merge({}, req), {region: 'all'});
            return colorsUniqueByCityRegionPeriod(req);
          }

          function colorsByRegionCitiesPeriod(req) {
            var cities = citiesByRegion(req.region);

            return $q.all(_.map(cities, function (c) {
              var params = _.merge({}, req, {city: c.serverName || c.name, region: 'all'});
              return colorsByRegionCityPeriod(params)
                .then(function (response) {
                  return {
                    name: c.name,
                    data: response
                  };
                });
            }))/*.then(function(responses) {
             return _.map(responses,
             function(resp) {
             return resp.result;
             });
             })*/;
          }

          function designersWithTopColors(req, page, size) {
            var region = regionToServer(req.region || 'all');
            var city = req.city || 'all';
            var year = req.year || 'all';
            var season = req.season || 'all';
            size = size || 1800;

            return context.get('designersWithTopColors',
              {id: region, id1: city, id2: year, id3: season, page: page, pagesize: size})
              .then(function (response) {
                return _.map(response.result, processColor);
              });

          }

          function colorsByRegionCityPeriod(req) {
            var region = regionToServer(req.region || 'all');
            var city = req.city || 'all';
            if (city !== 'all') {
              region = regionToServer('all');
            }
            var designer = req.designer || 'all';
            var category = req.category || 'all';
            var year = req.year || 'all';
            var season = req.season || 'all';

            return context.get('colors',
              {id: region, id1: city, id2: designer, id3: year, id4: season, id5: category})
              .then(function (response) {
                return _.map(response.result, processColor);
              });

          }

          function colorsUniqueByCityRegionPeriod(req) {
            var region = regionToServer(req.region || 'all');
            var city = req.city || 'all';
            if (city !== 'all') {
              region = regionToServer('all');
            }
            var designer = req.designer || 'all';
            var category = req.category || 'all';
            var year = req.year || 'all';
            var season = req.season || 'all';

            var def = $q.defer();

            context.get('uniqueColors',
              {id: region, id1: city, id2: designer, id3: year, id4: season, id5: category})
              .then(function (response) {
                def.resolve(_.map(response.result, processColor));
              }).catch(function () {
              var res = _.map(_.range(50), function (k) {
                return {
                  color: '#ffaa88',
                  title: '#ffaa88'
                };
              });
              def.resolve(res);
            });

            return def.promise;
          }

          this.colorGroupsByCityPeriod = colorGroupsByCityPeriod;
          this.colorsByRegionCitiesPeriod = colorsByRegionCitiesPeriod;
          this.colorsByRegionCityPeriod = colorsByRegionCityPeriod;
          this.colorsByRegionPeriod = colorsByRegionPeriod;
          this.colorsUniqueByRegionPeriod = colorsUniqueByRegionPeriod;
          this.colorsByCityPeriod = colorsByCityPeriod;
          this.designersWithTopColors = designersWithTopColors;
          this.citiesByColorPeriod = citiesByColorPeriod;
        }
      ]);
}());
