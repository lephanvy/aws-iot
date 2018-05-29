import { Component, OnInit } from '@angular/core';
import { TrendService } from '../../services/trend.service';

@Component({
  selector: 'app-chart-line-page',
  templateUrl: './chart-line-page.component.html',
  styleUrls: ['./chart-line-page.component.scss']
})
export class ChartLinePageComponent implements OnInit {

  constructor(
    private trendService : TrendService
  ) { }

  ngOnInit() {
  }

}
