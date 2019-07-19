(function () {
  'use strict';
  var serviceId = 'repo.meta';
  angular
    .module('app')
    .service(serviceId,
      ['data', 'common',
        function (dataContext, common) {
          var context = dataContext.context({
            controller: 'charts'
          });

          var $q = common.$q;

          function objects(req) {
            var def = $q.defer();
            context.get('objects')
              .then(function (response) {
                var categories = (response.result || response.data).categories;
                // _.each(categories.cities, function (c) {
                //     var regionName = (c.region || '').toLowerCase();
                //     var region = _.find(common.generic.regions, {serverName: regionName});
                //     if (region) {
                //       c.region = region.name;
                //     }
                //   });
                def.resolve(categories);
              }).catch(function () {
              var res = {};
              def.resolve(res);
            });

            return def.promise;
          }

          this.objects = objects;
        }
      ]);
}());
