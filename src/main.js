import filmCommon from './film-common';
import Film from './film';
import Filter from './filter';
import Popup from './popup';
import {getRandomInRange} from './utils';

const doc = document;

const filmsContainer = doc.querySelector(`.films .films-list__container`);
const filtersContainer = doc.querySelector(`.main-navigation`);
const filmsTop = document.querySelectorAll(`.films-list--extra .films-list__container`);

const filtersArray = [`all`, `watchlist`, `history`];

for (let name of filtersArray) {
  const filter = new Filter({title: `${name}`});
  filtersContainer.appendChild(filter.render());
  const films = filmCommon(7);

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

      default:
        return false;
    }

  };

}


const renderFilms = (dist, films) => {
  dist.innerHTML = ``;

  for (let i = 0; i < films.length; i++) {
    const film = films[i];
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


