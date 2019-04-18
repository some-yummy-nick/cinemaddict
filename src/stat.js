import Component from './component';
import {getMax} from "./my-chart";
import moment from 'moment';
import 'moment-duration-format';

const reducer = (accumulator, currentValue) => accumulator + currentValue;

export default class Stat extends Component {

  constructor(data) {
    super();
    this._watched = data.filter((item) => {
      return item.isWatched;
    }).length;

    this._duration = data.map((item) => {
      return item.duration;
    });

    this._totalDuration = this._duration.reduce(reducer);

    this._popularGenre = getMax(data);
  }

  update(data) {
    this._watched = data.filter((item) => {
      return item.isWatched;
    }).length;

    this._duration = data.map((item) => {
      return item.duration;
    });

    this._totalDuration = this._duration.reduce(reducer);

    this._popularGenre = getMax(data);
  }

  get template() {
    return `
    <section class="statistic  visually-hidden">
  <p class="statistic__rank">Your rank <span class="statistic__rank-label">${this._popularGenre.genre}-Fighter</span></p>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text"><span class="js-watched">${this._watched}</span> <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text js-duration">${moment.duration(this._totalDuration, `minutes`).format(`h[<span class="statistic__item-description">h&nbsp;</span>]mm[<span class="statistic__item-description">m</span>]`)}</p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text js-top-genre">${this._popularGenre.genre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>
</section>
`.trim();
  }
}
