angular
  .module('app')
  .component('colorIndexAccordionComponent', {
    templateUrl: 'app/components/color-index-accordion/color-index-accordion.tmpl.html',
    controller: function ($location, $scope, anchorSmoothScroll, $window, $element, searchColor) {
      var vm = this;

			vm.paintColorNames = searchColor.getPaintColorNames();
      vm.colorAssociationNames = searchColor.getColorAssociationNames();

      vm.searchColorName = [];
			$scope.pageSize = 80;

      var colorNamesItems = [],
        		colorRgbItems = [];

      if (vm.colorAssociationNames !== undefined) {
        if (vm.colorAssociationNames.length > 0) {
          vm.colorAssociationNames.forEach(function (color) {
            colorRgbItems.push(color.RGB);
						colorNamesItems.push(color.colorName);
          });
        }
      }

      var colorNames = colorNamesItems.join(',');
			// word cloud word cloud word cloud word cloud word cloud word cloud word cloud word cloud word cloud word cloud word cloud word cloud word cloud word cloud word cloud word cloud

      if (colorNames.length > 1) {
				drawWordCloud(colorNames);
			}

      function drawWordCloud(text_string) {
        var common = 'poop,i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,says,said,shall';

        var word_count = {};

        var words = text_string.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/);
        if (words.length === 1) {
          word_count[words[0]] = 1;
        } else {
          words.forEach(function (word) {
            var word = word.toLowerCase();
            if (word !== '' && common.indexOf(word) === -1 && word.length > 1) {
              if (word_count[word]) {
                word_count[word]++;
              } else {
                word_count[word] = 1;
              }
            }
          });
        }
        var svg_location = '#chart';
        var widthOf84per = innerWidth - innerWidth*16/100;
        var width = widthOf84per;
        var height = 450;

        var word_entries = d3.entries(word_count);

        var xScale = d3.scale.linear()
                .domain([0, d3.max(word_entries, function (d) {
                  return d.value;
                })
                ])
                .range([20, 100]);
        d3.layout.cloud().size([width, height])
                .timeInterval(20)
                .words(word_entries)
                .fontSize(function (d) {
                  return xScale(Number(d.value));
                })
                .text(function (d) {
                  return d.key;
                })
                .rotate(function () {
                  return ~~(Math.random() * 2) * 90;
                })
                .font('Impact')
                .on('end', draw)
                .start();
				window.addEventListener("resize", draw(words));
        function draw(words) {
					console.log("window.innerWidth", window.innerWidth);
          d3.select(svg_location).append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(' + [widthOf84per/2, 225] + ')')
                    .selectAll('text')
                    .data(words)
                    .enter().append('text')
                    .style('font-size', function (d) {
                      return xScale(d.value*0.5) + 'px';
                    })
                    .style('font-family', 'Impact')
                    .style('fill', function (d, i) {
                      return 'rgb(' + colorRgbItems[i] + ')';
                    })
                    .attr('text-anchor', 'middle')
                    .attr('transform', function (d) {
                      return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
                    })
                    .text(function (d) {
                      return d.key;
                    });
        }
        d3.layout.cloud().stop();
      }
                                                                                                    // METHOD RGB TO HEX
      function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
      }

      function rgbToHex(r, g, b) {
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
      }

      //                                                                                         SELECT FOR COLOR DATA
      $(document).ready(function() {
        var widthContainer = window.innerWidth - 200;
        var widthOneElement = $('.checkbox-accordion-item').width();
        var integerElementsOnRow = Math.floor(widthContainer / widthOneElement);

        var paintColorNamesElements = vm.paintColorNames.length;
        var paintColorNamesOnRow = paintColorNamesElements - (Math.floor(paintColorNamesElements / integerElementsOnRow) * integerElementsOnRow);
        var emptyPainColorsElements = integerElementsOnRow - paintColorNamesOnRow;

        var colorAssociationNamesElements = vm.colorAssociationNames.length;
        var colorAssociationOnRow = colorAssociationNamesElements - (Math.floor(colorAssociationNamesElements / integerElementsOnRow) * integerElementsOnRow);
        var emptyColorAssociationsElements = integerElementsOnRow - colorAssociationOnRow;

        var emptyBlock = '<div style="width:'+ widthOneElement +'px"'+'</div>';

        for(var i = 0; i < emptyPainColorsElements; i++) {
          $('.color-index-accordion-item__last-line').append(emptyBlock);
        }

        for(var i = 0; i < emptyColorAssociationsElements; i++) {
          $('.color-index-accordion-item__last-line').append(emptyBlock);
        }

        $(document).click(function(event) {
          if ($(event.target).closest(".selectPerPage").length) return;
          $('.selectPerPage__list').removeClass('show');
          event.stopPropagation();
        });
      });

      $scope.showSelect = function() {
        $('.selectPerPage__list').toggleClass('show');
      }
    }
  });
angular.module('ui.bootstrap').controller('AccordionCtrl', function ($scope) {
  $scope.oneAtATime = true;
});
