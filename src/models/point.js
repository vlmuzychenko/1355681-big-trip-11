import {getCapitalizedString} from "../utils/common.js";
import Offer from "./offer.js";

export default class Waypoint {
  constructor(data) {
    this.id = data[`id`];
    this.currentType = getCapitalizedString(data[`type`]);
    this.currentCity = data[`destination`][`name`];
    this.currentOffers = Offer.parseOffers(data[`offers`]);
    this.info = {
      description: data[`destination`][`description`],
      photos: data[`destination`][`pictures`]
    };
    this.startTime = new Date(data[`date_from`]).toISOString();
    this.endTime = new Date(data[`date_to`]).toISOString();
    this.price = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.currentType.toLowerCase(),
      "date_from": new Date(this.startTime).toISOString(),
      "date_to": new Date(this.endTime).toISOString(),
      "destination": {
        "name": this.currentCity,
        "description": this.info.description,
        "pictures": this.info.photos
      },
      "base_price": Number(this.price),
      "is_favorite": this.isFavorite,
      "offers": this.currentOffers.map((offer) => Offer.toRAW(offer))
    };
  }

  static parseWaypoint(data) {
    return new Waypoint(data);
  }

  static parseWaypoints(data) {
    return data.map(Waypoint.parseWaypoint);
  }

  static clone(data) {
    return new Waypoint(data.toRAW());
  }
}
