export default (caption, count, addClass) => `
    <a href="#${caption}" 
    class="main-navigation__item${addClass ? ` main-navigation__item--${addClass}` : ``}">
    ${caption === `all` ? `All movies` : `${caption[0].toUpperCase()}${caption.substring(1)}`}
${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>`;
