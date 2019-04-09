import Component from "./component";

export default class Search extends Component {
  constructor() {
    super();
    this._onChange = null;
    this._onSearchChange = this._onSearchChange.bind(this);
  }

  _onSearchChange(evt) {
    return typeof this._onChange === `function` && this._onChange(evt.target.value);
  }

  set onChange(fn) {
    this._onChange = fn;
  }

  get template() {
    return `
    <form class="header__search search">
    <input type="text" name="search" class="search__field" placeholder="Search">
    <button type="submit" class="visually-hidden">Search</button>
  </form>
    `.trim();
  }

  bind() {
    this._element.querySelector(`.search__field`)
      .addEventListener(`keyup`, this._onSearchChange);
  }

  unbind() {
    this._element.querySelector(`.search__field`)
      .removeEventListener(`keydown`, this._onSearchChange);
  }
}
