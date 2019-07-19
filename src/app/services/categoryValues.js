angular.module('app')
  .factory('categoryValues', function () {
    return function (field) {
      switch (field) {
        case 'job function': {
          return [
            {id: null, title: 'PLEASE SELECT A JOB FUNCTION <span class="red-text">*</span>'},
            {id: 1, title: 'Intern'},
            {id: 2, title: 'Analyst/Associate'},
            {id: 3, title: 'Manager'},
            {id: 4, title: 'Director'},
            {id: 5, title: 'VP/SVP/EVP'},
            {id: 6, title: 'Chairman/President/C-Suite'}
          ];
        }
        case 'company size': {
          return [
            {id: null, title: 'PLEASE SELECT COMPANY SIZE <span class="red-text">*</span>'},
            {id: 1, title: '1-10 employees'},
            {id: 2, title: '11-50 employees'},
            {id: 3, title: '51-200 employees'},
            {id: 4, title: '201-500 employees'},
            {id: 5, title: '501-1000 employees'},
            {id: 6, title: '1001-5000 employees'},
            {id: 7, title: '5000+ employees'}
          ];
        }
        case 'industry': {
          return [
            {
              id: null,
              title: 'PLEASE SELECT INDUSTRY <span class="red-text">*</span>'
            },
            {
              id: 1,
              title: 'Activewear'
            },
            {
              id: 2,
              title: 'Auto'
            },
            {
              id: 3,
              title: 'Agency'
            },
            {
              id: 4,
              title: 'Beauty'
            },
            {
              id: 5,
              title: 'Big Box Retail'
            },
            {
              id: 6,
              title: 'Consumer Electronics'
            },
            {
              id: 7,
              title: 'CPG/FMCG'
            },
            {
              id: 8,
              title: 'Department Stores'
            },
            {
              id: 9,
              title: 'Educational Institution'
            },
            {
              id: 10,
              title: 'Fashion'
            },
            {
              id: 11,
              title: 'Financial Services'
            },
            {
              id: 12,
              title: 'Food & Beverage'
            },
            {
              id: 13,
              title: 'Hospitality'
            },
            {
              id: 14,
              title: 'Real Estate'
            },
            {
              id: 15,
              title: 'Restaurants'
            },
            {
              id: 16,
              title: 'Specialty Retail'
            },
            {
              id: 17,
              title: 'Technology'
            },
            {
              id: 18,
              title: 'Watches & Jewelry'
            },
            {
              id: 19,
              title: 'Other'
            }
          ];
        }
        case 'country': {
          return [
            {
              id: null,
              title: 'PLEASE SELECT COUNTRY <span class="red-text">*</span>'
            },
            {
              id: 1,
              title: 'Afghanistan'
            },
            {
              id: 2,
              title: 'Albania'
            },
            {
              id: 3,
              title: 'Algeria'
            },
            {
              id: 4,
              title: 'Andorra'
            },
            {
              id: 5,
              title: 'Angola'
            },
            {
              id: 6,
              title: 'Anguilla'
            },
            {
              id: 7,
              title: 'Antigua & Barbuda'
            },
            {
              id: 8,
              title: 'Argentina'
            },
            {
              id: 9,
              title: 'Armenia'
            },
            {
              id: 10,
              title: 'Australia'
            },
            {
              id: 11,
              title: 'Austria'
            },
            {
              id: 12,
              title: 'Azerbaijan'
            },
            {
              id: 13,
              title: 'Bahamas'
            },
            {
              id: 14,
              title: 'Bahrain'
            },
            {
              id: 15,
              title: 'Bangladesh'
            },
            {
              id: 16,
              title: 'Barbados'
            },
            {
              id: 17,
              title: 'Belarus'
            },
            {
              id: 18,
              title: 'Belgium'
            },
            {
              id: 19,
              title: 'Belize'
            },
            {
              id: 20,
              title: 'Benin'
            },
            {
              id: 21,
              title: 'Bermuda'
            },
            {
              id: 22,
              title: 'Bhutan'
            },
            {
              id: 23,
              title: 'Bolivia'
            },
            {
              id: 24,
              title: 'Bosnia & Herzegovina'
            },
            {
              id: 25,
              title: 'Botswana'
            },
            {
              id: 26,
              title: 'Brazil'
            },
            {
              id: 27,
              title: 'Brunei Darussalam'
            },
            {
              id: 28,
              title: 'Bulgaria'
            },
            {
              id: 29,
              title: 'Burkina Faso'
            },
            {
              id: 30,
              title: 'Myanmar/Burma'
            },
            {
              id: 31,
              title: 'Burundi'
            },
            {
              id: 32,
              title: 'Cambodia'
            },
            {
              id: 33,
              title: 'Cameroon'
            },
            {
              id: 34,
              title: 'Canada'
            },
            {
              id: 35,
              title: 'Cape Verde'
            },
            {
              id: 36,
              title: 'Cayman Islands'
            },
            {
              id: 37,
              title: 'Central African Republic'
            },
            {
              id: 38,
              title: 'Chad'
            },
            {
              id: 39,
              title: 'Chile'
            },
            {
              id: 40,
              title: 'China'
            },
            {
              id: 41,
              title: 'Colombia'
            },
            {
              id: 42,
              title: 'Comoros'
            },
            {
              id: 43,
              title: 'Congo'
            },
            {
              id: 44,
              title: 'Costa Rica'
            },
            {
              id: 45,
              title: 'Croatia'
            },
            {
              id: 46,
              title: 'Cuba'
            },
            {
              id: 47,
              title: 'Cyprus'
            },
            {
              id: 48,
              title: 'Czech Republic'
            },
            {
              id: 49,
              title: 'Democratic Republic of the Congo'
            },
            {
              id: 50,
              title: 'Denmark'
            },
            {
              id: 51,
              title: 'Djibouti'
            },
            {
              id: 52,
              title: 'Dominica'
            },
            {
              id: 53,
              title: 'Dominican Republic'
            },
            {
              id: 54,
              title: 'Ecuador'
            },
            {
              id: 55,
              title: 'Egypt'
            },
            {
              id: 56,
              title: 'El Salvador'
            },
            {
              id: 57,
              title: 'Equatorial Guinea'
            },
            {
              id: 58,
              title: 'Eritrea'
            },
            {
              id: 59,
              title: 'Estonia'
            },
            {
              id: 60,
              title: 'Ethiopia'
            },
            {
              id: 61,
              title: 'Fiji'
            },
            {
              id: 62,
              title: 'Finland'
            },
            {
              id: 63,
              title: 'France'
            },
            {
              id: 64,
              title: 'French Guiana'
            },
            {
              id: 65,
              title: 'Gabon'
            },
            {
              id: 66,
              title: 'Gambia'
            },
            {
              id: 67,
              title: 'Georgia'
            },
            {
              id: 68,
              title: 'Germany'
            },
            {
              id: 69,
              title: 'Ghana'
            },
            {
              id: 70,
              title: 'Great Britain'
            },
            {
              id: 71,
              title: 'Greece'
            },
            {
              id: 72,
              title: 'Grenada'
            },
            {
              id: 73,
              title: 'Guadeloupe'
            },
            {
              id: 74,
              title: 'Guatemala'
            },
            {
              id: 75,
              title: 'Guinea'
            },
            {
              id: 76,
              title: 'Guinea-Bissau'
            },
            {
              id: 77,
              title: 'Guyana'
            },
            {
              id: 78,
              title: 'Haiti'
            },
            {
              id: 79,
              title: 'Honduras'
            },
            {
              id: 80,
              title: 'Hungary'
            },
            {
              id: 81,
              title: 'Iceland'
            },
            {
              id: 82,
              title: 'India'
            },
            {
              id: 83,
              title: 'Indonesia'
            },
            {
              id: 84,
              title: 'Iran'
            },
            {
              id: 85,
              title: 'Iraq'
            },
            {
              id: 86,
              title: 'Israel and the Occupied Territories'
            },
            {
              id: 87,
              title: 'Italy'
            },
            {
              id: 88,
              title: 'Ivory Coast (Cote d`Ivoire)'
            },
            {
              id: 89,
              title: 'Jamaica'
            },
            {
              id: 90,
              title: 'Japan'
            },
            {
              id: 91,
              title: 'Jordan'
            },
            {
              id: 92,
              title: 'Kazakhstan'
            },
            {
              id: 93,
              title: 'Kenya'
            },
            {
              id: 94,
              title: 'Kosovo'
            },
            {
              id: 95,
              title: 'Kuwait'
            },
            {
              id: 96,
              title: 'Kyrgyz Republic (Kyrgyzstan)'
            },
            {
              id: 97,
              title: 'Laos'
            },
            {
              id: 98,
              title: 'Latvia'
            },
            {
              id: 99,
              title: 'Lebanon'
            },
            {
              id: 100,
              title: 'Lesotho'
            },
            {
              id: 101,
              title: 'Liberia'
            },
            {
              id: 102,
              title: 'Libya'
            },
            {
              id: 103,
              title: 'Liechtenstein'
            },
            {
              id: 104,
              title: 'Lithuania'
            },
            {
              id: 105,
              title: 'Luxembourg'
            },
            {
              id: 106,
              title: 'Republic of Macedonia'
            },
            {
              id: 107,
              title: 'Madagascar'
            },
            {
              id: 108,
              title: 'Malawi'
            },
            {
              id: 109,
              title: 'Malaysia'
            },
            {
              id: 110,
              title: 'Maldives'
            },
            {
              id: 111,
              title: 'Mali'
            },
            {
              id: 112,
              title: 'Malta'
            },
            {
              id: 113,
              title: 'Martinique'
            },
            {
              id: 114,
              title: 'Mauritania'
            },
            {
              id: 115,
              title: 'Mauritius'
            },
            {
              id: 116,
              title: 'Mayotte'
            },
            {
              id: 117,
              title: 'Mexico'
            },
            {
              id: 118,
              title: 'Moldova, Republic of'
            },
            {
              id: 119,
              title: 'Monaco'
            },
            {
              id: 120,
              title: 'Mongolia'
            },
            {
              id: 121,
              title: 'Montenegro'
            },
            {
              id: 122,
              title: 'Montserrat'
            },
            {
              id: 123,
              title: 'Morocco'
            },
            {
              id: 124,
              title: 'Mozambique'
            },
            {
              id: 125,
              title: 'Namibia'
            },
            {
              id: 126,
              title: 'Nepal'
            },
            {
              id: 127,
              title: 'Netherlands'
            },
            {
              id: 128,
              title: 'New Zealand'
            },
            {
              id: 129,
              title: 'Nicaragua'
            },
            {
              id: 130,
              title: 'Niger'
            },
            {
              id: 131,
              title: 'Nigeria'
            },
            {
              id: 132,
              title: 'Korea, Democratic Republic of (North Korea)'
            },
            {
              id: 133,
              title: 'Norway'
            },
            {
              id: 134,
              title: 'Oman'
            },
            {
              id: 135,
              title: 'Pacific Islands'
            },
            {
              id: 136,
              title: 'Pakistan'
            },
            {
              id: 137,
              title: 'Panama'
            },
            {
              id: 138,
              title: 'Papua New Guinea'
            },
            {
              id: 139,
              title: 'Paraguay'
            },
            {
              id: 140,
              title: 'Peru'
            },
            {
              id: 141,
              title: 'Philippines'
            },
            {
              id: 142,
              title: 'Poland'
            },
            {
              id: 143,
              title: 'Portugal'
            },
            {
              id: 144,
              title: 'Puerto Rico'
            },
            {
              id: 145,
              title: 'Qatar'
            },
            {
              id: 146,
              title: 'Reunion'
            },
            {
              id: 147,
              title: 'Romania'
            },
            {
              id: 148,
              title: 'Russian Federation'
            },
            {
              id: 149,
              title: 'Rwanda'
            },
            {
              id: 150,
              title: 'Saint Kitts and Nevis'
            },
            {
              id: 151,
              title: 'Saint Lucia'
            },
            {
              id: 152,
              title: 'Saint Vincent`s & Grenadines'
            },
            {
              id: 153,
              title: 'Samoa'
            },
            {
              id: 154,
              title: 'Sao Tome and Principe'
            },
            {
              id: 155,
              title: 'Saudi Arabia'
            },
            {
              id: 156,
              title: 'Senegal'
            },
            {
              id: 157,
              title: 'Serbia'
            },
            {
              id: 158,
              title: 'Seychelles'
            },
            {
              id: 159,
              title: 'Sierra Leone'
            },
            {
              id: 160,
              title: 'Singapore'
            },
            {
              id: 161,
              title: 'Slovak Republic (Slovakia)'
            },
            {
              id: 162,
              title: 'Slovenia'
            },
            {
              id: 163,
              title: 'Solomon Islands'
            },
            {
              id: 164,
              title: 'Somalia'
            },
            {
              id: 165,
              title: 'South Africa'
            },
            {
              id: 166,
              title: 'Korea, Republic of (South Korea)'
            },
            {
              id: 167,
              title: 'South Sudan'
            },
            {
              id: 168,
              title: 'Spain'
            },
            {
              id: 169,
              title: 'Sri Lanka'
            },
            {
              id: 170,
              title: 'Sudan'
            },
            {
              id: 171,
              title: 'Suriname'
            },
            {
              id: 172,
              title: 'Swaziland'
            },
            {
              id: 173,
              title: 'Sweden'
            },
            {
              id: 174,
              title: 'Switzerland'
            },
            {
              id: 175,
              title: 'Syria'
            },
            {
              id: 176,
              title: 'Tajikistan'
            },
            {
              id: 177,
              title: 'Tanzania'
            },
            {
              id: 178,
              title: 'Thailand'
            },
            {
              id: 179,
              title: 'Timor Leste'
            },
            {
              id: 180,
              title: 'Togo'
            },
            {
              id: 181,
              title: 'Trinidad & Tobago'
            },
            {
              id: 182,
              title: 'Tunisia'
            },
            {
              id: 183,
              title: 'Turkey'
            },
            {
              id: 184,
              title: 'Turkmenistan'
            },
            {
              id: 185,
              title: 'Turks & Caicos Islands'
            },
            {
              id: 186,
              title: 'Uganda'
            },
            {
              id: 187,
              title: 'Ukraine'
            },
            {
              id: 188,
              title: 'United Arab Emirates'
            },
            {
              id: 189,
              title: 'United States of America (USA)'
            },
            {
              id: 190,
              title: 'Uruguay'
            },
            {
              id: 191,
              title: 'Uzbekistan'
            },
            {
              id: 192,
              title: 'Venezuela'
            },
            {
              id: 193,
              title: 'Vietnam'
            },
            {
              id: 194,
              title: 'Virgin Islands (UK)'
            },
            {
              id: 195,
              title: 'Virgin Islands (US)'
            },
            {
              id: 196,
              title: 'Yemen'
            },
            {
              id: 197,
              title: 'Zambia'
            },
            {
              id: 198,
              title: 'Zimbabwe'
            }
          ];
        }
        case 'permissions': {
          return {
            daily: 'Daily Insights',
            research: 'Research Partner',
            edu: 'Education Offerings'
          };
        }
        case 'downloadExcerpt': {
          return {
            daily: 'Daily Insights',
            newReportNotification: 'HUEDATA new report notification',
            emotionIndexInsights: 'Color -emotion index insights',
            expert: 'Expert Panelist'

          };
        }
        case 'hue': {
          return [
            'Fashion',
            'Brand',
            'Beauty',
            'Tech',
            'Auto',
            'Interior',
            'Home',
            'Package',
            'Products',
            'Legal'
          ];
        }
        case 'states': {
          var states = [
            'Alabama',
            'Alaska',
            'Arizona',
            'Arkansas',
            'California',
            'Colorado',
            'Connecticut',
            'Delaware',
            'District of Columbia',
            'Florida',
            'Georgia',
            'Hawaii',
            'Idaho',
            'Illinois',
            'Indiana',
            'Iowa',
            'Kansas',
            'Kentucky',
            'Louisiana',
            'Maine',
            'Maryland',
            'Massachusetts',
            'Michigan',
            'Minnesota',
            'Mississippi',
            'Missouri',
            'Montana',
            'Nebraska',
            'Nevada',
            'New Hampshire',
            'New Jersey',
            'New Mexico',
            'New York',
            'North Carolina',
            'North Dakota',
            'Ohio',
            'Oklahoma',
            'Oregon',
            'Pennsylvania',
            'Rhode Island',
            'South Carolina',
            'South Dakota',
            'Tennessee',
            'Texas',
            'Utah',
            'Vermont',
            'Virginia',
            'Washington',
            'West Virginia',
            'Wisconsin',
            'Wyoming',
            'American Samoa',
            'Guam',
            'Northern Mariana Islands',
            'Puerto Rico',
            'United States Minor Outlying Islands',
            'Virgin Islands'
          ].sort();
          states.unshift('STATE/PROVINCE <span class="red-text">*</span>');
          return states;
        }
        default: {
          return [];
        }
      }
    };
  });
