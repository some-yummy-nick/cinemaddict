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

export const getRandomInRange = (min = 1, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
