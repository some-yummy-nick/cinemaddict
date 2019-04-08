import Component from './component';
import moment from 'moment';
import 'moment-duration-format';

const EMOJI = {
  "neutral-face": `😐`,
  "grinning": `😀`,
  "sleeping": `😴`,
};

export default class Popup extends Component {

  constructor(data) {
    super();
    this._title = data.title;
    this._alternativeTitle = data.alternativeTitle;
    this._description = data.description;
    this._director = data.director;
    this._writers = data.writers;
    this._actors = data.actors;
    this._poster = data.poster;
    this._release = data.release;
    this._duration = data.duration;
    this._totalRating = data.totalRating;
    this._personalRating = data.personalRating;
    this._ageRating = data.ageRating;
    this._genre = data.genre;
    this._isFavorite = data.isFavorite;
    this._isWatched = data.isWatched;
    this._isWatchList = data.isWatchList;
    this._comments = data.comments;
    this._onClick = null;
    this._onEnd = null;
    this._onAddToWatchList = null;
    this._onSetFavorite = null;
    this._onSetComment = null;
    this._onCommentDelete = null;
    this._onSetRating = null;
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onCommentChange = this._onCommentChange.bind(this);
    this._onCommentDeleteClick = this._onCommentDeleteClick.bind(this);
    this._onEmojiChange = this._onEmojiChange.bind(this);
    this._onRatingChange = this._onRatingChange.bind(this);
    this._onWatchListChange = this._onWatchListChange.bind(this);
    this._onWatchedChange = this._onWatchedChange.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onEndDown = this._onEndDown.bind(this);
  }

  update(data) {
    this._comments = data.comments;
    this._personalRating = data.personalRating;
    this._isWatched = data.isWatched;
    this._isWatchList = data.isWatchList;
    this._isFavorite = data.isFavorite;
    this.element.querySelector(`.film-details__comments-list`).innerHTML = Popup._onAddComment(this._comments);
    this.element.querySelector(`.film-details__comment-input`).value = ``;
    this.element.querySelector(`.film-details__user-rating`).textContent = `Your rate ${Math.floor(this._personalRating)}`;
    this.element.querySelector(`.film-details__comments-count`).textContent = this._comments.length;
  }

  _onCloseClick() {
    return typeof this._onClick === `function` && this._onClick();
  }

  _onEndDown(evt) {
    if (evt.keyCode === 27) {
      return typeof this._onEnd === `function` && this._onEnd();
    }
    return false;
  }

  _onWatchListChange() {
    return typeof this._onAddToWatchList === `function` && this._onAddToWatchList();
  }

  _onFavoriteClick() {
    return typeof this._onSetFavorite === `function` && this._onSetFavorite();
  }

