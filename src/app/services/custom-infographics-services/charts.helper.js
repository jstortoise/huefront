(function () {
  'use strict';
  var serviceId = 'chartsHelper';
  angular.module('app').service(serviceId, ['$q', 'repo.hue',
    function ($q, hue) {
      function initContainer(element, childPath) {
        element = $(element);

        var container = !!childPath ? $(element).find(childPath) : element;
        var containerItself = !!childPath;

        var innerContainer;
        if (containerItself) {
          innerContainer = container;
        } else {
          innerContainer = container.find('>*:first-child');
        }

        if (innerContainer.length === 0) {
          innerContainer = $('<div></div>');
          innerContainer.appendTo(container);
        } else {
          innerContainer.html('');
        }
        return innerContainer;
      }

      return {
        initContainer: initContainer
      }
    }
  ]);
}());
