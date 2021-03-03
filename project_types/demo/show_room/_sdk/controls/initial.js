import * as THREE from 'three';
// import { VRCore } from '../app/VRCore';

export const InitialFontParams = ({
  color,
  selectColor,
}) => {
  const material = new THREE.MeshBasicMaterial({
    color,
  });
  const selectMaterial = new THREE.MeshBasicMaterial({
    color: selectColor,
  });
  return {
    material,
    selectMaterial,
  };
};

export const Initial3dParams = ({
  color,
}) => {
  const verticalFace = [
    new THREE.Face3(3, 4, 0),
    new THREE.Face3(3, 7, 4),
    new THREE.Face3(1, 6, 2),
    new THREE.Face3(1, 5, 6),
    new THREE.Face3(0, 5, 1),
    new THREE.Face3(0, 4, 5),
    new THREE.Face3(2, 7, 3),
    new THREE.Face3(2, 6, 7),
  ];

  const verticalFaceBack = [
    new THREE.Face3(3, 4, 7),
    new THREE.Face3(3, 0, 4),
    new THREE.Face3(1, 6, 5),
    new THREE.Face3(1, 2, 6),
    new THREE.Face3(0, 5, 4),
    new THREE.Face3(0, 1, 5),
    new THREE.Face3(2, 7, 6),
    new THREE.Face3(2, 3, 7),
  ];

  const faceIndex = 0;

  const faceBack = [];
  faceBack.push([
    new THREE.Face3(0, 2, 1),
    new THREE.Face3(0, 3, 2),
    new THREE.Face3(4, 6, 7),
    new THREE.Face3(4, 5, 6),
    ...verticalFaceBack,
  ]);
  faceBack.push([
    new THREE.Face3(1, 3, 2),
    new THREE.Face3(1, 0, 3),
    new THREE.Face3(5, 7, 4),
    new THREE.Face3(5, 6, 7),
    ...verticalFaceBack,
  ]);
  faceBack.push([
    new THREE.Face3(2, 0, 3),
    new THREE.Face3(2, 1, 0),
    new THREE.Face3(6, 4, 5),
    new THREE.Face3(6, 7, 4),
    ...verticalFaceBack,
  ]);
  faceBack.push([
    new THREE.Face3(3, 1, 0),
    new THREE.Face3(3, 2, 1),
    new THREE.Face3(7, 5, 6),
    new THREE.Face3(7, 4, 5),
    ...verticalFaceBack,
  ]);

  const face = [];
  face.push([
    new THREE.Face3(0, 2, 3),
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(4, 6, 5),
    new THREE.Face3(4, 7, 6),
    ...verticalFace,
  ]);
  face.push([
    new THREE.Face3(1, 3, 0),
    new THREE.Face3(1, 2, 3),
    new THREE.Face3(5, 4, 7),
    new THREE.Face3(5, 7, 6),
    ...verticalFace,
  ]);
  face.push([
    new THREE.Face3(2, 0, 1),
    new THREE.Face3(2, 3, 0),
    new THREE.Face3(6, 5, 4),
    new THREE.Face3(6, 4, 7),
    ...verticalFace,
  ]);
  face.push([
    new THREE.Face3(3, 1, 2),
    new THREE.Face3(3, 0, 1),
    new THREE.Face3(7, 5, 4),
    new THREE.Face3(7, 6, 5),
    ...verticalFace,
  ]);

  const material = new THREE.MeshPhongMaterial({
    color,
  });

  return {
    material,
    face,
    faceBack,
  };
};

export const Initial2dParams = ({
  color,
  y2D,
  opacity,
}) => {
  // 新建绘制平面图三角面
  const normal = new THREE.Vector3(0, -1, 0);

  const faceIndex = 0;

  const face = [
    [
      new THREE.Face3(0, 2, 1, normal),
      new THREE.Face3(0, 3, 2, normal),
    ],
    [
      new THREE.Face3(1, 0, 3, normal),
      new THREE.Face3(1, 3, 2, normal),
    ],
    [
      new THREE.Face3(2, 1, 0, normal),
      new THREE.Face3(2, 0, 3, normal),
    ],
    [
      new THREE.Face3(3, 1, 0, normal),
      new THREE.Face3(3, 2, 1, normal),
    ],
  ];

  // 绘制平面图材质
  const material2D = new THREE.MeshBasicMaterial({
    color, // 三角面颜色
    side: THREE.DoubleSide, // 两面可见
    transparent: true,
    opacity,
  });

  // 编辑线材质
  const lineMaterial = new THREE.LineDashedMaterial({
    color: 'rgb(0,0,0)',
    dashSize: 18,
    gapSize: 10,
    linewidth: 1,
  });

  return {
    faceIndex,
    material2D,
    y2D,
    opacity,
    lineMaterial,
    face,
  };
};

export const InitialArea = () => {
  // 初始化一个默认的展区
  const newArea = NewAreas();
  const areas = {};
  areas[newArea.id] = newArea.area;
  const currentAreaId = newArea.id;
  return {
    areas,
    currentAreaId,
  };
};

/**
 * 初始化编辑点，共享给所有平面
 */
export const InitialEditPoint = () => {
  const geometry = new THREE.CircleGeometry(12, 32);
  const material = new THREE.MeshBasicMaterial({ color: 'rgb(0, 206, 104)' });
  const editorPoint = new THREE.Mesh(geometry, material);
  // eslint-disable-next-line max-len
  const qua = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0));
  editorPoint.rotation.setFromQuaternion(qua);
  return editorPoint;
};

// 新建一个展区
export const NewAreas = ({
  id,
  name,
  code,
  color,
  drawElements,
}) => {
  let area = {
    id,
    name,
    code,
    color,
    drawElements,
    showRoom3DParams: Initial3dParams({
      height: 300,
      color: '#0c9a9a',
      opacity: 0.5,
    }),
  };

  area = new Proxy(
    area,
    {
      set(target, prop, val) {
        if (prop === 'color') {
          target.showRoom2DParams.material2D.color.set(val);
          target.showRoom3DParams.material3D.color.set(val);
          target.showRoom3DParams.material3dBack.color.set(val);
          target.showRoom3DParams.material3dFront.color.set(val);
          target.showRoom3DParams.material3dAlien.color.set(val);
        }
        if (prop === 'code') {
          Object.values(target.drawElements).forEach((item) => {
            item.setArea(val);
          });
        }
        target[prop] = val;
        return true;
      },
    },
  );

  return {
    id,
    area,
  };
};
