angular.module('app').directive('hueDbMapExpanded', ['$timeout', 'searchMenuRepository', function (timeout, searchMenuRepository) {
  function link(scope, element, attrs) {
    scope.maps = null;

    var mainIsLoaded = false;
    var mapsToRender = null;
    var countries = null;
    var countriesInRegions = [];
    var selectedRegions = [];
    var americasRegion = [];

    var highlightGroup = function (group, color) {
      var c = group.children();
      var cc = c.length;

      if (color)
        for (var i = 0; i < cc; i++) {
          var e = c[i];
          e.style('fill', color);
          e.style('stroke', '#ccc');
          e.style('stroke-width', '2px');
        }
      else
        for (var i = 0; i < cc; i++) {
          var e = c[i];
          e.style('fill', null);
          e.style('stroke', null);
          e.style('stroke-width', null);
        }
    };

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

      var mapContainer = angular.element('.map-container', element).eq(mapIndex);
      var mapImage = angular.element('.map-image', mapContainer);
      var draw = SVG(mapContainer[0]);
      draw.svg(mapImage.html());
      draw.viewbox(0, 0, 1008, 651);
      draw.addClass('map-image');
      mapImage.remove();
      angular.element(draw.node).prependTo(mapContainer);

      var mapTilesGroup = _.find(draw.children(), function (item) {
        return item.children().length > 100;
      });

      var color = scope.maps[mapIndex].color;
      var companies = scope.maps[mapIndex].companies;
      var regions = _.filter(countriesInRegions, function (item) {
        return _.some(item.countries, function (countryItem) {
          return _.some(companies, function (company) {
            return company.country.id == countryItem.id;
          });
        });
      });

      _.each(regions, function (item, index) {
        var rGroup = draw.group();
        _.each(item.countries, function (countryItem) {
          var elemId = 'map_region_' + countryItem.code;
          var elem = _.find(mapTilesGroup.children(), function (item) {
            return item.node.id == elemId;
          });

          if (!elem)
            return;

          rGroup.add(elem);
        });

        if (item.id == 4) { //Americas
          americasRegion[mapIndex] = rGroup;
          highlightGroup(rGroup, color);
        } else {
          rGroup.on('mouseover', function (event) {
            if (selectedRegions[mapIndex] != rGroup)
              highlightGroup(rGroup, color);
          });

          rGroup.on('mouseout', function (event) {
            if (selectedRegions[mapIndex] != rGroup)
              highlightGroup(rGroup, null);
          });
        }

        var brandCount = _.reduce(
          _.filter(companies, function (companyItem) {
            return _.some(item.countries, function (countryItem) {
              return companyItem.country.id == countryItem.id;
            });
          }),
          function (memo, companyItem) {
            return memo + companyItem.brands_count;
          }, 0);
        var rGroupBbox = rGroup.node.getBoundingClientRect();
        rGroup.attr('title', item.name + ' (' + brandCount + ' brands)');
        angular.element(rGroup.node).tooltipster({
          animation: 'fade',
          theme: 'tooltipster-default',
          trigger: 'custom',
          position: 'top',
          offsetX: item.id == 4 ? Math.round(rGroupBbox.width / 2) - 25 : Math.round(rGroupBbox.width / 2),
          offsetY: -Math.round(rGroupBbox.height / 2)
        });
        rGroup.click(function (event) {
          var sr = selectedRegions[mapIndex];

          if (sr) {
            if (sr != americasRegion[mapIndex])
              highlightGroup(sr, null);

            angular.element(sr.node).tooltipster('hide');
          }

          if (sr == rGroup)
            selectedRegions[mapIndex] = null;
          else {
            selectedRegions[mapIndex] = rGroup;
            angular.element(rGroup.node).tooltipster('show');
          }
        });
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
    templateUrl: 'app/directives/dbMap/dbMapExpandedView.html',
    link: link,
    scope: {
      data: '=',
      toggleView: '&',
      hideMap: '=',
      evTitle: '@'
    }
  };
}]);
