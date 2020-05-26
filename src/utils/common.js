export const getCapitalizedString = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getOffersByType = (allOffers, type) => {
  const offersByType = allOffers.filter((item) => item.type === type.toLowerCase());

  if (!offersByType) {
    return [];
  }

  return offersByType[0].offers;
};

export const getSringWithoutPrefix = (string, prefix) => {
  return string.substring(prefix.length);
};

export const getSortedWaypoints = (waypoints) => {
  const sortedWaypoints = [...waypoints].sort((a, b) => {
    return new Date(a.startTime) - new Date(b.startTime);
  });

  return sortedWaypoints;
};
