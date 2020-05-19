import Waypoint from "./models/point.js";
import Destination from "./models/destination.js";
import Offer from "./models/offer.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getWaypoints() {
    return this._load({
      url: `points`,
    })
      .then((response) => response.json())
      .then(Waypoint.parseWaypoints);
  }

  getDestinations() {
    return this._load({
      url: `destinations`
    })
      .then((response) => response.json())
      .then(Destination.parseDestinations);
  }

  getOffers() {
    return this._load({
      url: `offers`
    })
      .then((response) => response.json())
      .then((offers) => {
        return offers.map((item) => {
          return {
            type: item.type,
            offers: Offer.parseOffers(item.offers)
          };
        });
      });
  }

  getData() {
    return Promise.all([
      this.getWaypoints(),
      this.getDestinations(),
      this.getOffers()
    ])
      .then((responce) => {
        const [waypoints, destinations, offers] = responce;
        return {
          waypoints,
          destinations,
          offers,
        };
      });
  }

  createWaypoint(data) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((responce) => responce.json())
      .then(Waypoint.parseWaypoint);
  }

  updateWaypoint(id, data) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Waypoint.parseWaypoint);
  }

  deleteWaypoint(id) {
    return this._load({url: `/points/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
