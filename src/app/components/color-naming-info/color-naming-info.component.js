angular
  .module('app')
  .component('colorNamingInfoComponent', {
    templateUrl: 'app/components/color-naming-info/color-naming-info.tmpl.html',
    controller: function ($location, anchorSmoothScroll) {
        var vm = this;

        $(document).ready(function() {
            $(".scroll_down").click(function() {
                $('html, body').animate({
                    scrollTop: $("#education-top").offset().top
                }, 1500);
            });
        });
    }
  });
