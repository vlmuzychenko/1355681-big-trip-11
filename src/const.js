export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const HIDDEN_CLASS = `visually-hidden`;

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const Mode = {
  DEFAULT: `default`,
  ADDING: `adding`,
  EDIT: `edit`,
};

export const RenderPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export const SortType = {
  DEFAULT: `event`,
  DURATION_DOWN: `time`,
  PRICE_DOWN: `price`,
};

export const TypeIcons = new Map([
  [`Taxi`, `🚕`],
  [`Bus`, `🚌`],
  [`Train`, `🚂`],
  [`Ship`, `🚢`],
  [`Transport`, `🚆`],
  [`Drive`, `🚗`],
  [`Flight`, `✈️`],
  [`Check-in`, `🏨`],
  [`Sightseeing`, `🏛`],
  [`Restaurant`, `🍴`],
]);

export const TYPES = {
  TRANSFERS: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
  ACTIVITIES: [`Check-in`, `Sightseeing`, `Restaurant`]
};
