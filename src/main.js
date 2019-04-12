import Film from './film';
import Filter from './filter';
import Search from './search';
import Popup from './popup';
import statistics from './statistics';
import getChart from "./my-chart";
import API from './api';
import period from "./period";
import moment from 'moment';
import 'moment-duration-format';
import {getMax} from "./my-chart";

const mainContainer = document.querySelector(`.main`);
const filmsWrapper = document.querySelector(`.films`);
const filmsContainer = document.querySelector(`.films .films-list__container`);
const filmsContainerTopRated = document.querySelectorAll(`.films-list--extra`)[0].querySelector(`.films-list__container`);
const filmsContainerTopCommented = document.querySelectorAll(`.films-list--extra`)[1].querySelector(`.films-list__container`);
const filtersContainer = document.querySelector(`.main-navigation`);
const headerLogo = document.querySelector(`.header__logo.logo`);
const AUTHORIZATION = `Basic A8XiP3pLcHBFj3kt=`;
const END_POINT = ` https://es8-demo-srv.appspot.com/moowle`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const filtersArray = [`all`, `watchlist`, `history`, `stats`];
const RATINGS_NOVICE = 10;
const RATINGS_FAN = 20;
const RATINGS_MORE_BUFF = 21;

let filmFromServer;

filmsContainer.textContent = `Loading movies...`;
let numberItems = 10;
api.getFilms()
  .then((films) => {
    filmFromServer = films.slice();

    function setTopRated() {
      const filmTop = filmFromServer.map((item) => {
        return item.totalRating;
      });
      filmTop.sort(function (left, right) {
        return right - left;
      });

      const filmTopNew = filmFromServer.filter((item) => {
        return item.totalRating === filmTop[0] || item.totalRating === filmTop[1];
      });

      const arr = [];

      arr.push(filmTopNew[0]);
      arr.push(filmTopNew[1]);

      renderFilms(filmsContainerTopRated, arr);
    }

    setTopRated();

    function setTopCommented() {
      const filmTop = filmFromServer.map((item) => {
        return item.comments.length;
      });
      filmTop.sort(function (left, right) {
        return right - left;
      });
      const filmTopNew = filmFromServer.filter((item) => {
        return item.comments.length === filmTop[0] || item.comments.length === filmTop[1];
      });

      const arr = [];

      arr.push(filmTopNew[0]);
      arr.push(filmTopNew[1]);

      renderFilms(filmsContainerTopCommented, arr);
    }

    setTopCommented();

    films.splice(5);
    renderFilms(filmsContainer, films);
    const arrWatched = films.filter((it) => it.isWatched);
    mainContainer.appendChild(statistics(arrWatched));
    const statisticsRank = document.querySelector(`.statistic__rank`);
    statisticsRank.insertAdjacentElement(`afterend`, period());
    const search = new Search(films);
    search.render();
    headerLogo.insertAdjacentElement(`afterend`, search.element);
    search.onChange = (value) => {
      const newArr = films.filter((item) => {
        return item.title.toLowerCase().includes(value);
      });
      renderFilms(filmsContainer, newArr);
    };
    setStats(films);
  })
  .catch(() => {
    filmsContainer.textContent = `Something went wrong while loading your tasks. Check your connection or try again later`;
  });

document.querySelector(`.films-list__show-more`).addEventListener(`click`, () => {
  const filmsToRender = filmFromServer.slice();
  filmsToRender.splice(numberItems);
  if (numberItems >= filmFromServer.length) {
    document.querySelector(`.films-list__show-more`).remove();
  }
  numberItems += 5;

  renderFilms(filmsContainer, filmsToRender);
});

function setTitle() {

  api.getFilms()
    .then((films) => {
      const watchedNumber = films.filter((item) => {
        return item.isWatched;
      });

      if (watchedNumber.length <= RATINGS_NOVICE && watchedNumber.length >= 1) {
        document.querySelector(`.profile__rating`).textContent = `novice`;
      }

      if (watchedNumber.length <= RATINGS_FAN && watchedNumber.length > RATINGS_NOVICE) {
        document.querySelector(`.profile__rating`).textContent = `fan`;
      }

      if (watchedNumber.length >= RATINGS_MORE_BUFF) {
        document.querySelector(`.profile__rating`).textContent = `movie buff`;
      }
    });
}

