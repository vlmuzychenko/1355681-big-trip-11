export default class Destination {
  constructor(destination) {
    this.name = destination.name;
    this.description = destination.description;
    this.photos = destination.pictures;
  }

  static parseDestination(destination) {
    return new Destination(destination);
  }

  static parseDestinations(destination) {
    return destination.map(Destination.parseDestination);
  }
}
