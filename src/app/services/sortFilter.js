angular.module('app')
  .filter('sortFilter', [
    function () {
      return function (array, search) {
        if (!_.isUndefined(array) && !_.isUndefined(search)) {
          var matches = [];
          for (var i = 0; i < array.length; i++) {
            if (array[i].title.toUpperCase().indexOf(search.toUpperCase()) === 0 &&
              search.length <= array[i].title.length) {
              matches.push(array[i]);
            }
          }
          return matches;
        }
      };
    }]);

