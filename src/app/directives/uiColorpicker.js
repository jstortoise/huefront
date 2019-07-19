// angular.module('app').directive('uiColorpicker', function () {
//     return {
//         restrict: 'E',
//         require: 'ngModel',
//         scope: false,
//         replace: true,
//         template: "<span><input class='input-small' /></span>",
//         link: function (scope, element, attrs, ngModel) {
//             var input = element.find('input');
//             // var buttonColorpicker = element.find('.sp-replacer .sp-light');
//             // var buttonColorpicker = element[0].childNodes[1];
//             // buttonColorpicker.addClass('sp-active');
//             // console.log('div', div);
//
//             // scope.clickPicker = function () {
//             //     console.log('$scope--picker-derictive', scope);
//             // };
//
//             console.log('scope', scope);
//             console.log('buttonColorpicker=1', element);
//             console.log('buttonColorpicker', element.find('.sp-replacer'));
//             var options = angular.extend({
//                 color: ngModel.$viewValue,
//                 change: function (color) {
//                     scope.$apply(function () {
//                         ngModel.$setViewValue(color.toHexString());
//                     });
//                 }
//             }, scope.$eval(attrs.options));
//
//             ngModel.$render = function () {
//                 input.spectrum('set', ngModel.$viewValue || '');
//             };
//
//             input.spectrum(options);
//         }
//     };
// });
//
// app.controller('MyCtrl', function($scope) {
//     $scope.targetColor = '#ebebeb';
// });

// angular.bootstrap(document, ['app']);