setTitle();

function setFilter() {
  filtersContainer.innerHTML = ``;

  for (let name of filtersArray) {
    const filter = new Filter({title: `${name}`});
    filtersContainer.appendChild(filter.render());

    filter.onFilter = (filterName) => {
      switch (filterName) {
        case `all`:
          return renderFilms(filmsContainer, filmFromServer);

        case `watchlist`: {
          const newArr = filmFromServer.filter((it) => it.isWatchList);
          return renderFilms(filmsContainer, newArr);
        }

        case `history`: {
          const newArr = filmFromServer.filter((it) => it.isWatched);
          return renderFilms(filmsContainer, newArr);
        }

        case `stats`: {
          const newArr = filmFromServer.filter((it) => it.isWatched);

          return statistics(newArr);
        }

        default:
          return false;
      }

    };

  }
}

setFilter();

function setStats(filmsToStat) {
  const menuItems = document.querySelectorAll(`.main-navigation__item`);

  for (let item of menuItems) {
    item.addEventListener(`click`, function () {
      const statisticsContainer = document.querySelector(`.statistic`);
      if (item.classList.contains(`js-stats`)) {
        getChart(filmsToStat);
        statisticsContainer.classList.remove(`visually-hidden`);
        filmsWrapper.classList.add(`visually-hidden`);
      } else {
        statisticsContainer.classList.add(`visually-hidden`);
        filmsWrapper.classList.remove(`visually-hidden`);
      }

    });
  }
}

function updateStats(newFilms) {
  const arrWatched = newFilms.filter((it) => it.isWatched);
  const rank = document.querySelector(`.statistic__rank-label`);
  const watched = document.querySelector(`.js-watched`);
  const topGenre = document.querySelector(`.js-top-genre`);
  const totalDurationNumber = document.querySelector(`.js-duration`);
  const popularGenre = getMax(arrWatched);
  const watchedNumber = arrWatched.filter((item) => {
    return item.isWatched;
  }).length;
  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  const duration = arrWatched.map((item) => {
    return item.duration;
  });

  const totalDuration = duration.reduce(reducer);
  rank.textContent = `${popularGenre.genre}-Fighter`;
  watched.textContent = watchedNumber;
  topGenre.textContent = popularGenre.genre;
  totalDurationNumber.innerHTML = `${moment.duration(totalDuration, `minutes`).format(`h[<span class="statistic__item-description">h&nbsp;</span>]mm[<span class="statistic__item-description">m</span>]`)}`;
}

