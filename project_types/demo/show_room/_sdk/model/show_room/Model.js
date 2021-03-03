import * as THREE from 'three';

// 生成标准透明异形3D模型
export const GenerateAdvancedAlien3D = ({
  showRoom3D,
  _showRoom3DParams,
  originPoints,
  faceIndex,
}) => {
  showRoom3D?.dispose();
  const geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(originPoints.startPoint.x, _showRoom3DParams.yDown3D, originPoints.startPoint.z),
    new THREE.Vector3(originPoints.startNearPoint.x, _showRoom3DParams.yDown3D, originPoints.startNearPoint.z),
    new THREE.Vector3(originPoints.drawingPoint.x, _showRoom3DParams.yDown3D, originPoints.drawingPoint.z),
    new THREE.Vector3(originPoints.drawingNearPoint.x, _showRoom3DParams.yDown3D, originPoints.drawingNearPoint.z),
    new THREE.Vector3(originPoints.startPoint.x, _showRoom3DParams.height + _showRoom3DParams.yDown3D, originPoints.startPoint.z),
    new THREE.Vector3(originPoints.startNearPoint.x, _showRoom3DParams.height + _showRoom3DParams.yDown3D, originPoints.startNearPoint.z),
    new THREE.Vector3(originPoints.drawingPoint.x, _showRoom3DParams.height + _showRoom3DParams.yDown3D, originPoints.drawingPoint.z),
    new THREE.Vector3(originPoints.drawingNearPoint.x, _showRoom3DParams.height + _showRoom3DParams.yDown3D, originPoints.drawingNearPoint.z),
  );
  geometry.faces.push(..._showRoom3DParams.faceBack[faceIndex], ..._showRoom3DParams.face[faceIndex]);
  geometry.computeFaceNormals();
  return new THREE.Mesh(geometry, _showRoom3DParams.material);
};
