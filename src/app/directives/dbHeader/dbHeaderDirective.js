angular.module('app').directive('hueDbHeader', ['$compile', '$timeout', 'searchMenuService', function (compile, timeout, searchMenuService) {
  function link(scope, element, attrs) {
    scope.headerHeight = null; //only for description expanding
    scope.getHeaderHeight = function () {
      return scope.headerHeight ? scope.headerHeight + 'px' : null;
    };

    scope.isIconClickable = function () {
      return typeof attrs.iconClick != 'undefined';
    };

    var pageInfoContainer = element.find('.header-page-info');
    var pageInfoScopes = null;

    var generateCellTag = function (cell) {
      var classes = cell.classes;

      if (!classes)
        switch (cell.type) {
          case 'countTo':
            classes = cell.data.menuTab ? 'cell-clickable' : null;
            break;
          case 'desc':
            classes = 'cell-description';
            break;
        }

      var result = '<div class="info-cell cell-' + cell.width + (classes ? ' ' + classes + '"' : '"');

      if (cell.tooltip)
        result += ' hue-db-info-tooltip="' + cell.tooltip + '"';
      if (cell.attrs)
        result += ' ' + cell.attrs;

      if (cell.type == 'countTo' && cell.data.menuTab)
        result += ' ng-click="openSearchMenuTab(\'' + cell.data.menuTab + '\')"';

      if ((cell.type == 'title' || cell.type == 'custom') && cell.onClick)
        result += ' ng-click="onClick()"';

      result += '>';

      return result;
    };

    scope.$watch('pageInfo', function (newValue, oldValue) {
      if (pageInfoScopes)
        _.each(pageInfoScopes, function (item) {
          item.$destroy();
        });
      descriptionScope = null;
      pageInfoContainer.empty();

      if (newValue) {
        pageInfoScopes = [];
        _.each(newValue, function (item) {
          var childScope = scope.$new();
          var compiledDirective;

          switch (item.type) {
            case 'title':
              compiledDirective = compile(generateCellTag(item) + '<div class="cell-subcontainer"><div class="cell-content"><span class="cell-title" ng-bind="data.title"></span><br /><span class="cell-subtitle" ng-bind="data.subtitle"></span></div></div></div>');
              break;
            case 'countTo':
              compiledDirective = compile(generateCellTag(item) + '<div class="cell-subcontainer"><div class="cell-content"><span class="cell-title" count-to="{{data.count}}" duration="1"></span><br /><span class="cell-subtitle" ng-bind="data.subtitle"></span></div></div></div>');
              childScope.openSearchMenuTab = function (tabName) {
                searchMenuService.openTab(tabName);
              };
              break;
            case 'desc':
              compiledDirective = compile(generateCellTag(item) + '<hue-db-header-description text="data.text" header-height="$parent.headerHeight"></hue-db-header-description></div>');
              break;
            case 'custom':
              compiledDirective = compile(generateCellTag(item) + item.content + '</div>');
              break;
          }

          if (item.onClick)
            childScope.onClick = item.onClick;
          childScope.data = item.data;
          pageInfoContainer.append(compiledDirective(childScope));
          pageInfoScopes.push(childScope);
        });
      }
    });
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbHeader/dbHeaderView.html',
    link: link,
    scope: {
      title: '=headerTitle',
      subtitle: '=headerSubtitle',
      icon: '=headerIcon',
      iconType: '@',
      iconClick: '&',
      pageInfo: '='
    }
  };
}]);
