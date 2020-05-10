import {getRandomTextFromString, getRandomPhotos, getRandomIntegerNumber} from "./utils/common.js";

export const EXAMPLE_CITY_DESCR = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

export const TYPES = {
  transfer: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
  activity: [`Check-in`, `Sightseeing`, `Restaurant`]
};

export const OFFERS = [
  {
    type: `Flight`,
    name: `Add luggage`,
    shortName: `luggage`,
    price: `30`
  }, {
    type: `Flight`,
    name: `Switch to comfort class`,
    shortName: `comfort`,
    price: `100`
  }, {
    type: `Flight`,
    name: `Add meal`,
    shortName: `meal`,
    price: `15`
  }, {
    type: `Flight`,
    name: `Choose seats`,
    shortName: `seats`,
    price: `5`
  }, {
    type: `Flight`,
    name: `Travel by train`,
    shortName: `train`,
    price: `40`
  }, {
    type: `Drive`,
    name: `Rent a car`,
    shortName: `car`,
    price: `200`
  }, {
    type: `Check-in`,
    name: `Add breakfast`,
    shortName: `breakfast`,
    price: `50`
  }, {
    type: `Sightseeing`,
    name: `Book tickets`,
    shortName: `tickets`,
    price: `40`
  }, {
    type: `Sightseeing`,
    name: `Lunch in city`,
    shortName: `lunch`,
    price: `30`
  }, {
    type: `Taxi`,
    name: `Order Uber`,
    shortName: `uber`,
    price: `20`
  }
];

export const CITIES = [
  `Berlin`,
  `Amsterdam`,
  `Paris`,
  `Geneva`
];

export const CITIES_INFO = [
  {
    name: `Berlin`,
    description: getRandomTextFromString(EXAMPLE_CITY_DESCR),
    photos: getRandomPhotos(getRandomIntegerNumber(0, 5))
  }, {
    name: `Amsterdam`,
    description: getRandomTextFromString(EXAMPLE_CITY_DESCR),
    photos: getRandomPhotos(getRandomIntegerNumber(0, 5))
  }, {
    name: `Paris`,
    description: getRandomTextFromString(EXAMPLE_CITY_DESCR),
    photos: getRandomPhotos(getRandomIntegerNumber(0, 5))
  }, {
    name: `Geneva`,
    description: getRandomTextFromString(EXAMPLE_CITY_DESCR),
    photos: getRandomPhotos(getRandomIntegerNumber(0, 5))
  }
];

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SortType = {
  DEFAULT: `event`,
  DURATION_DOWN: `time`,
  PRICE_DOWN: `price`,
};

export const Mode = {
  DEFAULT: `default`,
  ADDING: `adding`,
  EDIT: `edit`,
};
