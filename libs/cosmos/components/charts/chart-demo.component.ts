import {
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import * as Highcharts from 'highcharts';

@Component({
  selector: 'cos-chart-demo',
  templateUrl: 'chart-demo.component.html',
  styleUrls: ['chart-demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-chart-demo',
  },
})
export class CosChartDemoComponent {
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  updateFlag = false; // optional boolean
  oneToOneFlag = true; // optional boolean, defaults to false
  runOutsideAngular = false; // optional boolean, defaults to false

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'spline',
    },
    credits: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
    subtitle: {
      text: undefined,
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    yAxis: [
      {
        title: {
          text: undefined,
        },
        showEmpty: false,
        min: 10000,
        max: 300000,
      },
      {
        lineWidth: 1,
        opposite: true,
        title: {
          text: undefined,
        },
        className: 'cos-dashed-axis',
      },
    ],
    tooltip: {
      valuePrefix: '$',
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: '2018',
        type: 'line',
        data: [20000, 50000, 65000, 125000, 150000, 300000],
        pointPlacement: 'on',
        color: '#c28dff',
      },
      {
        name: '2019',
        type: 'line',
        data: [15000, 36000, 38000, 75000, 125000, 200000],
        pointPlacement: 'on',
        color: '#f6c648',
      },
      {
        name: '2020',
        type: 'line',
        data: [10000, 20000, 25000, 50000, 100000, 125000],
        pointPlacement: 'on',
        color: '#0071db',
      },
    ],
  };
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) {}; // optional function, defaults to null
}
