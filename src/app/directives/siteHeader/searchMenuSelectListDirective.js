angular.module('app').directive('hueSearchMenuSelectList', ['$timeout', function (timeout) {
  function link(scope, element, attrs) {
    var listElement = $('.selector-list-container ul', element);
    var elementClick = function (event) {
      if (!scope.listDisabled)
        timeout(function () {
          if ($(event.target).index()) {
            var newId = scope.listData.items[$(event.target).index() - 1].id;
            scope.listData.selectedId = newId == scope.listData.selectedId ? null : newId;
          } else
            scope.listData.selectedId = -1;

          scope.onItemSelected();
        }, 0);
    };

    scope.$watch('listData.selectedId', function (newValue, oldValue) {
      if (oldValue == -1)
        listElement.children().first().removeClass('active');
      else if (oldValue != null)
        listElement.children().eq(_.findIndex(scope.listData.items, function (item) {
            return item.id == oldValue;
          }) + 1).removeClass('active');

      if (newValue == -1)
        listElement.children().first().addClass('active');
      else if (newValue != null)
        listElement.children().eq(_.findIndex(scope.listData.items, function (item) {
            return item.id == newValue;
          }) + 1).addClass('active');
    });

    scope.$watch('listData.items', function (newValue, oldValue) {
      listElement.empty();

      if (newValue)
        timeout(function () {
          var selectAll = $('<li>All</li>');
          selectAll.click(elementClick);
          listElement.append(selectAll);

          var count = newValue.length;
          for (var i = 0; i < count; i++) {
            var e = $('<li></li>');
            e.text(newValue[i].title);
            e.click(elementClick);
            listElement.append(e);
          }

          var sid = scope.listData.selectedId;
          if (sid == -1)
            listElement.children().first().addClass('active');
          else if (sid != null)
            listElement.children().eq(_.findIndex(scope.listData.items, function (item) {
                return item.id == sid;
              }) + 1).addClass('active');
        }, 0);
    });

    scope.$on('destroy', function () {
      listElement.find('li').off('click', elementClick);
    });
  }

  return {
    restrict: 'E',
    // template: '<div class="selector-container" ng-class="{disabled: listDisabled}"><div class="selector-title" ng-bind="listData.title"></div><div class="selector-list-container" hue-mcustomscrollbar><ul></ul></div></div>',
    template: '<div class="selector-container" ng-class="{disabled: listDisabled}">' +
    '<div class="selector-title" ng-bind="listData.title"></div>' +
    '<div class="selector-list-container"><ul></ul></div></div>',
    link: link,
    scope: {
      listData: '=',
      listDisabled: '=',
      onItemSelected: '&'
    }
  };
}]);
