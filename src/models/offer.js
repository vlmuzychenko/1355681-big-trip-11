export default class Offer {
  constructor(offer, index) {
    this.name = offer[`title`];
    this.price = offer[`price`];
    this.shortName = `offer-${index}`;
  }

  static toRAW(offer) {
    return {
      "title": offer.name,
      "price": offer.price
    };
  }

  static parseOffer(offer, index) {
    return new Offer(offer, index);
  }

  static parseOffers(offer) {
    return offer.map(Offer.parseOffer);
  }
}
