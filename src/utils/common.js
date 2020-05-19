export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getCapitalizedString = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getRandomTextFromString = (str) => {
  const stringsSet = str.match(/[^\.!\?]+[\.!\?]+/g);
  const stringsCount = getRandomIntegerNumber(0, 5);
  const shuffledStringsSet = stringsSet.sort(() => 0.5 - Math.random());
  const result = shuffledStringsSet.slice(0, stringsCount).join(``);

  return result;
};

export const getRandomPhotos = (count) => {
  const photos = [];
  for (let i = 0; i < count; i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return photos;
};

export const getSringWithoutPrefix = (string, prefix) => {
  return string.substring(prefix.length);
};

export const getOffersByType = (allOffers, type) => {
  const offersByType = allOffers.filter((item) => item.type === type.toLowerCase());

  if (!offersByType) {
    return [];
  }

  return offersByType[0].offers;
};
