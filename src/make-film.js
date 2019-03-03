export default (film) => `
<article class="film-card">
          <h3 class="film-card__title">${film.title}</h3>
          <p class="film-card__rating">${film.rating}</p>

          <p class="film-card__info">
            <span class="film-card__year">${new Date(film.date).getFullYear()}</span>
            <span class="film-card__duration">1h&nbsp;${film.duration.getMinutes() ? `${new Date(film.duration).getMinutes()}m` : ``}</span>
            <span class="film-card__genre">${film.genre}</span>
          </p>

          <img src="./images/posters/${film.poster}.jpg" alt="" class="film-card__poster">
          <p class="film-card__description">${film.description}</p>
            ${film.comments ? `<button class="film-card__comments">${film.comments} comments</button>` : ``}
           <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
          </form>
        </article>
`;

const name = () => {
  const numWords = 2;
  const words = [`туманность `, `2 `, `любовь `, `снег `, `война `, `милость `, `бог `, `ярость `, `деньги `, `письмо `];

  const rand = (from, to) => {
    const n = Math.floor((to - from + 1) * (Math.random() % 100));
    return (from + n);
  };

  const newWords = words;
  const loops = (words.length - numWords);

  for (let i = 0; i < loops; i++) {
    newWords.splice(rand(0, words.length - 1), 1);
  }

  return newWords.join(``);
};

const pickRandom = (arr, count) => {
  const out = [];
  const clone = arr.slice(0, arr.length);

  for (let i = 0; i < count; i++) {
    const pick = Math.floor(Math.random() * clone.length);

    if (clone[pick] !== undefined) {
      out.push(clone[pick]);
      clone.splice(pick, 1);
    }
  }
  return out;
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


export function getFilm() {
  const film = {
    title: name(),
    poster: [`accused`, `blackmail`, `blue-blazes`, `fuga-da-new-york`, `moonrise`, `three-friends`][Math.floor(Math.random() * 6)],
    description: pickRandom(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `), getRandomInt(0, 3)),
    date: Date.now() - Math.floor(Math.random() * 7) * 30 * 12 * 7 * 24 * 60 * 60 * 1000,
    duration: new Date(Math.floor(Math.random() * 60) * 5 * 60 * 1000),
    isFavorite: [true, false][Math.floor(Math.random() * 2)],
    comments: getRandomInt(0, 50),
    genre: [`Comedy`, `Thriller`, `Horror`, `Adventures`, `Romantic`, `Drama`, `Action`, `Detective`, `Mystic`, `Documentary`, `Fantasy`][Math.floor(Math.random() * 11)],
    rating: (Math.random() * (10 - 2 + 1) + 2).toFixed(1)
  };
  return film;
}
