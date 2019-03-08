import {pickRandom} from './utils';
import {getRandomInt} from './utils';

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

export default function getFilm() {
  return {
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
}
