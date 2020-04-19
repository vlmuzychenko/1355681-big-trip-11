import moment from "moment";
import {getRandomArrayItem, getRandomIntegerNumber} from "../utils/common.js";
import {EXAMPLE_CITY_DESCR, TYPES, CITIES, OFFERS} from "../const.js";

const getOffersByType = (type, offers) => {
  return offers.filter((item) => item.type === type);
};

const getShuffledArray = (array) => {
  return array.sort(() => 0.5 - Math.random());
};

const getRandomTextFromString = (str) => {
  const stringsSet = str.match(/[^\.!\?]+[\.!\?]+/g);
  const stringsCount = getRandomIntegerNumber(0, 5);
  const shuffledStringsSet = getShuffledArray(stringsSet);
  const result = shuffledStringsSet.slice(0, stringsCount).join(``);

  return result;
};

const getRandomPhotos = (count) => {
  const photos = [];
  for (let i = 0; i < count; i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return photos;
};

const castomizeTimeFormat = (time, value) => {
  return value < 10 ? `0${time}${value}` : `${time}${value}`;
};

const getDateDifference = (startDate, endDate) => {
  const diff = moment.utc(new Date(endDate)).diff(startDate);
  const duration = moment.duration(diff);
  let days = duration.days() ? castomizeTimeFormat(duration.days(), `D`) : ``;
  let hours = duration.hours() ? castomizeTimeFormat(duration.hours(), `H`) : ``;
  let minutes = duration.minutes() ? castomizeTimeFormat(duration.minutes(), `M`) : ``;

  return `${days} ${hours} ${minutes}`;
};

const generateWaypoint = () => {
  const currentType = getRandomArrayItem([...TYPES.transfer, ...TYPES.activity]);
  const city = getRandomArrayItem(CITIES);
  const offersByType = getOffersByType(currentType, OFFERS);
  const currentOffers = getShuffledArray(offersByType).slice(0, getRandomIntegerNumber(0, offersByType.length));
  const description = getRandomTextFromString(EXAMPLE_CITY_DESCR);
  const photos = getRandomPhotos(getRandomIntegerNumber(0, 5));
  const price = getRandomIntegerNumber(50, 1000);
  const startTime = moment.utc(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))).format();
  const endTime = moment.utc(startTime).add(getRandomIntegerNumber(1, 24), `h`).add(getRandomIntegerNumber(1, 60), `m`).format();
  const diffTime = getDateDifference(startTime, endTime);

  return {
    currentType,
    city,
    offersByType,
    currentOffers,
    info: {
      description,
      photos
    },
    startTime,
    endTime,
    diffTime,
    price
  };
};


const generateWaypoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateWaypoint);
};

export {generateWaypoints};
