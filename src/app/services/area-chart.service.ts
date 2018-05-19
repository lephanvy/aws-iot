import { Injectable } from '@angular/core';

@Injectable()
export class AreaChartService {

  constructor() { }

  areaChart = [
    {
      "name": "Belgium",
      "series": [
        {
          "value": 6809,
          "name": "Jan"
        },
        {
          "value": 6738,
          "name": "Feb"
        },
        {
          "value": 2177,
          "name": "Mar"
        },
        {
          "value": 5602,
          "name": "Apr"
        },
        {
          "value": 3600,
          "name": "May"
        }
      ]
    },
    {
      "name": "Sierra Leone",
      "series": [
        {
          "value": 6194,
          "name": "Jan"
        },
        {
          "value": 5876,
          "name": "Feb"
        },
        {
          "value": 3325,
          "name": "Mar"
        },
        {
          "value": 6976,
          "name": "Apr"
        },
        {
          "value": 4430,
          "name": "May"
        }
      ]
    },
    {
      "name": "Uganda",
      "series": [
        {
          "value": 3123,
          "name": "Jan"
        },
        {
          "value": 5969,
          "name": "Feb"
        },
        {
          "value": 2746,
          "name": "Mar"
        },
        {
          "value": 3361,
          "name": "Apr"
        },
        {
          "value": 6916,
          "name": "May"
        }
      ]
    },
    {
      "name": "Moldova",
      "series": [
        {
          "value": 4860,
          "name": "Jan"
        },
        {
          "value": 5988,
          "name": "Feb"
        },
        {
          "value": 5154,
          "name": "Mar"
        },
        {
          "value": 2370,
          "name": "Apr"
        },
        {
          "value": 4640,
          "name": "May"
        }
      ]
    },
    {
      "name": "Colombia",
      "series": [
        {
          "value": 3917,
          "name": "Jan"
        },
        {
          "value": 5055,
          "name": "Feb"
        },
        {
          "value": 4689,
          "name": "Mar"
        },
        {
          "value": 3138,
          "name": "Apr"
        },
        {
          "value": 4324,
          "name": "May"
        }
      ]
    }
  ]

}
