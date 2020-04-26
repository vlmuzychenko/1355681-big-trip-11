import moment from "moment";
import {getRandomArrayItem, getRandomIntegerNumber} from "../utils/common.js";
import {CITIES_INFO, TYPES, CITIES, OFFERS} from "../const.js";

const getShuffledArray = (array) => {
  return array.sort(() => 0.5 - Math.random());
};

const generateWaypoint = () => {
  const currentType = getRandomArrayItem([...TYPES.transfer, ...TYPES.activity]);
  const currentCity = getRandomArrayItem(CITIES);
  const offersByType = OFFERS.filter((item) => item.type === currentType);
  const currentOffers = getShuffledArray(offersByType).slice(0, getRandomIntegerNumber(0, offersByType.length));
  const currentCityInfo = CITIES_INFO.filter((city) => city.name === currentCity);
  const description = currentCityInfo[0].description;
  const photos = currentCityInfo[0].photos;
  const price = getRandomIntegerNumber(50, 1000);
  const startTime = moment.utc(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))).format();
  const endTime = moment.utc(startTime).add(getRandomIntegerNumber(1, 24), `h`).add(getRandomIntegerNumber(1, 60), `m`).format();
  const isFavorite = Math.random() > 0.5;

  return {
    currentType,
    currentCity,
    offersByType,
    currentOffers,
    info: {
      description,
      photos
    },
    startTime,
    endTime,
    price,
    isFavorite
  };
};


const generateWaypoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateWaypoint);
};

export {generateWaypoints};
