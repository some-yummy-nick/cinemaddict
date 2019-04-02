import Film from './film';
import Filter from './filter';
import Popup from './popup';
import statistics from './statistics';
import getChart from "./my-chart";
import API from './api';

const doc = document;
const mainContainer = doc.querySelector(`.main`);
const filmsWrapper = document.querySelector(`.films`);
const filmsContainer = doc.querySelector(`.films .films-list__container`);
const filtersContainer = doc.querySelector(`.main-navigation`);
const AUTHORIZATION = `Basic A8XoP3pLaHAAh2kt=`;
const END_POINT = ` https://es8-demo-srv.appspot.com/moowle`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const filtersArray = [`all`, `watchlist`, `history`, `stats`];

let filmFromServer;
filmsContainer.textContent = `Loading movies...`;
api.getFilms()
  .then((films) => {
    filmFromServer = films;
    renderFilms(filmsContainer, films);
    mainContainer.appendChild(statistics(filmFromServer));
  })
  .catch(() => {
    filmsContainer.textContent = `Something went wrong while loading your tasks. Check your connection or try again later`;
  });

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
          return statistics(filmFromServer);
        }

        default:
          return false;
      }

    };

  }
}
setFilter();


function setStats() {
  const menuItems = document.querySelectorAll(`.main-navigation__item`);

  for (let item of menuItems) {
    item.addEventListener(`click`, function () {
      const statisticsContainer = document.querySelector(`.statistic`);
      if (item.classList.contains(`js-stats`)) {
        getChart(filmFromServer);
        statisticsContainer.classList.remove(`visually-hidden`);
        filmsWrapper.classList.add(`visually-hidden`);
      } else {
        statisticsContainer.classList.add(`visually-hidden`);
        filmsWrapper.classList.remove(`visually-hidden`);
      }

    });
  }
}
setStats();

const renderFilms = (dist, filmsInner) => {
  dist.innerHTML = ``;

  for (let i = 0; i < filmsInner.length; i++) {
    const film = filmsInner[i];
    const filmComponent = new Film(film);
    const popup = new Popup(film);

    dist.appendChild(filmComponent.render());

    filmComponent.onClick = () => {
      popup.render();
      doc.querySelector(`body`).append(popup.element);
    };

    filmComponent.onAddToWatchList = () => {
      film.isWatchList = !film.isWatchList;

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          popup.render();
          popup.update(newFilm);
          setFilter();
          setStats();
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

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          popup.render();
          popup.update(newFilm);
          setFilter();
          setStats();
        });

    };

    popup.onAddToWatchedList = () => {
      film.isWatched = !film.isWatched;

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          popup.update(newFilm);
          filmComponent.render();
          filmComponent.update(newFilm);
        });
    };

    filmComponent.onSetFavorite = () => {
      film.isFavorite = !film.isFavorite;

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          popup.render();
          popup.update(newFilm);
          setFilter();
          setStats();
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

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          unblock();
          popup.update(newFilm);
          filmComponent.update(newFilm);
          filmComponent.render();
        })
        .catch(()=>{
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
        .catch(()=>{
          popup.element.querySelector(`.film-details__inner`).classList.add(`shake`);
          popup.element.querySelector(`#rating-${film.personalRating}`).nextElementSibling.classList.add(`error`);
          unblock();
        });
    };

    popup.onClick = () => {
      popup.unrender();
    };
  }
};


