import Component from './component';
const moment = require(`moment`);

export default class Film extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._rating = data.rating;
    this._poster = data.poster;
    this._date = data.date;
    this._duration = data.duration;
    this._genre = data.genre;
    this._description = data.description;
    this._comments = data.comments;
    this._onClick = null;
    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
  }

  update(data) {
    this._comments = data.comments;
    this.element.querySelector(`.film-card__comments`).textContent = `${this._comments.length} comments`;
  }

  _onCommentsButtonClick() {
    return typeof this._onClick === `function` && this._onClick();
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  get template() {
    return `
    <article class="film-card">
          <h3 class="film-card__title">${this._title}</h3>
          <p class="film-card__rating">${this._rating}</p>

          <p class="film-card__info">
            <span class="film-card__year">${moment(this._date).format(`YYYY`)}</span>
            <span class="film-card__duration">1h&nbsp;${this._duration.getMinutes() ? `${Number(moment(this._duration).format(`mm`))}m` : ``}</span>
              <span class="film-card__genre">${this._genre}</span>
            </p>
  
            <img src="./images/posters/${this._poster}.jpg" alt="" class="film-card__poster">
            <p class="film-card__description">${this._description}</p>
            <button class="film-card__comments">${this._comments.length ? `${this._comments.length} comments` : ``} </button> 
           <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
          </form>
        </article>
    `.trim();
  }

  bind() {
    this._element.querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onCommentsButtonClick);
  }
  unbind() {
    this._element.querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onCommentsButtonClick);
  }
}
