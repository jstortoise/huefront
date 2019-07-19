angular.module('app').service('reduceValue', function () {
  this.reduce = function (value, mod) {
    function intlFormat(num) {
      if (mod) {
        return Math.round(num);
      }
      return new Intl.NumberFormat().format(Math.round(num * 10) / 10);
    }

    if (value >= 1000000) {
      return intlFormat(value / 1000000) + 'M';
    }
    if (value >= 1000) {
      return intlFormat(value / 1000) + 'k';
    }
    return intlFormat(value);
  };
});
