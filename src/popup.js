import Component from './component';

const moment = require(`moment`);

const EMOJI = {
  "neutral-face": `😐`,
  "grinning": `😀`,
  "sleeping": `😴`,
};

export default class Popup extends Component {

  constructor(data) {
    super();
    this._poster = data.poster;
    this._date = data.date;
    this._title = data.title;
    this._rating = data.rating;
    this._score = data.score;
    this._genre = data.genre;
    this._description = data.description;
    this._duration = data.duration;
    this._isFavorite = data.isFavorite;
    this._comments = data.comments;
    this._onClick = null;
    this._onSetComment = null;
    this._onSetRating = null;
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onCommentChange = this._onCommentChange.bind(this);
    this._onEmojiChange = this._onEmojiChange.bind(this);
    this._onRatingChange = this._onRatingChange.bind(this);
  }

  update(data) {
    this._comments = data.comments;
    this._score = data.score;
    this.element.querySelector(`.film-details__comments-list`).innerHTML = Popup._onAddComment(this._comments);
    this.element.querySelector(`.film-details__comment-input`).value = ``;
    this.element.querySelector(`.film-details__user-rating`).textContent = `Your rate ${this._score}`;
  }

  _onCloseClick() {
    return typeof this._onClick === `function` && this._onClick();
  }

  _onCommentChange(evt) {
    if ((evt.ctrlKey) && evt.keyCode === 13 && document.querySelector(`.film-details__comment-input`).value.trim() !== ``) {

      const formData = new FormData(this._element.querySelector(`form`));
      const newData = this._processForm(formData);
      if (typeof this._onSetComment === `function` && this._onSetComment(newData)) {
        this.update(newData);
      }
    }

  }

  _onEmojiChange(evt) {
    if (evt.target.name === `comment-emoji`) {
      const emoji = this.element.querySelector(`.film-details__add-emoji-label`);
      emoji.textContent = evt.target.nextElementSibling.textContent;
      emoji.nextElementSibling.checked = false;
    }
  }

  _onRatingChange(evt) {
    if (evt.target.name === `score`) {
      const formData = new FormData(this._element.querySelector(`form`));
      const newData = this._processForm(formData);
      if (typeof this._onSetRating === `function` && this._onSetRating(newData)) {
        this.update(newData);
      }
    }
  }

  static _onAddComment(comments) {
    return comments.map((comment) => `<li class="film-details__comment">
          <span class="film-details__comment-emoji">${comment.emoji}</span>
          <div>
            <p class="film-details__comment-text">${comment.text}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${new Date().getDate() - new Date(comment.date).getDate()} days ago</span>
            </p>
          </div>
        </li>`).join(``);
  }

  static _createMapper(target) {

    return {
      "comment": (value) => (target.comments.text = value),
      "comment-emoji": (value) => {
        target.comments.emoji = EMOJI[value];
      },
      "score": (value) => (target.score = Number(value)),
    };
  }

  _processForm(formData) {
    const entry = {
      comments: {
        text: ``,
        emoji: ``,
        author: `New user`,
        date: Date.now(),
      },
      score: 5,
    };
    const filmEditMapper = Popup._createMapper(entry);

    Array.from(formData.entries()).forEach(
        ([property, value]) => filmEditMapper[property] && filmEditMapper[property](value)
    );
    return entry;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  set onSetComment(fn) {
    this._onSetComment = fn;
  }

  set onSetRating(fn) {
    this._onSetRating = fn;
  }

  get template() {
    return `
   <section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="images/posters/${this._poster}.jpg" alt="${this._title}">

        <p class="film-details__age">18+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${this._title}</h3>
            <p class="film-details__title-original">Original: ${this._title}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${this._rating}</p>
            <p class="film-details__user-rating">Your rate ${this._score}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">Brad Bird</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">Brad Bird</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">Samuel L. Jackson, Catherine Keener, Sophia Bush</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${moment(this._date).format(`DD MMMM YYYY`)} (USA)</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell"> ${60 + Number(moment(this._duration).format(`mm`))} min</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">USA</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${this._genre}</span></td>
          </tr>
        </table>

        <p class="film-details__film-description">${this._description}</p>
      </div>
    </div>

    <section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
      <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" checked>
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
    </section>

    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

      <ul class="film-details__comments-list">
      ${Popup._onAddComment(this._comments)}
      </ul>

      <div class="film-details__new-comment">
        <div>
          <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
          <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
            <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
            <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
          </div>
        </div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
        </label>
      </div>
    </section>

    <section class="film-details__user-rating-wrap">
      <div class="film-details__user-rating-controls">
        <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
        <button class="film-details__watched-reset" type="button">undo</button>
      </div>

      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="images/posters/${this._poster}.jpg" alt="film-poster" class="film-details__user-rating-img">
        </div>

        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">${this._title}</h3>

          <p class="film-details__user-rating-feelings">How you feel it?</p>

          <div class="film-details__user-rating-score">
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1" ${this._score === 1 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-1">1</label>
  
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2" ${this._score === 2 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-2">2</label>
  
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3" ${this._score === 3 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-3">3</label>
  
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4" ${this._score === 4 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-4">4</label>
  
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5" ${this._score === 5 ? `checked` : ``} >
            <label class="film-details__user-rating-label" for="rating-5">5</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6" ${this._score === 6 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-6">6</label>
  
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7" ${this._score === 7 ? `checked` : ``}>
                <label class="film-details__user-rating-label" for="rating-7">7</label>
    
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8" ${this._score === 8 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-8">8</label>
      
                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" ${this._score === 9 ? `checked` : ``}>
                    <label class="film-details__user-rating-label" for="rating-9">9</label>
        
                  </div>
                </section>
              </div>
            </section>
          </form>
        </section>
`.trim();
  }

  bind() {
    this._element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseClick);
    document.addEventListener(`keydown`, this._onCommentChange);
    this._element.querySelector(`form`)
      .addEventListener(`change`, this._onEmojiChange);
    this._element.querySelector(`form`)
      .addEventListener(`change`, this._onRatingChange);
  }

  unbind() {
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseClick);
    this._element.querySelector(`form`)
      .removeEventListener(`change`, this._onEmojiChange);
    this._element.querySelector(`form`)
      .removeEventListener(`change`, this._onRatingChange);
  }
}
