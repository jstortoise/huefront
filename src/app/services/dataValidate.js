angular.module('app').service('dataValidate', function (modalService) {
  this.validate = function (data) {
    var validDomain = [
      'aol.com', 'att.net', 'comcast.net', 'facebook.com', 'gmail.com', 'gmx.com', 'googlemail.com',
      'google.com', 'hotmail.com', 'hotmail.co.uk', 'mac.com', 'me.com', 'mail.com', 'msn.com',
      'live.com', 'sbcglobal.net', 'verizon.net', 'yahoo.com', 'yahoo.co.uk',
      'email.com', 'fastmail.fm', 'games.com', 'gmx.net', 'hush.com', 'hushmail.com', 'icloud.com',
      'iname.com', 'inbox.com', 'lavabit.com', 'love.com', 'outlook.com', 'pobox.com', 'protonmail.com',
      'rocketmail.com', 'safe-mail.net', 'wow.com', 'ygm.com', 'ymail.com', 'zoho.com', 'yandex.com', 'bellsouth.net',
      'charter.net', 'cox.net', 'earthlink.net', 'juno.com',
      'btinternet.com', 'virginmedia.com', 'blueyonder.co.uk', 'freeserve.co.uk', 'live.co.uk',
      'ntlworld.com', 'o2.co.uk', 'orange.net', 'sky.com', 'talktalk.co.uk', 'tiscali.co.uk',
      'virgin.net', 'wanadoo.co.uk', 'bt.com',
      'sina.com', 'qq.com', 'naver.com', 'hanmail.net', 'daum.net', 'nate.com', 'yahoo.co.jp', 'yahoo.co.kr',
      'yahoo.co.id', 'yahoo.co.in', 'yahoo.com.sg', 'yahoo.com.ph',
      'hotmail.fr', 'live.fr', 'laposte.net', 'yahoo.fr', 'wanadoo.fr', 'orange.fr', 'gmx.fr', 'sfr.fr', 'neuf.fr',
      'free.fr', 'gmx.de', 'hotmail.de', 'live.de', 'online.de', 't-online.de', 'web.de', 'yahoo.de',
      'libero.it', 'virgilio.it', 'hotmail.it', 'aol.it', 'tiscali.it', 'alice.it', 'live.it', 'yahoo.it', 'email.it',
      'tin.it', 'poste.it', 'teletu.it', 'mail.ru', 'rambler.ru', 'yandex.ru', 'ya.ru', 'list.ru',
      'hotmail.be', 'live.be', 'skynet.be', 'voo.be', 'tvcablenet.be', 'telenet.be',
      'hotmail.com.ar', 'live.com.ar', 'yahoo.com.ar', 'fibertel.com.ar', 'speedy.com.ar', 'arnet.com.ar',
      'yahoo.com.mx', 'live.com.mx', 'hotmail.es', 'hotmail.com.mx', 'prodigy.net.mx',
      'yahoo.com.br', 'hotmail.com.br', 'outlook.com.br', 'uol.com.br', 'bol.com.br', 'terra.com.br', 'ig.com.br',
      'itelefonica.com.br', 'r7.com', 'zipmail.com.br', 'globo.com', 'globomail.com', 'oi.com.br'
    ];

    var errorMessage = [];
    var types = {
      provide: '*Please provide Your ',
      select: '*Please select ',
      enter: '*Please enter Your ',
      numeric: '*Must be number: ',
      both: '*Please enter or select Your '
    };

    for (var item in data) {
      if (data[item].required) {
        if (data[item].value === '' || !data[item].value || (data[item].type === 'select' && data[item].value.id === null) ||
          (data[item].type === 'both' && (data[item].value === '' || data[item].value === 'STATE/PROVINCE <span class="red-text">*</span>'))) {
          var type = types[data[item].type] || '*Please enter ';
          errorMessage.push(type + data[item].name);
        } else if (data[item].name.includes('email')) {
          if (data[item].value.indexOf('@') !== -1 && data[item].value.indexOf('.') !== -1 &&
            data[item].value.indexOf('@') < data[item].value.lastIndexOf('.')) {
            _.forEach(validDomain, function (domain) {
              if (data[item].value.toLowerCase().includes(domain)) {
                errorMessage.push('*Please enter Your work-related email');
                return false;
              }
            });
          } else {
            errorMessage.push('*Please enter Your work-related email');
          }
        } else if (data[item].type === 'numeric') {
          if (!(!isNaN(parseFloat(data[item].value)) && isFinite(data[item].value))) {
            errorMessage.push(types.numeric + data[item].name);
          }
        }
      }
    }
    if (errorMessage.length !== 0) {
      modalService.showModal(0, null, errorMessage);
      return false;
    }
    return true;
  };
});
