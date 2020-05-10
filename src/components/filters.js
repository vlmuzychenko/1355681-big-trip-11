import AbstractComponent from "./abstract-component.js";
import {getSringWithoutPrefix} from "../utils/common.js";

const FILTER_ID_PREFIX = `filter-`;

const createFilterTemplate = (filter, isChecked) => {
  return (
    `<div class="trip-filters__filter">
      <input 
        id="filter-${filter.name}" 
        class="trip-filters__filter-input  visually-hidden" 
        type="radio" 
        name="trip-filter" 
        value="${filter.name}" 
        ${isChecked ? `checked` : ``}
      />
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
    </div>`
  );
};

const createFiltersTemplate = (filters) => {
  const filterTemplate = filters.map((it) => createFilterTemplate(it, it.checked)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractComponent {
  constructor(filters) {
    super();

    this.filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this.filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getSringWithoutPrefix(evt.target.id, FILTER_ID_PREFIX);
      handler(filterName);
    });
  }
}