const renderFilms = (dist, filmsInner) => {
  dist.innerHTML = ``;

  for (let i = 0; i < filmsInner.length; i++) {
    const film = filmsInner[i];
    const filmComponent = new Film(film);
    const popup = new Popup(film);

    dist.appendChild(filmComponent.render());

    filmComponent.onClick = () => {
      popup.render();
      document.querySelector(`body`).append(popup.element);
    };

    filmComponent.onAddToWatchList = () => {
      film.isWatchList = !film.isWatchList;

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          popup.render();
          popup.update(newFilm);
          setFilter();
          api.getFilms()
            .then((films) => {
              setStats(films);
              updateStats(films);
            });
        });
    };

    popup.onAddToWatchList = () => {
      film.isWatchList = !film.isWatchList;

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          popup.update(newFilm);
          filmComponent.render();
          filmComponent.update(newFilm);
        });
    };

    filmComponent.onAddToWatchedList = () => {
      film.isWatched = !film.isWatched;
      film.watchingDate = Date.now();

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          popup.render();
          popup.update(newFilm);
          setFilter();
          api.getFilms()
            .then((films) => {
              setStats(films);
              updateStats(films);
            });
        });
      setTitle();
    };

    popup.onAddToWatchedList = () => {
      film.isWatched = !film.isWatched;
      film.watchingDate = Date.now();

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          popup.update(newFilm);
          filmComponent.render();
          filmComponent.update(newFilm);
          api.getFilms()
            .then((films) => {
              setStats(films);
              updateStats(films);
            });
        });
      setTitle();
    };

    filmComponent.onSetFavorite = () => {
      film.isFavorite = !film.isFavorite;

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          popup.render();
          popup.update(newFilm);
          setFilter();
          api.getFilms()
            .then((films) => {
              setStats(films);
              updateStats(films);
            });
        });

    };

    popup.onSetFavorite = () => {
      film.isFavorite = !film.isFavorite;

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          popup.update(newFilm);
          filmComponent.render();
          filmComponent.update(newFilm);
        });
    };

    const block = () => {
      popup.element.querySelector(`.film-details__inner`).classList.remove(`shake`);
      popup.element.querySelectorAll(`form input, form select, form textarea, form button`)
        .forEach((elem) => elem.setAttribute(`disabled`, `disabled`));
    };

    const unblock = () => {
      popup.element.querySelectorAll(`form input, form select, form textarea, form button`)
        .forEach((elem) => elem.removeAttribute(`disabled`));
    };

    popup.onSetComment = (formdata) => {
      film.comments.push(formdata.comments);
      block();
      popup.element.querySelector(`.film-details__inner`).classList.remove(`shake`, `error`);
      popup.element.querySelector(`.film-details__watched-status`).textContent = `Comment added`;
      popup.element.querySelector(`.film-details__watched-reset`).removeAttribute(`hidden`);

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          unblock();
          popup.update(newFilm);
          filmComponent.update(newFilm);
          filmComponent.render();
        })
        .catch(() => {
          popup.element.querySelector(`.film-details__inner`).classList.add(`shake`, `error`);
          unblock();
        });
    };

    popup.onCommentDelete = () => {
      film.comments.pop();
      block();
      popup.element.querySelector(`.film-details__inner`).classList.remove(`shake`, `error`);
      popup.element.querySelector(`.film-details__watched-status`).textContent = `Comment deleted`;
      popup.element.querySelector(`.film-details__watched-reset`).setAttribute(`hidden`, `true`);
      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          unblock();
          popup.update(newFilm);
          filmComponent.update(newFilm);
          filmComponent.render();
        })
        .catch(() => {
          popup.element.querySelector(`.film-details__inner`).classList.add(`shake`, `error`);
          unblock();
        });
    };

    popup.onSetRating = (formdata) => {
      if (formdata.comments.comment !== ``) {
        film.comments.push(formdata.comments);
      }
      block();
      film.personalRating = formdata.personalRating;
      popup.element.querySelector(`#rating-${film.personalRating}`).nextElementSibling.classList.remove(`error`);
      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          unblock();
          popup.update(newFilm);
          filmComponent.update(newFilm);
          filmComponent.render();
        })
        .catch(() => {
          popup.element.querySelector(`.film-details__inner`).classList.add(`shake`);
          popup.element.querySelector(`#rating-${film.personalRating}`).nextElementSibling.classList.add(`error`);
          unblock();
        });
    };

    popup.onClick = () => {
      popup.unrender();
    };

    popup.onEnd = () => {
      popup.unrender();
    };
  }
};

document.addEventListener(`change`, (evt) => {
  if (evt.target.name === `statistic-filter`) {
    let newArr = [];

    if (evt.target.value === `all-time`) {
      newArr = filmFromServer;
    } else if (evt.target.value === `today`) {
      newArr = filmFromServer.filter((item) => {
        return moment(item.watchingDate).isSame(Date.now(), `day`);
      });
    } else if (evt.target.value === `week`) {
      newArr = filmFromServer.filter((item) => {
        return moment(item.watchingDate).isSame(Date.now(), `week`);
      });
    } else if (evt.target.value === `month`) {
      newArr = filmFromServer.filter((item) => {
        return moment(item.watchingDate).isSame(Date.now(), `month`);
      });
    } else if (evt.target.value === `year`) {
      newArr = filmFromServer.filter((item) => {
        return moment(item.watchingDate).isSame(Date.now(), `year`);
      });
    }
    getChart(newArr);
    updateStats(newArr);
  }
});

