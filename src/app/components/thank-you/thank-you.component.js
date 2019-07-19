angular
  .module('app')
  .component('thankYouComponent', {
    templateUrl: 'app/components/thank-you/thank-you.tmpl.html',
    controller: function ($stateParams) {
      // this.membership = $stateParams.parFrom === 'membership';
      // switch ($stateParams.parFrom) {
      //   case 'press': {
      //     this.text = 'press request';
      //     break;
      //   }
      //   case 'speaking': {
      //     this.text = 'Speaking Engagements request';
      //     break;
      //   }
      //   case 'contact': {
      //     this.text = 'contacting request';
      //     break;
      //   }
      //   case 'data': {
      //     this.text = 'inquire about Data Partnership';
      //     break;
      //   }
      //   case 'edu': {
      //     this.text = 'inquire about Education Partnership';
      //     break;
      //   }
      //   case 'inquire': {
      //     this.text = 'inquire';
      //     break;
      //   }
      //   case 'membership': {
      //     this.text = 'We received your membership request. Thank you for reaching out.';
      //     break;
      //   }
      //   default: {
      //     this.text = 'request';
      //     break;
      //   }
      // }
    }
  });
