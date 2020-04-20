import AbstractComponent from "./abstract-component.js";

export const SortType = {
  DURATION_DOWN: `sort-time`,
  PRICE_DOWN: `sort-price`,
  DEFAULT: `sort-event`,
};

const createSortTemplate = () => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day"></span>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.DEFAULT}" checked>
        <label class="trip-sort__btn" for="${SortType.DEFAULT}">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.DURATION_DOWN}">
        <label class="trip-sort__btn" for="${SortType.DURATION_DOWN}">
          Time
        </label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.PRICE_DOWN}">
        <label class="trip-sort__btn" for="${SortType.PRICE_DOWN}">
          Price
        </label>
      </div>

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._curentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._curentSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (event) => {
      event.preventDefault();

      if (event.target.tagName !== `INPUT`) {
        return;
      }

      const sortType = event.target.value;

      if (this._curentSortType === sortType) {
        return;
      }

      this._curentSortType = sortType;

      handler(this._curentSortType);
    });
  }
}
