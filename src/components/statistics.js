import AbstractComponent from "./abstract-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {TYPES, TypeIcons} from '../const';
import moment from 'moment';

const ChartName = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME_SPENT: `TIME SPENT`
};

const ChartSettings = {
  BAR_HEIGHT: 55,
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 50,
  LABELS_FONT_SIZE: 13,
  TITLE_FONT_SIZE: 23,
  LAYOUT_PADDING_LEFT: 45,
  SCALES_Y_PADDING: 5,
  SCALES_Y_FONTSIZE: 13,
};

const createStatisticsTemplate = () => {
  return (/* html */
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

const initChart = (ctx, data, name, format) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(data).map((label) => `${TypeIcons.get(label)} ${label.toUpperCase()}`),
      datasets: [{
        data: Object.values(data),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: ChartSettings.BAR_THICKNESS,
        minBarLength: ChartSettings.MIN_BAR_LENGTH,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          fontSize: ChartSettings.LABELS_FONT_SIZE,
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: format
        }
      },
      title: {
        display: true,
        text: name,
        fontColor: `#000000`,
        fontSize: ChartSettings.TITLE_FONT_SIZE,
        position: `left`
      },
      layout: {
        padding: {
          left: ChartSettings.LAYOUT_PADDING_LEFT,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: ChartSettings.SCALES_Y_PADDING,
            fontSize: ChartSettings.SCALES_Y_FONTSIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

export const moneyChart = (ctx, waypoints) => {
  const parseData = waypoints
    .reduce((sum, waypoint) => {
      sum[waypoint.currentType] = (sum[waypoint.currentType] || 0) + waypoint.price;
      return sum;
    }, {});

  const sortedData = Object.entries(parseData).sort((a, b) => b[1] - a[1]);
  const data = Object.fromEntries(sortedData);

  ctx.height = ChartSettings.BAR_HEIGHT * sortedData.length;

  const formatter = (val) => `${val} €`;
  return initChart(ctx, data, ChartName.MONEY, formatter);
};

export const timeSpendChart = (ctx, waypoints) => {
  const parseData = waypoints
    .reduce((time, waypoint) => {
      const dateFrom = moment(waypoint.startTime);
      const dateTo = moment(waypoint.endTime);
      const diff = moment.duration(dateTo.diff(dateFrom)).hours();

      time[waypoint.currentType] = (time[waypoint.currentType] || 0) + diff;
      return time;
    }, {});

  const sortedData = Object.entries(parseData).sort((a, b) => b[1] - a[1]);
  const data = Object.fromEntries(sortedData);

  ctx.height = ChartSettings.BAR_HEIGHT * sortedData.length;

  const formatter = (val) => `${val} H`;
  return initChart(ctx, data, ChartName.TIME_SPENT, formatter);
};

export const transportChart = (ctx, waypoints) => {
  const types = [...TYPES.TRANSFERS, ...TYPES.ACTIVITIES];

  const parseData = waypoints
    .filter((waypoint) => types.includes(waypoint.currentType))
    .reduce((count, waypoint) => {
      count[waypoint.currentType] = (count[waypoint.currentType] || 0) + 1;
      return count;
    }, {});

  const sortedData = Object.entries(parseData).sort((a, b) => b[1] - a[1]);
  const data = Object.fromEntries(sortedData);

  ctx.height = ChartSettings.BAR_HEIGHT * sortedData.length;

  const formatter = (val) => `${val}x`;
  return initChart(ctx, data, ChartName.TRANSPORT, formatter);
};

export default class Statistics extends AbstractComponent {
  constructor(waypointsModel) {
    super();
    this._waypointsModel = waypointsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  hide() {
    super.hide();
  }

  show() {
    super.show();
    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();
    const ctxMoney = element.querySelector(`.statistics__chart--money`);
    const ctxTransport = element.querySelector(`.statistics__chart--transport`);
    const ctxTimeSpend = element.querySelector(`.statistics__chart--time`);

    const waypoints = this._waypointsModel.getWaypointsAll();
    this._resetCharts([this._moneyChart, this._transportChart, this._timeSpendChart]);

    this._moneyChart = moneyChart(ctxMoney, waypoints);
    this._transportChart = transportChart(ctxTransport, waypoints);
    this._timeSpendChart = timeSpendChart(ctxTimeSpend, waypoints);
  }

  _resetCharts(charts) {
    charts.forEach((chart) => {
      if (chart) {
        chart.destroy();
        chart = null;
      }
    });
  }
}
