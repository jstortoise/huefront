angular.module('app').service('dashboardService',
  ['searchMenuRepository',
    function (searchMenuRepository) {
      this.getHeaderSubtitle = function (season, year, category, showSeason, showYear, showCategory, callback) {
        searchMenuRepository.getMain(function (data) {
          var subtitle = '';

          if (showSeason) {
            subtitle += season ? _.find(data.seasons, function (item) {
                return item.id == season;
              }).short + ', ' : 'All Seasons, ';
          }

          if (showYear) {
            subtitle += year ? year + ', ' : 'All Years, ';
          }

          if (showCategory) {
            subtitle += category ? _.find(data.categories, function (item) {
              return item.id == category;
            }).title : 'All Categories';
          }

          if (!showCategory) {
            subtitle = subtitle.substring(0, subtitle.length - 2);
          }

          callback(subtitle);
        });
      };
    }]);
