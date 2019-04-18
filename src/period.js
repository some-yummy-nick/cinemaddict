import Component from "./component";
import moment from "moment";
import getChart from "./my-chart";

export default class Period extends Component {

  constructor(data) {
    super();
    this.data = data;
    this._onChange = null;
    this._onChangeClick = this._onChangeClick.bind(this);
  }

  get template() {
    return `
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>
  `.trim();
  }

  _onChangeClick(evt) {
    let newArr = [];
    if (evt.target.name === `statistic-filter`) {

      if (evt.target.value === `all-time`) {
        newArr = this.data;

      } else if (evt.target.value === `today`) {
        newArr = this.data.filter((item) => {
          return moment(item.watchingDate).isSame(Date.now(), `day`);
        });
      } else if (evt.target.value === `week`) {
        newArr = this.data.filter((item) => {
          return moment(item.watchingDate).isSame(Date.now(), `week`);
        });
      } else if (evt.target.value === `month`) {
        newArr = this.data.filter((item) => {
          return moment(item.watchingDate).isSame(Date.now(), `month`);
        });
      } else if (evt.target.value === `year`) {
        newArr = this.data.filter((item) => {
          return moment(item.watchingDate).isSame(Date.now(), `year`);
        });
      }
      getChart(newArr);

    }
    return typeof this._onChange === `function` && this._onChange(newArr);

  }

  set onChange(fn) {
    this._onChange = fn;
  }

  bind() {
    document.addEventListener(`change`, this._onChangeClick);
  }

  unbind() {
    document.removeEventListener(`change`, this._onChangeClick);
  }

}
