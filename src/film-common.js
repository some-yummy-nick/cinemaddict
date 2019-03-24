import getFilm from './get-film';

function filmCommon(number = 7) {
  const films = [];

  for (let i = 0; i < number; i++) {
    films.push(getFilm());
  }
  return films;
}

export default filmCommon;
