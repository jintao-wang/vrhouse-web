import * as THREE from 'three';
import { getUrlParameter } from '../../../../../../util/common';

import {
  GenerateAdvancedAlien3D,
} from './Model';

export default class ShowRoom {
  constructor({
    scene,
    camera,
    ground,
    area,
    fontParams,
    showRoomGroup,
    id,
    faceIndex,
    points,
    commonParams,
    showRoomNameParams,
  }) {
    this.scene = scene;
    this.camera = camera;
    this.ground = ground;

    this.id = id;

    this.faceIndex = faceIndex;

    // 绘制点位
    this.points = points;

    // 各类参数
    this.area = area;
    this.commonParams = commonParams;

    // this.showRoom3DParams = showRoom3DParams;
    this._showRoom3DParams = {
      ...area.showRoom3DParams,
      yDown3D: 0,
      height: 300,
    };

    this.fontParams = fontParams;

    this.showRoomNameParams = showRoomNameParams;

    this.showRoomGroup = showRoomGroup;
    this.showRoom3D = null;

    this.generateShowRoom3D(showRoomGroup, faceIndex);
    this.create2DFont(this.showRoomNameParams.name, showRoomNameParams.position);
  }

  generateShowRoom3D(showRoomGroup, faceIndex) {
    this.showRoom3D = GenerateAdvancedAlien3D({
      showRoom3D: this.showRoom3D,
      _showRoom3DParams: this._showRoom3DParams,
      originPoints: this.points,
      faceIndex,
    });
    this.scene.add(this.showRoom3D);
  }

  create2DFont = (text, position) => {
    this.showRoomName?.dispose();
    const shapes = this.fontParams.font.generateShapes(text, 50);
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    this.showRoomName = new THREE.Mesh(geometry, this.fontParams.material);
    this.showRoomName.renderOrder = 1;
    const qua = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0));
    this.showRoomName.rotation.setFromQuaternion(qua);
    this.showRoomName.position.set(position[0], position[1] + 200, position[2]);
    this.scene.add(this.showRoomName);
  }
}
