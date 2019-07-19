angular.module('app').service('exportService',
  ['$timeout', 'searchMenuRepository',
    function (timeout, searchMenuRepository) {
      var self = this;

      this.title = null;

      this.generateTitle = function (extension) {
        if (!self.title)
          return 'huebrand.' + extension;

        var result = 'HB_' + self.title.replace(/[|&;$%@"<>()+,]/g, "-");

        return result + '.' + extension;
      };

      this.exportJpg = function () {
        $('.dashboard').css('position', 'relative');
        window.scrollTo(0, 0);

        timeout(function () {
          html2canvas(document.body, {
            background: '#fff',
            onrendered: function (canvas) {
              $('.dashboard').css('position', null);

              var img = canvas.toDataURL("image/jpeg");
              download(img, self.generateTitle('jpg'), "image/jpeg");
            }
          });
        }, 50);
      };

      this.exportPdf = function () {
        $('.dashboard').css('position', 'relative');
        window.scrollTo(0, 0);

        timeout(function () {
          var doc = new jsPDF();
          html2canvas(document.body, {
            background: '#fff',
            onrendered: function (canvas) {
              $('.dashboard').css('position', null);

              var img = canvas.toDataURL("image/jpeg");
              doc.addImage(img, 'JPEG', 0, 0, 210, 210 * canvas.height / canvas.width);
              doc.save(self.generateTitle('pdf'));
            }
          });
        }, 50);
      };
    }]);