  _onWatchedChange() {
    return typeof this._onAddToWatchedList === `function` && this._onAddToWatchedList();
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

  _onCommentDeleteClick() {
    return typeof this._onCommentDelete === `function` && this._onCommentDelete();
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
    return comments.map((comment) =>comment ? `<li class="film-details__comment">
          <span class="film-details__comment-emoji">${EMOJI[comment.emotion]}</span>
          <div>
            <p class="film-details__comment-text">${comment.comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${moment(comment.date).fromNow()}</span>
            </p>
          </div>
        </li>` : ``).join(``);
  }

  static _createMapper(target) {

    return {
      "comment": (value) => (target.comments.comment = value),
      "comment-emoji": (value) => {
        target.comments.emotion = value;
      },
      "score": (value) => (target.personalRating = Number(value)),
    };
  }

  _processForm(formData) {
    const entry = {
      comments: {
        comment: ``,
        emotion: ``,
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

  set onEnd(fn) {
    this._onEnd = fn;
  }

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }

  set onSetFavorite(fn) {
    this._onSetFavorite = fn;
  }

  set onAddToWatchedList(fn) {
    this._onAddToWatchedList = fn;
  }

  set onSetComment(fn) {
    this._onSetComment = fn;
  }
  set onCommentDelete(fn) {
    this._onCommentDelete = fn;
  }

  set onSetRating(fn) {
    this._onSetRating = fn;
  }

  get template() {
    return `
   <section class="film-details">
   <style>
      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
    
        10%,
        30%,
        50%,
        70%,
        90% {
          transform: translateX(-5px);
        }
    
        20%,
        40%,
        60%,
        80% {
          transform: translateX(5px);
        }
      }
      .shake {
        animation: shake 0.6s;
      }
       .film-details__inner.error .film-details__comment-input{
        border-color: red;
      }
      
      .film-details__user-rating-input:checked + .film-details__user-rating-label.error{
        background-color: red;
      }
    </style>
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="${this._poster}" alt="${this._title}">

        <p class="film-details__age">${this._ageRating}+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${this._title}</h3>
            <p class="film-details__title-original">Original: ${this._alternativeTitle}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${this._totalRating}</p>
            <p class="film-details__user-rating">Your rate ${this._personalRating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${this._director}</td>
          </tr>
          <tr class="film-details__row">
          ${Boolean(this._writers) === false ? `
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">${this._writers.map((item) => ` ` + item)}</td>` : ``}
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${this._actors.map((item) => ` ` + item)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(this._release[`date`]).format(`DD MMMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell"> ${moment.duration(this._duration, `minutes`).format(`mm`)} min</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._release[`release_country`]}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${this._genre.map((item)=> ` ` + item)}</span></td>
          </tr>
        </table>

        <p class="film-details__film-description">${this._description}</p>
      </div>
    </div>

    <section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isWatchList ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
  
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isWatched ? `checked` : ``}>
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
        <span class="film-details__watched-status film-details__watched-status--active"></span>
        <button class="film-details__watched-reset" hidden type="button">undo</button>
      </div>

      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="${this._poster}" alt="film-poster" class="film-details__user-rating-img">
        </div>

        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">${this._title}</h3>

          <p class="film-details__user-rating-feelings">How you feel it?</p>

          <div class="film-details__user-rating-score">
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1" ${Math.floor(this._personalRating) === 1 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-1">1</label>
  
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2" ${Math.floor(this._personalRating) === 2 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-2">2</label>
  
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3" ${Math.floor(this._personalRating) === 3 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-3">3</label>
  
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4" ${Math.floor(this._personalRating) === 4 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-4">4</label>
  
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5" ${Math.floor(this._personalRating) === 5 ? `checked` : ``} >
            <label class="film-details__user-rating-label" for="rating-5">5</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6" ${Math.floor(this._personalRating) === 6 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-6">6</label>
  
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7" ${Math.floor(this._personalRating) === 7 ? `checked` : ``}>
                <label class="film-details__user-rating-label" for="rating-7">7</label>
    
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8" ${Math.floor(this._personalRating) === 8 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-8">8</label>
      
                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" ${Math.floor(this._personalRating) === 9 ? `checked` : ``}>
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
    document.addEventListener(`keydown`, this._onEndDown);
    this._element.querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._onCommentDeleteClick);
    this._element.querySelector(`form`)
      .addEventListener(`change`, this._onEmojiChange);
    this._element.querySelector(`form`)
      .addEventListener(`change`, this._onRatingChange);
    this._element.querySelector(`#watchlist`)
      .addEventListener(`change`, this._onWatchListChange);
    this._element.querySelector(`#watched`)
      .addEventListener(`change`, this._onWatchedChange);
    this._element.querySelector(`#favorite`)
      .addEventListener(`change`, this._onFavoriteClick);

  }

  unbind() {
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseClick);
    document.removeEventListener(`keydown`, this._onCommentChange);
    document.removeEventListener(`keydown`, this._onEndDown);
    this._element.querySelector(`.film-details__watched-reset`)
      .removeEventListener(`click`, this._onCommentDeleteClick);
    this._element.querySelector(`form`)
      .removeEventListener(`change`, this._onEmojiChange);
    this._element.querySelector(`form`)
      .removeEventListener(`change`, this._onRatingChange);
    this._element.querySelector(`#watchlist`)
      .removeEventListener(`change`, this._onWatchListChange);
    this._element.querySelector(`#watched`)
      .removeEventListener(`change`, this._onWatchedChange);
    this._element.querySelector(`#favorite`)
      .removeEventListener(`change`, this._onFavoriteClick);
  }
}
