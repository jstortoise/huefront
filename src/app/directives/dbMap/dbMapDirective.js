angular.module('app').directive('hueDbMap',
  ['$timeout', 'searchMenuRepository',
    function (timeout, searchMenuRepository) {
      function link(scope, element, attrs) {
        scope.maps = null;

        var mainIsLoaded = false;
        var mapsToRender = null;
        var countries = null;
        var countriesInRegions = [];
        var selectedRegions = [];
        var regionsBrandsCount = [];

        if (!scope.hideMap)
          searchMenuRepository.getControlsDataBranding().then(function (data) {
            countries = data.countries;

            var regGroups = _.groupBy(data.countries, function (item) {
              return item.region_id;
            });
            _.each(regGroups, function (item, key) {
              var parsedKey = parseInt(key);
              if (!isNaN(parsedKey))
                countriesInRegions.push({
                  id: parsedKey,
                  name: _.find(data.countries, function (ritem) {
                    return ritem.region_id == parsedKey;
                  }).region_name,
                  countries: _.map(item, function (citem) {
                    return {id: citem.id, code: citem.code};
                  })
                });
            });

            mainIsLoaded = true;
            if (mapsToRender != null)
              _.each(mapsToRender, function (item) {
                scope.mapLoaded(item);
              });
          });

        scope.mapLoaded = function (mapIndex) {
          if (scope.hideMap)
            return;

          if (!mainIsLoaded) {
            if (mapsToRender == null)
              mapsToRender = [];

            mapsToRender.push(mapIndex);
            return;
          }

          var mapImage = angular.element('.map-image', element).eq(mapIndex);
          var color = scope.maps[mapIndex].color;
          var companies = scope.maps[mapIndex].companies;
          var regions = _.filter(countriesInRegions, function (item) {
            return _.some(item.countries, function (countryItem) {
              return _.some(companies, function (company) {
                return company.country.id == countryItem.id;
              });
            });
          });

          regionsBrandsCount[mapIndex] = [];
          _.each(regions, function (item, index) {
            regionsBrandsCount[mapIndex][index] = _.reduce(
              _.filter(companies, function (companyItem) {
                return _.some(item.countries, function (countryItem) {
                  return companyItem.country.id == countryItem.id;
                });
              }),
              function (memo, companyItem) {
                return memo + companyItem.brands_count;
              }, 0);

            var regionCountryElems = [];
            _.each(item.countries, function (countryItem) {
              var elem = angular.element('#map_region_' + countryItem.code, mapImage);

              if (!elem.length)
                return;

              regionCountryElems.push(elem);

              elem.css('fill', color);
              elem.css('stroke', '#ccc');
              elem.css('stroke-width', '2px');
            });
          });

          mapImage.click(function (event) {
            if (event.target.id && event.target.id.indexOf('map_region_') != -1) {
              var ccode = event.target.id.slice(-2);
              var region = _.find(regions, function (item) {
                return _.some(item.countries, function (citem) {
                  return citem.code == ccode;
                });
              })

              if (region) {
                if (typeof selectedRegions[mapIndex] == 'number')
                  mapImage.tooltipster('destroy');

                if (selectedRegions[mapIndex] != region.id) {
                  selectedRegions[mapIndex] = region.id;
                  mapImage.attr('title', region.name + ' (' + regionsBrandsCount[mapIndex][regions.indexOf(region)] + ' brands)');
                  mapImage.tooltipster({
                    animation: 'fade',
                    theme: 'tooltipster-default',
                    trigger: 'custom',
                    position: 'top-left',
                    offsetX: event.offsetX - 15,
                    offsetY: -event.offsetY
                  });
                  mapImage.tooltipster('show');
                } else
                  selectedRegions[mapIndex] = null;
              }
            }
          });
        };

        scope.$watch('data', function (newValue, oldValue) {
          if (newValue && newValue.length)
            scope.maps = _.map(newValue, function (item) {
              return {
                companies: item.companies,
                color: item.color.color.hex,
                title: item.color.title,
                attributes: item.attributes
              };
            });
        });
      }

      return {
        restrict: 'E',
        templateUrl: 'app/directives/dbMap/dbMapView.html',
        link: link,
        scope: {
          data: '=',
          hideMap: '='
        }
      };
    }]);
