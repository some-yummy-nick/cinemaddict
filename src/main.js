import filmCommon from './film-common';
import Film from './film';
import Filter from './filter';
import Popup from './popup';
import {getRandomInRange} from './utils';
import statistics from './statistics';
import getChart from "./my-chart";

const doc = document;

const mainContainer = doc.querySelector(`.main`);
const filmsWrapper = document.querySelector(`.films`);
const filmsContainer = doc.querySelector(`.films .films-list__container`);
const filtersContainer = doc.querySelector(`.main-navigation`);
const filmsTop = doc.querySelectorAll(`.films-list--extra .films-list__container`);
const films = filmCommon(7);

const filtersArray = [`all`, `watchlist`, `history`, `stats`];

for (let name of filtersArray) {
  const filter = new Filter({title: `${name}`});
  filtersContainer.appendChild(filter.render());

  filter.onFilter = (filterName) => {
    switch (filterName) {
      case `all`:
        return renderFilms(filmsContainer, films);

      case `watchlist`: {
        const newArr = films.filter((it) => it.isWatchList);
        return renderFilms(filmsContainer, newArr);
      }

      case `history`: {
        const newArr = films.filter((it) => it.isWatched);
        return renderFilms(filmsContainer, newArr);
      }

      case `stats`: {
        return statistics(films);
      }

      default: return false;

    }

  };

}
mainContainer.appendChild(statistics(films));

const menuItems = document.querySelectorAll(`.main-navigation__item`);

for (let item of menuItems) {
  item.addEventListener(`click`, function () {
    const statisticsContainer = document.querySelector(`.statistic`);
    if (item.classList.contains(`js-stats`)) {
      getChart(films);
      statisticsContainer.classList.remove(`visually-hidden`);
      filmsWrapper.classList.add(`visually-hidden`);
    } else {
      statisticsContainer.classList.add(`visually-hidden`);
      filmsWrapper.classList.remove(`visually-hidden`);
    }

  });
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
      doc.querySelector(`body`).append(popup.element);
    };

    filmComponent.onAddToWatchList = () => {
      popup._isWatchList = !popup._isWatchList;
    };

    filmComponent.onMarkAsWatched = () => {
      popup._isWatched = !popup._isWatched;
    };

    popup.onClick = () => {
      popup.unrender();
    };

    popup.onSetComment = (formdata) => {
      film.comments.push(formdata.comments);
      popup.update(film);
      filmComponent.update(film);
    };

    popup.onSetRating = (formdata) => {
      if (formdata.comments.text !== ``) {
        film.comments.push(formdata.comments);
      }
      film.score = formdata.score;
      popup.update(film);
    };
  }
};

renderFilms(filmsContainer, filmCommon(7));

for (let block of filmsTop) {
  renderFilms(block, filmCommon(getRandomInRange(1, 5)));
}


