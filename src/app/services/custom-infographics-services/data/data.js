(function () {
  'use strict';

  var serviceId = 'data';
  var apiRootUrl = 'https://huedata-fashion.herokuapp.com/api/';
  // var apiRootUrl = 'http://localhost:5000/api/?remoteUrl=/';
  angular.module('app').factory(serviceId,
    [
      '$resource', 'common',
      function ($resource, common) {
        var resource = $resource(apiRootUrl + ':controller/:action/:id/:id1/:id2/:id3/:id4/:id5/:id6/:id7/:id8',
          {action: '@action', controller: '@controller'},
          {'put': {method: 'PUT', isArray: false, headers: {'Content-Type': 'application/json'}}},
          {'get': {method: 'GET', isArray: false, headers: {'Content-Type': 'application/json'}}},
          {'post': {method: 'POST', isArray: false, headers: {'Content-Type': 'application/json'}}},
          {'delete': {method: 'DELETE', isArray: false, headers: {'Content-Type': 'application/json'}}}
        );

        var $q = common.$q;

        function processContextAction() {
          var resourceMethod = arguments[0];
          var settings = arguments[1];
          var requestParams = arguments[2];
          var data = arguments[3];

          var params = [];

          var action = typeof (requestParams) === 'string'
            ? {action: requestParams}
            : requestParams;

          action.controller = action.controller || settings.controller;

          var def = $q.defer();

          params.push(action);
          if (data)
            params.push(data);

          resourceMethod.apply(resource, params)
            .$promise
            .then(function (result) {
                def.resolve(result);
              },
              function (e) {
                processRequestError(e);
                def.reject(e);
              });

          return def.promise;
        }

        function processRequestError(error) {
          console.log(error);
        }

        var context = function (settings) {
          var result = {
            save: function () {
              var params = [resource.save, settings || {}];
              params.push.apply(params, arguments);
              return processContextAction.apply(this, params);
            },
            get: function () {
              var params = [resource.get, settings];
              var requestDataParams = arguments[1] || {};
              requestDataParams.action = arguments[0];
//                    $.extend(requestDataParams, settings);
              params.push(requestDataParams);
              return processContextAction.apply(this, params);
            }
          };

          return result;
        };

        var service = {
          resource: resource,
          context: context
        };

        function init() {

        }

        init();

        return service;
      }]);
}());
