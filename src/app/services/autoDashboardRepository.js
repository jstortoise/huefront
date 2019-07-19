angular.module('app').service('autoDashboardRepository',
  ['$http', 'appConfig', function (http, appConfig) {
    var callAutoDashboardService = function (name, module, id, params) {
      return http.get(appConfig.autoServiceUrl + name + '/' + module + '/' + id, {params: params})
        .then(function (data) {
          return data && data.data ? data.data : data;
        });
    };

    this.brand = {
      dashboardName: 'brand',
      getPageData: function (id) {
        return callAutoDashboardService(this.dashboardName, 'basic_data', id);
      },
      getColorFrequency: function (id) {
        return callAutoDashboardService(this.dashboardName, 'color_freq', id);
      },
      getTopColors: function (id) {
        return callAutoDashboardService(this.dashboardName, 'top_colors', id);
      },
      getColorPalette: function (id, bucket) {
        return callAutoDashboardService(this.dashboardName, 'palette', id, {bucket: bucket});
      },
      getTopFinishes: function (id) {
        return callAutoDashboardService(this.dashboardName, 'top_finishes', id);
      },
      getColorsCount: function (id) {
        return callAutoDashboardService(this.dashboardName, 'colors_count', id);
      },
      getShades: function (id) {
        return callAutoDashboardService(this.dashboardName, 'shades', id);
      },
      getCarColors: function (id) {
        return callAutoDashboardService(this.dashboardName, 'car_colors', id);
      }
    };

    this.model = {
      dashboardName: 'model',
      getPageData: function (id) {
        return callAutoDashboardService(this.dashboardName, 'basic_data', id);
      },
      getColorFrequency: function (id) {
        return callAutoDashboardService(this.dashboardName, 'color_freq', id);
      },
      getTopColors: function (id) {
        return callAutoDashboardService(this.dashboardName, 'top_colors', id);
      },
      getColorPalette: function (id, bucket) {
        return callAutoDashboardService(this.dashboardName, 'palette', id, {bucket: bucket});
      },
      getTopFinishes: function (id) {
        return callAutoDashboardService(this.dashboardName, 'top_finishes', id);
      },
      getCompare: function (id) {
        return callAutoDashboardService(this.dashboardName, 'compare', id);
      },
      getShades: function (id) {
        return callAutoDashboardService(this.dashboardName, 'shades', id);
      },
      getCarColors: function (id) {
        return callAutoDashboardService(this.dashboardName, 'car_colors', id);
      }
    };

    this.year = {
      dashboardName: 'year',
      getPageData: function (id) {
        return callAutoDashboardService(this.dashboardName, 'basic_data', id);
      },
      getColorFrequency: function (id) {
        return callAutoDashboardService(this.dashboardName, 'color_freq', id);
      },
      getTopColors: function (id) {
        return callAutoDashboardService(this.dashboardName, 'top_colors', id);
      },
      getColorPalette: function (id, bucket) {
        return callAutoDashboardService(this.dashboardName, 'palette', id, {bucket: bucket});
      },
      getTopFinishes: function (id) {
        return callAutoDashboardService(this.dashboardName, 'top_finishes', id);
      },
      getTopFamilies: function (id) {
        return callAutoDashboardService(this.dashboardName, 'top_families', id);
      },
      getCompare: function (id) {
        return callAutoDashboardService(this.dashboardName, 'compare', id);
      },
      getCarColors: function (id) {
        return callAutoDashboardService(this.dashboardName, 'car_colors', id);
      }
    };

    this.color = {
      dashboardName: 'color',
      getPageData: function (id) {
        return callAutoDashboardService(this.dashboardName, 'basic_data', id);
      },
      getColorFrequency: function (id) {
        return callAutoDashboardService(this.dashboardName, 'color_freq', id);
      },
      getTopColors: function (id) {
        return callAutoDashboardService(this.dashboardName, 'top_colors', id);
      },
      getColorPalette: function (id, bucket) {
        return callAutoDashboardService(this.dashboardName, 'palette', id, {bucket: bucket});
      },
      getTopFinishes: function (id) {
        return callAutoDashboardService(this.dashboardName, 'top_finishes', id);
      },
      getTopBrands: function (id) {
        return callAutoDashboardService(this.dashboardName, 'top_brands', id);
      },
      getCompare: function (id) {
        return callAutoDashboardService(this.dashboardName, 'compare', id);
      },
      getShades: function (id) {
        return callAutoDashboardService(this.dashboardName, 'shades', id);
      },
      getCarColors: function (id) {
        return callAutoDashboardService(this.dashboardName, 'car_colors', id);
      }
    };
  }]);
