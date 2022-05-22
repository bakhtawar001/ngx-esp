# Charts

For charts we are using [Highcharts](https://www.highcharts.com/) along with [Angular Highcharts](https://github.com/highcharts/highcharts-angular);

## Example

Component Markup

```html
<highcharts-chart
  [Highcharts]="Highcharts"
  [options]="chartOptions"
  style="width: 100%; height: 400px; display: block"
></highcharts-chart>
```

Data structure:

```js
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
```
