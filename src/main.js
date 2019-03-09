import makeFilter from './make-filter';
import Film from './film';
import getFilm from './getFilm';
import Popup from './popup';

const doc = document;

const getRandomInRange = (min = 1, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const filter = `
 ${makeFilter(`all`, null, `active`)}
 ${makeFilter(`watchlist`, getRandomInRange())}
 ${makeFilter(`history`, getRandomInRange())} 
 ${makeFilter(`favorites`, getRandomInRange())}
 ${makeFilter(`stats`, null, `additional`)}
 `;

const filters = doc.querySelector(`.main-navigation`);

filters.insertAdjacentHTML(`afterBegin`, filter);

const filmsContainer = document.querySelector(`.films .films-list__container`);
const filmsTop = document.querySelectorAll(`.films-list--extra .films-list__container`);

const renderFilms = (dist, number) => {
  for (let i = 0; i < number; i++) {
    const film = getFilm();
    const filmComponent = new Film(film);
    const popup = new Popup(film);

    dist.appendChild(filmComponent.render());

    filmComponent.onClick = () => {
      popup.render();
      doc.querySelector(`body`).append(popup.element);
    };

    popup.onClick = () => {
      doc.querySelector(`.film-details`).remove();
      popup.unrender();
    };
  }
};

renderFilms(filmsContainer, 7);

for (let block of filmsTop) {
  renderFilms(block, 7);
}

const filterItems = doc.querySelectorAll(`.main-navigation__item`);

for (let filterItem of filterItems) {
  filterItem.addEventListener(`click`, () => {
    const randomNumber = getRandomInRange(1, 10);
    filmsContainer.innerHTML = ``;
    renderFilms(filmsContainer, randomNumber);
    for (let block of filmsTop) {
      block.innerHTML = ``;
      const anotherRandomNumber = getRandomInRange(1, 5);
      renderFilms(block, anotherRandomNumber);
    }
  });
}


