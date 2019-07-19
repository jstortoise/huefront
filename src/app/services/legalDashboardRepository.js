angular.module('app').service('legalDashboardRepository',
  ['$http', 'appConfig', function (http, appConfig) {
    var callLegalDashboardService = function (name, module, id, params) {
      return http.get(appConfig.legalServiceUrl + name + '/' + module + '/' + id, {params: params})
        .then(function (data) {
          return data && data.data ? data.data : data;
        });
    };

    this.product = {
      dashboardName: 'product',
      getPageData: function (id) {
        return callLegalDashboardService(this.dashboardName, 'basic_data', id);
      },
      getCopyrightsCount: function (id) {
        return callLegalDashboardService(this.dashboardName, 'copyrights_count', id);
      },
      getCopyrightsList: function (id, copyrightsListPage) {
        return callLegalDashboardService(this.dashboardName, 'copyrights_list', id, {page: copyrightsListPage});
      },
      getTopOwners: function (id) {
        return callLegalDashboardService(this.dashboardName, 'top_owners', id);
      }
    };

    this.owner = {
      dashboardName: 'owner',
      getPageData: function (id) {
        return callLegalDashboardService(this.dashboardName, 'basic_data', id);
      },
      getCopyrightsCount: function (id) {
        return callLegalDashboardService(this.dashboardName, 'copyrights_count', id);
      },
      getCopyrightsList: function (id, copyrightsListPage) {
        return callLegalDashboardService(this.dashboardName, 'copyrights_list', id, {page: copyrightsListPage});
      }
    };

    this.year = {
      dashboardName: 'year',
      getPageData: function (id) {
        return callLegalDashboardService(this.dashboardName, 'basic_data', id);
      },
      getCopyrightsCount: function (id) {
        return callLegalDashboardService(this.dashboardName, 'copyrights_count', id);
      },
      getCopyrightsList: function (id, copyrightsListPage) {
        return callLegalDashboardService(this.dashboardName, 'copyrights_list', id, {page: copyrightsListPage});
      },
      getTopOwners: function (id) {
        return callLegalDashboardService(this.dashboardName, 'top_owners', id);
      },
      getCopyrightsActivity: function (id) {
        return callLegalDashboardService(this.dashboardName, 'copyrights_activity', id);
      }
    };

    this.color = {
      dashboardName: 'color',
      getPageData: function (id) {
        return callLegalDashboardService(this.dashboardName, 'basic_data', id);
      },
      getTopProducts: function (id) {
        return callLegalDashboardService(this.dashboardName, 'top_products', id);
      },
      getTopProductsCopyrights: function (id) {
        return callLegalDashboardService(this.dashboardName, 'top_products_copyrights', id);
      },
      getCopyrightsOverTime: function (id, period) {
        return callLegalDashboardService(this.dashboardName, 'copyrights_over_time', id, {period: period});
      },
      getTopOwners: function (id) {
        return callLegalDashboardService(this.dashboardName, 'top_owners', id);
      },
      getCopyrightsList: function (id, copyrightsListPage) {
        return callLegalDashboardService(this.dashboardName, 'copyrights_list', id, {page: copyrightsListPage});
      }
    };
  }]);
