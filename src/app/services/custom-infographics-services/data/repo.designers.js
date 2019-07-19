(function () {
  'use strict';
  var serviceId = 'repo.designers';
  angular
    .module('app')
    .service(serviceId,
      ['data', 'common',
        function (dataContext, common) {

          var context = dataContext.context({
            controller: 'charts'
          });

          var $q = common.$q;

          function search(req) {
            var def = $q.defer();

            context.get('designers')
              .then(function (response) {
                def.resolve(response.result || response.data);
              }).catch(function () {
              var res = {};
              def.resolve(res);
            });

            return def.promise;
          }

          this.search = search;
        }
      ]);
}());
