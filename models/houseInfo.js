export default class HouseInfo {
  constructor({
    packageId,
    domain,
    defaultHotSpot,
    defaultRoom,
  }) {
    this.packageId = packageId;
    this.domain = domain;
    this.defaultHotSpot = defaultHotSpot;
    this.defaultRoom = defaultRoom;
  }
}
