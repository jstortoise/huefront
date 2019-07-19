(function () {
  'use strict';
  var serviceId = 'common';
  angular.module('app').service(serviceId, ['$q', function ($q) {
    return {
      $q: $q,

      generic: {
        regions: [
          {
            id: 'europe',
            name: 'europe',
            title: 'Europe',
            serverName: 'europe',
            cities: [
              {name: 'london'}, {name: 'paris'}, {name: 'milan'}
            ]
          },
          {
            id: 'north_america',
            name: 'namerica',
            title: 'North America',
            serverName: 'north_america',
            cities: [{name: 'ny', serverName: 'new york'}]
          },
          {
            id: 'latin_america',
            name: 'samerica',
            title: 'South America',
            serverName: 'latin_america',
            cities: [{name: 'mex', serverName: 'mexico'},
              {name: 'rio', serverName: 'rio de janeiro'},
              {name: 'sao', serverName: 'sao paulo'}
            ]
          },
          {
            id: 'asia_pacific',
            name: 'asia',
            title: 'Asia and Pacific',
            serverName: 'asia_pacific',
            cities: [{name: 'tokyo'}, {name: 'seoul'}]
          }
        ]
      }
    }
  }
  ]);
}());
