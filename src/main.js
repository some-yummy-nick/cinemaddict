import makeFilter from './make-filter.js';
import makeFilm, {getFilm} from './make-film.js';

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

const renderFilms = (dist, number = 7) => {
  dist.insertAdjacentHTML(`beforeend`, new Array(number)
    .fill(``)
    .map(() => makeFilm(getFilm()))
    .join(``));
};

renderFilms(filmsContainer);

for (let block of filmsTop) {
  renderFilms(block, 2);
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


