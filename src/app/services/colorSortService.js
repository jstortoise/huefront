angular.module('app')
  .service('colorSortService', function () {
    return function (array, number) {
      var family = ['red', 'orange', 'yellow', 'yellow/green', 'green', 'cyan', 'blue', 'violet', 'magenta', 'brown', 'beige', 'gray', 'white', 'black'];
      var result = [];
      var tmpArray = [];
      array = array.slice(0, number);

      family.forEach(function (color) {
        tmpArray = array.filter(function (item) {
          return item.color.family.toLowerCase() === color;
        });
        if (tmpArray.length !== 0) {
          // tmpArray = _.sortBy(tmpArray, function (item) {
          //   return item.percentage;
          // });
          tmpArray.reverse().forEach(function (item) {
            result.push(item);
          });
        }
      });

      return result;
    };
  });
