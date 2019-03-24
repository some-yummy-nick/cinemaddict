import Component from './component';

export default class Filter extends Component {

  constructor(data) {
    super();
    this._title = data.title;
    this._addClass = data.addClass;
    this._onFilter = null;
    this._clickOnFilter = this._clickOnFilter.bind(this);
  }

  _clickOnFilter(evt) {
    evt.preventDefault();
    return typeof this._onFilter === `function` && this._onFilter(this._title);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `
        <a href="#${this._title}" 
    class="main-navigation__item${this._addClass ? ` main-navigation__item--${this._addClass}` : ``}">
    ${this._title === `all` ? `All movies` : `${this._title[0].toUpperCase()}${this._title.substring(1)}`}</a>
    `.trim();
  }

  bind() {
    this._element.addEventListener(`click`, this._clickOnFilter);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._clickOnFilter);
  }
}
