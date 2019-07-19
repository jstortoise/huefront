angular.module('app').service('brandingDashboardRepository',
  ['$http', 'appConfig', function (http, appConfig) {
    var callBrandingDashboardService = function (name, module, id, params) {
      return http.get(appConfig.brandingServiceUrl + name + '/' + module + '/' + id, {params: params})
        .then(function (data) {
          return data && data.data ? data.data : data;
        });
    };

    this.brand = {
      dashboardName: 'company',
      getPageData: function (companyId) {
        return callBrandingDashboardService(this.dashboardName, 'basic_data', companyId);
      },
      getLogoColors: function (companyId) {
        return callBrandingDashboardService(this.dashboardName, 'top_logo_colors', companyId);
      },
      getTopColors: function (companyId) {
        return callBrandingDashboardService(this.dashboardName, 'top_colors', companyId);
      },
      getColorFrequency: function (companyId) {
        return callBrandingDashboardService(this.dashboardName, 'color_freq', companyId);
      },
      getLogos: function (companyId) {
        return callBrandingDashboardService(this.dashboardName, 'logo_colors', companyId);
      },
      getColorAttributes: function (companyId) {
        return callBrandingDashboardService(this.dashboardName, 'color_attrs', companyId);
      },
      getMaps: function (companyId) {
        return callBrandingDashboardService(this.dashboardName, 'maps', companyId);
      },
      getColorCount: function (companyId) {
        return callBrandingDashboardService(this.dashboardName, 'color_count', companyId);
      }
    };

    this.industry = {
      dashboardName: 'industry',
      getPageData: function (industryId) {
        return callBrandingDashboardService(this.dashboardName, 'basic_data', industryId);
      },
      getTopColors: function (industryId) {
        return callBrandingDashboardService(this.dashboardName, 'top_colors', industryId);
      },
      getColorFrequency: function (industryId) {
        return callBrandingDashboardService(this.dashboardName, 'color_freq', industryId);
      },
      getColorAttributes: function (industryId) {
        return callBrandingDashboardService(this.dashboardName, 'color_attrs', industryId);
      },
      getLogos: function (industryId) {
        return callBrandingDashboardService(this.dashboardName, 'logo_colors', industryId);
      },
      getMaps: function (industryId) {
        return callBrandingDashboardService(this.dashboardName, 'maps', industryId);
      },
      getColorPalette: function (industryId, bucket) {
        return callBrandingDashboardService(this.dashboardName, 'palette', industryId, {bucket: bucket});
      },
      getColorCount: function (industryId) {
        return callBrandingDashboardService(this.dashboardName, 'color_count', industryId);
      }
    };

    this.attribute = {
      dashboardName: 'attribute',
      getPageData: function (attributeId) {
        return callBrandingDashboardService(this.dashboardName, 'basic_data', attributeId);
      },
      getTopColors: function (attributeId) {
        return callBrandingDashboardService(this.dashboardName, 'top_colors', attributeId);
      },
      getColorFrequency: function (attributeId) {
        return callBrandingDashboardService(this.dashboardName, 'color_freq', attributeId);
      },
      getColorCombinations: function (attributeId) {
        return callBrandingDashboardService(this.dashboardName, 'color_combinations', attributeId);
      },
      getLogos: function (attributeId) {
        return callBrandingDashboardService(this.dashboardName, 'logo_colors', attributeId);
      },
      getTopIndustries: function (attributeId) {
        return callBrandingDashboardService(this.dashboardName, 'top_industries', attributeId);
      },
      getMaps: function (attributeId) {
        return callBrandingDashboardService(this.dashboardName, 'maps', attributeId);
      },
      getColorPalette: function (attributeId, bucket) {
        return callBrandingDashboardService(this.dashboardName, 'palette', attributeId, {bucket: bucket});
      },
      getColorCount: function (attributeId) {
        return callBrandingDashboardService(this.dashboardName, 'color_count', attributeId);
      }
    };

    this.color = {
      dashboardName: 'color',
      getPageData: function (colorId, attributeId, companyId, industryId) {
        return callBrandingDashboardService(this.dashboardName, 'basic_data', colorId, {
          attribute_id: attributeId,
          company_id: companyId,
          industry_id: industryId
        });
      },
      getTopColors: function (colorId, attributeId, companyId, industryId) {
        return callBrandingDashboardService(this.dashboardName, 'top_colors', colorId, {
          attribute_id: attributeId,
          company_id: companyId,
          industry_id: industryId
        });
      },
      getTopIndustries: function (colorId, attributeId, companyId, industryId) {
        return callBrandingDashboardService(this.dashboardName, 'top_industries', colorId, {
          attribute_id: attributeId,
          company_id: companyId,
          industry_id: industryId
        });
      },
      getColorFrequency: function (colorId, attributeId, companyId, industryId) {
        return callBrandingDashboardService(this.dashboardName, 'color_freq', colorId, {
          attribute_id: attributeId,
          company_id: companyId,
          industry_id: industryId
        });
      },
      getLogos: function (colorId, attributeId, companyId, industryId) {
        return callBrandingDashboardService(this.dashboardName, 'logo_colors', colorId, {
          attribute_id: attributeId,
          company_id: companyId,
          industry_id: industryId
        });
      },
      getMaps: function (colorId, attributeId, companyId, industryId) {
        return callBrandingDashboardService(this.dashboardName, 'maps', colorId, {
          attribute_id: attributeId,
          company_id: companyId,
          industry_id: industryId
        });
      },
      getColorCount: function (colorId) {
        return callBrandingDashboardService(this.dashboardName, 'color_count', colorId);
      }
    };



    this.country = {
      dashboardName: 'country',
      getPageData: function (countryId) {
        return callBrandingDashboardService(this.dashboardName, 'basic_data', countryId);
      },
      getTopColors: function (countryId) {
        return callBrandingDashboardService(this.dashboardName, 'top_colors', countryId);
      },
      getTopIndustries: function (countryId) {
        return callBrandingDashboardService(this.dashboardName, 'top_industries', countryId);
      },
      getColorFrequency: function (countryId) {
        return callBrandingDashboardService(this.dashboardName, 'color_freq', countryId);
      },
      getColorCombinations: function (countryId) {
        return callBrandingDashboardService(this.dashboardName, 'color_combinations', countryId);
      },
      getLogos: function (countryId) {
        return callBrandingDashboardService(this.dashboardName, 'logo_colors', countryId);
      },
      getMaps: function (countryId) {
        return callBrandingDashboardService(this.dashboardName, 'maps', countryId);
      },
      getColorPalette: function (countryId, bucket) {
        return callBrandingDashboardService(this.dashboardName, 'palette', countryId, {bucket: bucket});
      },
      getFlag: function (countryId) {
        return callBrandingDashboardService(this.dashboardName, 'flag', countryId);
      },
      getColorCount: function (countryId) {
        return callBrandingDashboardService(this.dashboardName, 'color_count', countryId);
      }
    };
  }]);
