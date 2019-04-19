const MIN = 1;
const MAX = 100;

export const pickRandom = (arr, count) => {
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

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const getRandomInRange = (min = MIN, max = MAX) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function getGenres(films) {
  let genreArr = [];
  films.map((item)=>{
    genreArr.push(item.genre);
  });
  genreArr = genreArr.join().split(`,`);
  return genreArr.reduce(function (acc, el) {
    if (el !== ``) {
      acc[el] = (acc[el] || 0) + 1;

    }
    return acc;
  }, {});
}

export function getMax(films) {
  const result = {};
  let genreArr = [];
  films.map((item)=>{
    genreArr.push(item.genre);
  });
  genreArr = genreArr.join().split(`,`);
  for (let i = 0; i < genreArr.length; i++) {
    let a = genreArr[i];
    if (result[a] !== undefined) {
      ++result[a];
    } else {
      result[a] = 1;
    }
  }

  let maxGenre = {
    number: 0,
    genre: ``
  };

  for (let key in result) {
    if (result.hasOwnProperty(key)) {
      if (key !== `` && result[key] > maxGenre.number) {
        maxGenre.number = result[key];
        maxGenre.genre = key;
      }
    }
  }
  return maxGenre;
}

