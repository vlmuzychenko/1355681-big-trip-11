import {getCapitalizedString} from "../utils/common.js";
import Offer from "./offer.js";

export default class Waypoint {
  constructor(waypoint) {
    this.id = waypoint[`id`];
    this.currentType = getCapitalizedString(waypoint[`type`]);
    this.currentCity = waypoint[`destination`][`name`];
    this.currentOffers = Offer.parseOffers(waypoint[`offers`]);
    this.info = {
      description: waypoint[`destination`][`description`],
      photos: waypoint[`destination`][`pictures`]
    };
    this.startTime = new Date(waypoint[`date_from`]).toISOString();
    this.endTime = new Date(waypoint[`date_to`]).toISOString();
    this.price = waypoint[`base_price`];
    this.isFavorite = Boolean(waypoint[`is_favorite`]);
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

  static parseWaypoint(waypoint) {
    return new Waypoint(waypoint);
  }

  static parseWaypoints(waypoint) {
    return waypoint.map(Waypoint.parseWaypoint);
  }

  static clone(waypoint) {
    return new Waypoint(waypoint.toRAW());
  }
}
