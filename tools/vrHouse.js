// eslint-disable-next-line import/named
import { getUrlParameter, UUID8Bit } from './common';

export default class VRHouse {
  constructor(houseId, domain) {
    // eslint-disable-next-line no-underscore-dangle
    this._domain = domain || getUrlParameter('domain');
    // eslint-disable-next-line no-underscore-dangle
    this._houseId = houseId || getUrlParameter('hid');
  }

  getDomain() {
    // eslint-disable-next-line no-underscore-dangle
    return this._domain;
  }

  getHouseId() {
    // eslint-disable-next-line no-underscore-dangle
    return this._houseId;
  }

  getHousePathPrefix() {
    // eslint-disable-next-line no-underscore-dangle
    return `${this._domain + this._houseId}`;
  }

  getViewDataUrl() {
    return `${this.getHousePathPrefix()}/ViewData.txt?${UUID8Bit()}`;
  }

  getEditDataUrl() {
    return `${this.getHousePathPrefix()}/EditorData.txt?${UUID8Bit()}`;
  }

  getSingleViewDataUrl() {
    return `${this.getHousePathPrefix()}/SingleViewData.txt?${UUID8Bit()}`;
  }
}
