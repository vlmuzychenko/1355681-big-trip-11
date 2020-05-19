export default class Offer {
  constructor(data, index) {
    this.name = data[`title`];
    this.price = data[`price`];
    this.shortName = `offer-${index}`;
  }

  static toRAW(offer) {
    return {
      "title": offer.name,
      "price": offer.price
    };
  }

  static parseOffer(data, index) {
    return new Offer(data, index);
  }

  static parseOffers(data) {
    return data.map(Offer.parseOffer);
  }
}
