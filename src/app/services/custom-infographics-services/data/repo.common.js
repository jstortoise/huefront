(function () {
  'use strict';
  var serviceId = 'repo.common';
  angular
    .module('app')
    .service(serviceId,
      [
        'data', 'common',
        function (dataContext, common) {

          var context = dataContext.context({
            controller: 'common'
          });

          var $q = common.$q;

          function getTestData(dataRequest) {

            var def = $q.defer();
            def.resolve({data: dataRequest || 'ok'});
            return def.promise;
            return context.get('titles', {s: search, t: type})
              .then(function (result) {
                return result.data;
              });
          }

          /*function getTitles(search, type) {
           return context.get('titles', {s: search, t: type})
           .then(function(result) {
           return result.data;
           });
           }

           function getCategories() {
           return context.get('categories')
           .then(function(result) {
           return result.data;
           });
           }

           function getManufacturers(search) {
           return context.get('manufacturers', { s: search})
           .then(function(result) {
           return result.data;
           });
           }

           function getDistributors(search) {
           return context.get('distributors', { s: search})
           .then(function(result) {
           return result.data;
           });
           }

           function requestGeneralQuestion(email, name, question) {
           return context.save('requestGeneralQuestion', {
           email: email, name: name, question: question
           })
           .then(function (result) {
           return result.data;
           })
           .catch(function (e) {
           return $q.reject(e);
           });
           }

           this.getCategories = getCategories;
           this.getTitles = getTitles;

           this.getManufacturers = getManufacturers;
           this.getDistributors = getDistributors;

           this.requestGeneralQuestion = requestGeneralQuestion;*/

          this.testData = getTestData;
        }
      ]);
}());
