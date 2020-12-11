import * as THREE from 'three';

export default class ObjectEvent {
  constructor() {

  }

  getMousePosition(camera, domEvent, domElement) {
    let xScreen;
    let yScreen;
    let xRelative;
    let yReleative;

    if (domEvent.type === 'touchstart' || domEvent.type === 'touchmove') {
      xScreen = domEvent.touches[0].pageX;
      yScreen = domEvent.touches[0].pageY;
    } else if (domEvent.type === 'touchend') {
      xScreen = domEvent.changedTouches[0].pageX;
      yScreen = domEvent.changedTouches[0].pageY;
    } else {
      xScreen = domEvent.clientX;
      yScreen = domEvent.clientY;
    }

    if (domElement && domElement.viewPort) {
      const viewport = domElement.viewPort;
      xRelative = (xScreen - viewport.left) / viewport.width;
      yReleative = (yScreen - viewport.top) / viewport.height;
    } else if (camera && camera.viewPort) {
      const left = camera.viewPort.left / domElement.clientWidth;
      const top = camera.viewPort.top / domElement.clientHeight;
      const width = camera.viewPort.width / domElement.clientWidth;
      const height = camera.viewPort.height / domElement.clientHeight;

      xRelative = (xScreen - left) / width;
      yReleative = (yScreen - top) / height;
    } else {
      xRelative = xScreen / domElement.clientWidth;
      yReleative = yScreen / domElement.clientHeight;
      let {
        left, top, width, height,
      } = domElement.getBoundingClientRect();

      left /= domElement.clientWidth;
      top /= domElement.clientHeight;
      width /= domElement.clientWidth;
      height /= domElement.clientHeight;

      xRelative = (xScreen - left) / width;
      yReleative = (yScreen - top) / height;
    }

    const position = new THREE.Vector2();
    position.x = xRelative * 2 - 1;
    position.y = -yReleative * 2 + 1;

    return position;
  }
}
