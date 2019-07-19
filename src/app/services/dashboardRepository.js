angular.module('app').service('dashboardRepository',
  ['$http', 'appConfig', 'authService', function (http, appConfig, authService) {

    var callDashboardService = function (name, module, id, callback, params) {
      // var validatedParams = {token: authService.token};
      var validatedParams = {};

      if (params != null) {
        for (p in params) {
          var pVal = params[p];
          if (pVal != null && pVal != undefined && pVal != '') {
            validatedParams[p] = pVal;
          }
        }
      }

      return http.get(appConfig.webServiceUrl + name + '/' + module + '/' + id, { params: validatedParams })
        .then(function (data) {
          return data && data.data ? data.data : data;
        });
    };

    var callAutoDashboardService = function (name, module, id, params) {
      return http.get(appConfig.autoServiceUrl + name + '/' + module + '/' + id, { params: params })
        .then(function (data) {
          return data && data.data ? data.data : data;
        });
    };
    // this.test = {
    //   dashboardName: 'test',
    //   getPageData: function (seasonId, params, callback) {
    //     return callDashboardService(this.dashboardName, 'page_data', seasonId, callback, params);
    //   },

    //   getTopColors: function (seasonId, params, callback) {
    //     return callDashboardService(this.dashboardName, 'top_colors', seasonId, callback, params);
    //   },

    //   getColorFrequency: function (seasonId, params, callback) {
    //     return callDashboardService(this.dashboardName, 'color_freq', seasonId, callback, params);
    //   },

    //   getDistributionByCategory: function (seasonId, params, callback) {
    //     return callDashboardService(this.dashboardName, 'distribution_category', seasonId, callback, params);
    //   },

    //   getColorFrequencyByCity: function (seasonId, params, callback) {
    //     return callDashboardService(this.dashboardName, 'color_freq_city', seasonId, callback, params);
    //   },

    //   getColorFrequencyByRegion: function (seasonId, params, callback) {
    //     return callDashboardService(this.dashboardName, 'color_freq_region', seasonId, callback, params);
    //   },

    //   getTopColorsByYear: function (seasonId, params, callback) {
    //     return callDashboardService(this.dashboardName, 'top_colors_year', seasonId, callback, params);
    //   },

    //   getDesignerImages: function (seasonId, params, callback) {
    //     return callDashboardService(this.dashboardName, 'designer_images', seasonId, callback, params);
    //   },

    //   getColorPalette: function (seasonId, params, bucket, callback) {
    //     var newParams = Object.assign({}, params);
    //     newParams.bucket = bucket;
    //     return callDashboardService(this.dashboardName, 'palette', seasonId, callback, newParams);
    //   },

    //   getColorFrequencyBySeason: function (colorId, params, callback) {
    //     return callDashboardService(this.dashboardName, 'color_freq_season', colorId, callback, params);
    //   }
    // };

    this.season = {
      dashboardName: 'season',
      getPageData: function (seasonId, params, callback) {
        return callDashboardService(this.dashboardName, 'page_data', seasonId, callback, params);
      },

      getTopColors: function (seasonId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors', seasonId, callback, params);
      },

      getColorFrequency: function (seasonId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq', seasonId, callback, params);
      },

      getDistributionByCategory: function (seasonId, params, callback) {
        return callDashboardService(this.dashboardName, 'distribution_category', seasonId, callback, params);
      },

      getColorFrequencyByCity: function (seasonId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_city', seasonId, callback, params);
      },

      getColorFrequencyByRegion: function (seasonId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_region', seasonId, callback, params);
      },

      getTopColorsByYear: function (seasonId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors_year', seasonId, callback, params);
      },

      getDesignerImages: function (seasonId, params, callback) {
        return callDashboardService(this.dashboardName, 'designer_images', seasonId, callback, params);
      },

      getColorPalette: function (seasonId, params, bucket, callback) {
        var newParams = Object.assign({}, params);
        newParams.bucket = bucket;
        return callDashboardService(this.dashboardName, 'palette', seasonId, callback, newParams);
      },

      getColorFrequencyBySeason: function (colorId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_season', colorId, callback, params);
      }
    };

    this.color = {
      dashboardName: 'color',
      getPageData: function (colorId, params, callback) {
        return callDashboardService(this.dashboardName, 'page_data', colorId, callback, params);
      },
      getTopColors: function (colorId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors', colorId, callback, params);
      },
      getColorFrequencyByCategory: function (colorId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_category', colorId, callback, params);
      },
      getColorFrequencyByCity: function (colorId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_city', colorId, callback, params);
      },
      getColorFrequencyBySeason: function (colorId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_season', colorId, callback, params);
      },
      getColorFrequencyByRegion: function (colorId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_region', colorId, callback, params);
      },
      getTopColorsByYear: function (colorId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors_year', colorId, callback, params);
      },
      getDesignerImages: function (colorId, params, callback) {
        return callDashboardService(this.dashboardName, 'designer_images', colorId, callback, params);
      },
      getColorPalette: function (colorId, params, bucket, callback) {
        var newParams = Object.assign({}, params);
        newParams.bucket = bucket;
        return callDashboardService(this.dashboardName, 'palette', colorId, callback, newParams);
      }
    };

    this.year = {
      dashboardName: 'year',
      getPageData: function (yearId, params, callback) {
        return callDashboardService(this.dashboardName, 'page_data', yearId, callback, params);
      },
      getTopColors: function (yearId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors', yearId, callback, params);
      },
      getColorFrequency: function (yearId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq', yearId, callback, params);
      },
      getDistributionByCategory: function (yearId, params, callback) {
        return callDashboardService(this.dashboardName, 'distribution_category', yearId, callback, params);
      },
      getColorFrequencyByCity: function (yearId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_city', yearId, callback, params);
      },
      getColorFrequencyBySeason: function (yearId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_season', yearId, callback, params);
      },
      getColorFrequencyByRegion: function (yearId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_region', yearId, callback, params);
      },
      getTopColorsByYear: function (yearId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors_year', yearId, callback, params);
      },
      getDesignerImages: function (yearId, params, callback) {
        return callDashboardService(this.dashboardName, 'designer_images', yearId, callback, params);
      },
      getColorPalette: function (yearId, params, bucket, callback) {
        var newParams = Object.assign({}, params);
        newParams.bucket = bucket;
        return callDashboardService(this.dashboardName, 'palette', yearId, callback, newParams);
      }
    };

    this.designer = {
      dashboardName: 'designer',
      getPageData: function (designerId, params, callback) {
        return callDashboardService(this.dashboardName, 'page_data', designerId, callback, params);
      },
      getTopColors: function (designerId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors', designerId, callback, params);
      },
      getColorFrequency: function (designerId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq', designerId, callback, params);
      },
      getDistributionByCategory: function (designerId, params, callback) {
        return callDashboardService(this.dashboardName, 'distribution_category', designerId, callback, params);
      },
      getColorFrequencyByCity: function (designerId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_city', designerId, callback, params);
      },
      getColorFrequencyBySeason: function (designerId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_season', designerId, callback, params);
      },
      getColorFrequencyByRegion: function (designerId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_region', designerId, callback, params);
      },
      getTopColorsByYear: function (designerId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors_year', designerId, callback, params);
      },
      getDesignerImages: function (designerId, params, cityId, regionId, colorId, callback) {
        return callDashboardService(this.dashboardName, 'designer_images', designerId, callback, params);
      },
      getColorPalette: function (designerId, params, bucket, callback) {
        var newParams = Object.assign({}, params);
        newParams.bucket = bucket;
        return callDashboardService(this.dashboardName, 'palette', designerId, callback, newParams);
      }
    };

    this.region = {
      dashboardName: 'region',
      getPageData: function (regionId, params, callback) {
        return callDashboardService(this.dashboardName, 'page_data', regionId, callback, params);
      },
      getTopColors: function (regionId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors', regionId, callback, params);
      },
      getColorFrequency: function (regionId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq', regionId, callback, params);
      },
      getDistributionByCategory: function (regionId, params, callback) {
        return callDashboardService(this.dashboardName, 'distribution_category', regionId, callback, params);
      },
      getColorFrequencyByCity: function (regionId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_city', regionId, callback, params);
      },
      getColorFrequencyBySeason: function (regionId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_season', regionId, callback, params);
      },
      getColorFrequencyByRegion: function (regionId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_region', regionId, callback, params);
      },
      getTopColorsByYear: function (regionId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors_year', regionId, callback, params);
      },
      getDesignerImages: function (regionId, params, callback) {
        return callDashboardService(this.dashboardName, 'designer_images', regionId, callback, params);
      },
      getColorPalette: function (regionId, params, bucket, callback) {
        var newParams = Object.assign({}, params);
        newParams.bucket = bucket;
        return callDashboardService(this.dashboardName, 'palette', regionId, callback, newParams);
      }
    };

    this.city = {
      dashboardName: 'city',
      getPageData: function (cityId, params, callback) {
        return callDashboardService(this.dashboardName, 'page_data', cityId, callback, params);
      },
      getTopColors: function (cityId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors', cityId, callback, params);
      },
      getColorFrequency: function (cityId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq', cityId, callback, params);
      },
      getDistributionByCategory: function (cityId, params, callback) {
        return callDashboardService(this.dashboardName, 'distribution_category', cityId, callback, params);
      },
      getColorFrequencyBySeason: function (cityId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_season', cityId, callback, params);
      },
      getColorFrequencyByRegion: function (cityId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_region', cityId, callback, params);
      },
      getTopColorsByYear: function (cityId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors_year', cityId, callback, params);
      },
      getDesignerImages: function (cityId, params, callback) {
        return callDashboardService(this.dashboardName, 'designer_images', cityId, callback, params);
      },
      getColorPalette: function (cityId, params, bucket, callback) {
        var newParams = Object.assign({}, params);
        newParams.bucket = bucket;
        return callDashboardService(this.dashboardName, 'palette', cityId, callback, newParams);
      }
    };

    this.category = {
      dashboardName: 'category',
      getPageData: function (categoryId, params, callback) {
        return callDashboardService(this.dashboardName, 'page_data', categoryId, callback, params);
      },
      getTopColors: function (categoryId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors', categoryId, callback, params);
      },
      getColorFrequency: function (categoryId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq', categoryId, callback, params);
      },
      getColorFrequencyByCity: function (categoryId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_city', categoryId, callback, params);
      },
      getColorFrequencyBySeason: function (categoryId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_season', categoryId, callback, params);
      },
      getColorFrequencyByRegion: function (categoryId, params, callback) {
        return callDashboardService(this.dashboardName, 'color_freq_region', categoryId, callback, params);
      },
      getTopColorsByYear: function (categoryId, params, callback) {
        return callDashboardService(this.dashboardName, 'top_colors_year', categoryId, callback, params);
      },
      getDesignerImages: function (categoryId, params, callback) {
        return callDashboardService(this.dashboardName, 'designer_images', categoryId, callback, params);
      },
      getColorPalette: function (categoryId, params, bucket, callback) {
        var newParams = Object.assign({}, params);
        newParams.bucket = bucket;
        return callDashboardService(this.dashboardName, 'palette', categoryId, callback, newParams);
      }
    };
    //
    // this.brand = {
    //   dashboardName: 'brand',
    //   getPageData: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'basic_data', id);
    //   },
    //   getColorFrequency: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'color_freq', id);
    //   },
    //   getTopColors: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'top_colors', id);
    //   },
    //   getColorPalette: function (id, bucket) {
    //     return callAutoDashboardService(this.dashboardName, 'palette', id, {bucket: bucket});
    //   },
    //   getTopFinishes: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'top_finishes', id);
    //   },
    //   getColorsCount: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'colors_count', id);
    //   },
    //   getShades: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'shades', id);
    //   },
    //   getCarColors: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'car_colors', id);
    //   }
    // };
    //
    // this.model = {
    //   dashboardName: 'model',
    //   getPageData: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'basic_data', id);
    //   },
    //   getColorFrequency: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'color_freq', id);
    //   },
    //   getTopColors: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'top_colors', id);
    //   },
    //   getColorPalette: function (id, bucket) {
    //     return callAutoDashboardService(this.dashboardName, 'palette', id, {bucket: bucket});
    //   },
    //   getTopFinishes: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'top_finishes', id);
    //   },
    //   getCompare: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'compare', id);
    //   },
    //   getShades: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'shades', id);
    //   },
    //   getCarColors: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'car_colors', id);
    //   }
    // };
    //
    // this.year = {
    //   dashboardName: 'year',
    //   getPageData: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'basic_data', id);
    //   },
    //   getColorFrequency: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'color_freq', id);
    //   },
    //   getTopColors: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'top_colors', id);
    //   },
    //   getColorPalette: function (id, bucket, callback) {
    //     return callAutoDashboardService(this.dashboardName, 'palette', id, callback, {bucket: bucket});
    //   },
    //   getTopFinishes: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'top_finishes', id);
    //   },
    //   getTopFamilies: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'top_families', id);
    //   },
    //   getCompare: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'compare', id);
    //   },
    //   getCarColors: function (id) {
    //     return callAutoDashboardService(this.dashboardName, 'car_colors', id);
    //   }
    // };
  }]);
