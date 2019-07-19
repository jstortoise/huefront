angular.module('app').directive('hueDbCarousel', function ($timeout, $interval) {
  function link(scope, element, attrs) {
    var animationDelay = 200;

    var carouselContainer = angular.element('.carousel-container', element);
    var containerSize = carouselContainer.width();

    var maxVisibleElementsCount = parseInt(scope.visibleElements);
    var visibleElementsCount;

    var linkedList;
    var firstElement;
    var lastElement;

    var animTimeout;
    var updateInterval;

    var setupCarousel = function () {
      var elements = _.map(carouselContainer.children(), function (item) {
        return angular.element(item);
      });

      if (elements.length == 0) {
        return;
      }
      visibleElementsCount = elements.length > maxVisibleElementsCount ? maxVisibleElementsCount : elements.length;
      linkedList = [];

      var count = elements.length;
      for (var i = 0; i < count; i++) {
        var e = elements[i];
        e.addClass('carousel-element');
        e.css('display', 'none');

        linkedList.push({e: e, p: linkedList[i - 1]});
      }

      for (var i = 0; i < count; i++) {
        linkedList[i].n = linkedList[i + 1];
      }
      linkedList[0].p = linkedList[count - 1];
      linkedList[count - 1].n = linkedList[0];

      firstElement = linkedList[0];
    };

    scope.rotateCarousel = function (delta) {
      if (!linkedList || linkedList.length == 0 || linkedList.length <= maxVisibleElementsCount || animTimeout)
        return;

      var elementWidth = firstElement.e.width();
      var elementSpacing = parseInt(scope.elementSpacing);
      var visibleAreaWidth = visibleElementsCount * elementWidth + (visibleElementsCount - 1) * elementSpacing;
      var elemOffset = Math.round((containerSize - visibleAreaWidth) / 2);

      var setElemPos = function (e, index) {
        e.css('left', (elemOffset + index * elementSpacing + index * elementWidth));
      };

      if (delta == 1) {
        // setup
        var listElem = firstElement;
        for (var i = 0; i < visibleElementsCount; i++) {
          var e = listElem.e;
          e.addClass('element-animated');
          listElem = listElem.n;
        }
        setElemPos(lastElement.n.e, visibleElementsCount);
        lastElement.n.e.css('opacity', 0);
        lastElement.n.e.css('display', '');
        lastElement.n.e.addClass('element-animated');

        //animate
        $timeout(function () {
          listElem = firstElement;
          for (var i = 0; i < visibleElementsCount; i++) {
            var e = listElem.e;
            setElemPos(e, i - 1);
            listElem = listElem.n;
          }
          firstElement.e.css('opacity', 0);

          lastElement.n.e.css('opacity', 1);
          setElemPos(lastElement.n.e, visibleElementsCount - 1);

          firstElement = firstElement.n;
          lastElement = lastElement.n;

          // cleanup
          animTimeout = $timeout(function () {
            carouselContainer.children().removeClass('element-animated');
            firstElement.p.e.css('display', 'none');

            animTimeout = null;
          }, animationDelay);
        }, 0);
      } else if (delta == -1) {
        // setup
        var listElem = firstElement;
        for (var i = 0; i < visibleElementsCount; i++) {
          var e = listElem.e;
          e.addClass('element-animated');
          listElem = listElem.n;
        }
        setElemPos(firstElement.p.e, -1);
        firstElement.p.e.css('opacity', 0);
        firstElement.p.e.css('display', '');
        firstElement.p.e.addClass('element-animated');

        //animate
        $timeout(function () {
          listElem = firstElement;
          for (var i = 0; i < visibleElementsCount; i++) {
            var e = listElem.e;
            setElemPos(e, i + 1);
            listElem = listElem.n;
          }
          lastElement.e.css('opacity', 0);

          firstElement.p.e.css('opacity', 1);
          setElemPos(firstElement.p.e, 0);

          firstElement = firstElement.p;
          lastElement = lastElement.p;

          //cleanup
          animTimeout = $timeout(function () {
            carouselContainer.children().removeClass('element-animated');
            firstElement.p.e.css('display', 'none');

            animTimeout = null;
          }, animationDelay);
        }, 0);
      } else {
        var listElem = firstElement;
        for (var i = 0; i < visibleElementsCount; i++) {
          var e = listElem.e;
          setElemPos(e, i);
          e.css('display', '');
          listElem = listElem.n;
        }
        lastElement = listElem.p;
      }
    };

    var childrenChanged = function () {
      var children = carouselContainer.children();
      if (!linkedList || linkedList.length != children.length) {
        return true;
      }
      var children = carouselContainer.children();
      var count = children.length;
      for (var i = 0; i < count; i++)
        if (children[i] !== linkedList[i].e[0]) {
          return true;
        }
      return false;
    };

    scope.showButtons = function (delta) {
      if (!linkedList)
        return false;
      return linkedList.length > maxVisibleElementsCount;
    };

    setupCarousel();
    scope.rotateCarousel();

    updateInterval = $interval(function () {
      if (childrenChanged()) {
        setupCarousel();
        scope.rotateCarousel();
      }

      if (carouselContainer.width() != containerSize) {
        containerSize = carouselContainer.width();
        scope.rotateCarousel();
      }
    }, 250);

    scope.$on('$destroy', function () {
      if (animTimeout) {
        $timeout.cancel(animTimeout);
      }
      if (updateInterval) {
        $interval.cancel(updateInterval);
      }
    });
  }

  return {
    restrict: 'E',
    transclude: true,
    template: '<div class="db-carousel"><div class="carousel-container" ng-transclude></div><div class="carousel-button button-prev" ng-show="showButtons()" ng-click="rotateCarousel(-1)"></div><div class="carousel-button button-next" ng-show="showButtons()" ng-click="rotateCarousel(1)"></div></div>',
    link: link,
    scope: {
      visibleElements: '@',
      elementSpacing: '@'
    }
  };
});
