import * as THREE from 'three';
import getConfig from 'next/config';
import ShowRoom from '../model/show_room';
import { getUrlParameter, UUID8Bit } from '../../../../../util/common';

import {
  NewAreas,
  InitialFontParams,
  Initial3dParams,
} from './initial';

const { publicRuntimeConfig } = getConfig();

export default class ShowRoomControl {
  constructor(scene, camera, renderer, ground) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.ground = ground;

    this.showRoomGroup = new THREE.Group();

    // 所有绘制的展厅
    this.showRooms = {};

    // 初始化展厅区域
    this.areas = null;

    // 初始化文字参数
    this.fontParams = InitialFontParams({
      color: '#333333',
      selectColor: '#0163e1',
    });

    // 回调
    this.finishCallback = null;

    this.initial();
    this.createBackPicture();
  }

  /**
   * 初始化
   */
  async initial() {
    this.scene.add(this.showRoomGroup);

    const loader = new THREE.FontLoader();
    loader.load(`${publicRuntimeConfig.ASSET_PREFIX}/static/font/helvetiker_regular.typeface.json`, (font) => {
      this.fontParams.font = font;
    });

    const packageId = getUrlParameter('packageId');
    const domain = getUrlParameter('domain');
    const showRoomDataRes = await fetch(`${domain}${packageId}/ShowRoomData.json?${UUID8Bit()}`);
    this.generateAll(await showRoomDataRes.json());
  }

  generateAll(areas) {
    // eslint-disable-next-line guard-for-in
    console.log(areas);
    for (const areaId in areas) {
      const area = areas[areaId];
      area.showRoom3DParams = Initial3dParams({ color: area.color });

      for (const showRoomId in area.drawElements) {
        const showRoom = area.drawElements[showRoomId];
        this.generateShowRoom(showRoom, area);
      }
    }
  }

  generateShowRoom(showRoom, area) {
    const newShowRoom = new ShowRoom({
      scene: this.scene,
      camera: this.camera,
      ground: this.ground,
      area,
      fontParams: this.fontParams,
      showRoomGroup: this.showRoomGroup,
      id: showRoom.id,
      commonParams: showRoom.commonParams,
      faceIndex: showRoom.faceIndex,
      namePosition: showRoom.namePosition,
      showRoomNameParams: showRoom.showRoomNameParams,
      points: {
        startPoint: new THREE.Vector3(
          showRoom.points.startPoint.x,
          showRoom.points.startPoint.y,
          showRoom.points.startPoint.z,
        ),
        drawingPoint: new THREE.Vector3(
          showRoom.points.drawingPoint.x,
          showRoom.points.drawingPoint.y,
          showRoom.points.drawingPoint.z,
        ),
        startNearPoint: new THREE.Vector3(
          showRoom.points.startNearPoint.x,
          showRoom.points.startNearPoint.y,
          showRoom.points.startNearPoint.z,
        ),
        drawingNearPoint: new THREE.Vector3(
          showRoom.points.drawingNearPoint.x,
          showRoom.points.drawingNearPoint.y,
          showRoom.points.drawingNearPoint.z,
        ),
      },

    });
    this.showRooms[showRoom.id] = newShowRoom;
  }

  async createBackPicture() {
    const packageId = getUrlParameter('packageId');
    const domain = getUrlParameter('domain');

    const texture = new THREE.TextureLoader().load(`${domain}${packageId}/FloorPlans/AIFloorPlan.png`);
    let width; let
      height;
    const image = new Image();
    image.src = `${domain}${packageId}/FloorPlans/AIFloorPlan.png`;
    const _this = this;
    image.onload = function () {
      width = this.width;
      height = this.height;
      texture.needsUpdate = true;
      const ratio = width / height;
      const maxLength = 9600;

      let geometry;
      if (ratio > 1) {
        geometry = new THREE.PlaneBufferGeometry(maxLength, maxLength / ratio);
      } else {
        geometry = new THREE.PlaneBufferGeometry(maxLength * ratio, maxLength);
      }
      // eslint-disable-next-line max-len
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.5 });
      const backPicture = new THREE.Mesh(geometry, material);
      backPicture.position.y -= 10;
      backPicture.rotation.set(-Math.PI / 2, 0, 0);
      _this.scene.add(backPicture);
    };
  }
}
