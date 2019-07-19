angular.module('app').service('searchMenuRepository',
  function ($http, $q, appConfig, authService) {
    var self = this;
    var cachedMain = null;
    var cachedMainDeffered = null;
    this.cachedMainBranding = null;
    this.cachedMainLegal = null;
    this.cachedMainAuto = null;
    this.cachedMainFashion = null;

    var getMainNoParams = function (callback) {
      if (cachedMain) {
        callback(cachedMain);
      } else if (cachedMainDeffered == null) {
        cachedMainDeffered = $q.defer();
        cachedMainDeffered.promise.then(function (data) {
          callback(data);
        });

        return $http.get(appConfig.webServiceUrl + 'main.json', {params: {token: authService.token}})
          .then(function (data) {
            cachedMain = data.data;
            cachedMainDeffered.resolve(data.data);
            return data.data;
          });
      } else {
        cachedMainDeffered.promise.then(function (data) {
          callback(data);
        });
      }
    };

    var getMainWithParams = function () {
      var params = {token: authService.token};

      var mainParams = appConfig.repositories.mainParams;
      var count = mainParams.length;
      for (var i = 0; i < count; i++) {
        if (arguments[i] != null && arguments[i] != undefined) {
          params[mainParams[i]] = arguments[i];
        }
      }

      // $http.get(appConfig.webServiceUrl + 'main.json', {params: params})
      //   .then(arguments[arguments.length - 1]);
      return $http.get(appConfig.webServiceUrl + 'main.json', {params: params}).then(function (data) {
        return data.data;
      });
    };

    this.getControlsData = function (params, ignoreCache) {
      return $q(function (resolve, reject) {
        if (self.cachedMainFashion !== null && !ignoreCache) {
          return resolve(self.cachedMainFashion);
        }

        $http.get(appConfig.webServiceUrl + 'main.json', {params: params})
          .then(function (data) {
            self.cachedMainFashion = data.data;
            angular.forEach(data.data, function (item, key) {
              var upperKey = key.toUpperCase();
              if (key !== 'tooltips') {
                item.unshift({title: upperKey + ' (All)', id: ''})
              }
            });
            return resolve(data.data);
          });
      });
    };

    this.getControlsDataAuto = function (params) {
      return $q(function (resolve, reject) {
        if (self.cachedMainAuto !== null) {
          return resolve(self.cachedMainAuto);
        }

        $http.get(appConfig.autoServiceUrl + 'main.json', {params: params})
          .then(function (data) {
            self.cachedMainAuto = data.data;
            angular.forEach(data.data, function (item, key) {
              var upperKey = key.toUpperCase();
              if (key !== 'tooltips' && key !== 'manufacturers') {
                item.unshift({title: upperKey + ' (All)', id: ''})
              } else if (key === 'manufacturers') {
                item.unshift({title: 'BRANDS (All)', id: ''})
              }
            });
            return resolve(data.data);
          });
      });
    };

    this.getControlsDataLegal = function (params) {
      return $q(function (resolve, reject) {
        if (self.cachedMainLegal !== null) {
          return resolve(self.cachedMainLegal);
        }

        $http.get(appConfig.legalServiceUrl + 'main.json', {params: params})
          .then(function (data) {
            self.cachedMainLegal = data.data;
            angular.forEach(data.data, function (item, key) {
              var upperKey = key.toUpperCase();
              if (key !== 'tooltips' && key !== 'manufacturers') {
                item.unshift({title: upperKey + ' (All)', id: ''})
              } else if (key === 'manufacturers') {
                item.unshift({title: 'BRANDS (All)', id: ''})
              }
            });
            return resolve(data.data);
          });
      });
    };

    this.getControlsDataBranding = function (params) {
      return $q(function (resolve, reject) {
        
        $http.get(appConfig.brandingServiceUrl + 'main.json', {params: params})
          .then(function (data) {
            self.cachedMainBranding = data.data;
            angular.forEach(data.data, function (item, key) {
              var upperKey = key.toUpperCase();
              if (key !== 'tooltips' && key !== 'manufacturers') {
                item.unshift({title: upperKey + ' (All)', id: ''})
              } else if (key === 'manufacturers') {
                item.unshift({title: 'BRANDS (All)', id: ''})
              }
            });
            return resolve(data.data);
          });
      });
    };

    this.getControlsDataBrandingBind = function (control,id,params) {
      return $q(function (resolve, reject) {
        
        $http.get(appConfig.brandingServiceUrl + control + '/logo_colors_search/' + id + '.json', {params: params})
          .then(function (data) {
            return resolve(data.data);
          });
      });
    };

    this.getControlsDataBrandingChart = function (detailcontrol,params) {
      return $q(function (resolve, reject) {
        
        $http.get(appConfig.brandingServiceUrl + detailcontrol + '/top_colors/' + id + '.json', {params: params})
          .then(function (data) {
            return resolve(data.data);
          });
      });
    };

    this.getMain = function () {
      var lastArgIndex = arguments.length - 1;

      if (_.isFunction(arguments[0])) {
        getMainNoParams(arguments[0]);
      } else if (_.isFunction(arguments[lastArgIndex]) && _.every(arguments, function (item, index) {
          return item == null || index == lastArgIndex;
        })) {
        getMainNoParams(arguments[lastArgIndex]);
      } else {
        return getMainWithParams.apply(this, arguments);
      }
    };
  });
