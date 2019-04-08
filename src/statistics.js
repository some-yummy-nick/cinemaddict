import {getMax} from "./my-chart";
import moment from 'moment';
import 'moment-duration-format';

export default function statistics(films) {

  const watched = films.filter((item) => {
    return item.isWatched;
  }).length;

  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  const duration = films.map((item) => {
    return item.duration;
  });

  const totalDuration = duration.reduce(reducer);
  const popularGenre = getMax(films);
  const newElement = document.createElement(`div`);

  newElement.innerHTML = `
<section class="statistic  visually-hidden">
  <p class="statistic__rank">Your rank <span class="statistic__rank-label">${popularGenre.genre}-Fighter</span></p>

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

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text js-watched">${watched} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${moment.duration(totalDuration, `minutes`).format(`h[<span class="statistic__item-description">h&nbsp;</span>]mm[<span class="statistic__item-description">m</span>]`)}</p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${popularGenre.genre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>
`.trim();

  if (document.querySelector(`.js-watched`)) {
    document.querySelector(`.js-watched`).textContent = watched;
  }

  return newElement.firstChild;
}
