export default class Thumbnail {
  constructor(hotSpot) {
    this.ID = hotSpot.ID;
    this.IsDecorating = hotSpot.IsDecorating;
    this.ImagePath = hotSpot.getThumbnailPath();
    this.Name = hotSpot.Name;
    this.Onclick = () => {
    };
  }
}
