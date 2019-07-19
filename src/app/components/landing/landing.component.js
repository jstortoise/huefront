angular
  .module('app')
  .component('landingComponent', {
    templateUrl: 'app/components/landing/landing.tmpl.html',
    controller: function (authService, $state, localStorageService) {

      $(document).ready(function () {
        $("nav").find("li").on("click", "a", function () {
          // $('.navbar-collapse.in').collapse('hide');
        });
      });

      $(document).ready(function(){

        $("#slideshow > div:gt(0)").hide();

        var interval = setInterval(slide, 3000);

        function intslide(func) {
          if (func == 'start') {
            interval = setInterval(slide, 3000);
          } else {
            clearInterval(interval);
          }
        }

        function slide() {
          sact('next', 0, 2000);
        }

        function sact(a, ix, it) {
          var currentSlide = $('.current');
          var nextSlide = currentSlide.next('.slideitem');
          var prevSlide = currentSlide.prev('.slideitem');
          var reqSlide = $('.slideitem').eq(ix);

          var currentDot = $('.active-dot');
          var nextDot = currentDot.next();
          var prevDot = currentDot.prev();
          var reqDot = $('.dot').eq(ix);

          if (nextSlide.length == 0) {
            nextDot = $('.dot').first();
            nextSlide = $('.slideitem').first();
          }

          if (prevSlide.length == 0) {
            prevDot = $('.dot').last();
            prevSlide = $('.slideitem').last();
          }

          if (a == 'next') {
            var Slide = nextSlide;
            var Dot = nextDot;
          }
          else if (a == 'prev') {
            var Slide = prevSlide;
            var Dot = prevDot;
          }
          else {
            var Slide = reqSlide;
            var Dot = reqDot;
          }
          var it_before = it - 500;
          currentSlide.fadeOut(it_before).removeClass('current');
          Slide.fadeIn(it).addClass('current');
          }
      });
    }
  });
