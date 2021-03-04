import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import {MapControls} from '../../../project_types/demo/show_room/sdk/OrbitControls';
import CommonHeader from '../../../components/common_header';
import ShowRoomControl from '../../../project_types/demo/show_room/_sdk/controls';

const ContainerSC = styled('div')`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const ThreeContainerSC = styled('div')`
  border: none;
  cursor: pointer;
  width: 100%;
  height: 100vh;
  background-color: #EEEEEE;
`;

const getPixelRatio = function (context) {
  const backingStore = context.backingStorePixelRatio
        || context.webkitBackingStorePixelRatio
        || context.mozBackingStorePixelRatio
        || context.msBackingStorePixelRatio
        || context.oBackingStorePixelRatio
        || context.backingStorePixelRatio || 1;
  return (window.devicePixelRatio || 1) / backingStore;
};

export default () => {
  const threeRef = useRef(null);
  useEffect(() => {
    initThree(threeRef.current);
  }, []);

  const initThree = (threeDom) => {
    const width = threeDom.clientWidth;
    const height = threeDom.clientHeight;
    const renderer = createRender();
    const camera = createPersCamera();
    const scene = createScene();
    const lights = createLights();
    const gridHelpers = createGridHelpers();
    const ground = createGround();
    const controls = createControls(camera, renderer, lights[0]);

    function createRender() {
      // eslint-disable-next-line no-shadow
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      const Ratio = getPixelRatio(threeDom);
      renderer.setPixelRatio(Ratio);
      renderer.setSize(width, height);
      threeDom.appendChild(renderer.domElement);
      renderer.autoClearColor = false;

      return renderer;
    }

    function createPersCamera() {
      const persCamera = new THREE.PerspectiveCamera(90, width / height, 0.5, 100000);
      persCamera.rotation.reorder('YXZ');

      const theta = THREE.Math.degToRad(0);
      const phi = THREE.Math.degToRad(50);
      const radius = Math.max(10 * 100);
      // eslint-disable-next-line max-len
      const position = new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, phi, theta));
      persCamera.position.copy(position);

      return persCamera;
    }

    function createScene() {
      return new THREE.Scene();
    }

    function createLights() {
      const directLight = new THREE.DirectionalLight('#fff', 0.45);
      directLight.position.set(0, 400, 0);
      directLight.castShadow = false;
      directLight.shadow.mapSize.width = 2048;
      directLight.shadow.mapSize.height = 2048;
      // 定义可见域的投射阴影
      directLight.shadow.camera.left = -3000;
      directLight.shadow.camera.right = 3000;
      directLight.shadow.camera.top = 3000;
      directLight.shadow.camera.bottom = -3000;
      directLight.shadow.camera.near = 1;
      directLight.shadow.camera.far = 3000;

      const hemisphereLight = new THREE.HemisphereLight('#ffffff', '#aaaaaa', 1.2);
      hemisphereLight.position.set(3.595, 3.065, 1.319);

      return [directLight, hemisphereLight];
    }

    function createGridHelpers(size = 50000, step = 500) {
      const gridHelper = new THREE.GridHelper(size, step, '#ffffff', '#ffffff');
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.5;
      gridHelper.position.y -= 19;

      const gridHelper2 = new THREE.GridHelper(size, 50, '#ffffff', '#ffffff');
      gridHelper2.position.y -= 19;

      return [gridHelper, gridHelper2];
    }

    function createGround() {
      const geometry = new THREE.PlaneBufferGeometry(20000, 20000);
      const material = new THREE.MeshBasicMaterial({ color: '#DEDEDE' });

      const ground = new THREE.Mesh(geometry, material);
      ground.renderOrder = 10;
      ground.position.y -= 20;
      ground.rotation.set(-Math.PI / 2, 0, 0);

      return ground;
    }

    function lightUpdate(light) {
      light.position.copy(camera.position);
    }

    function createControls(camera, renderer, light) {
      const controls = new MapControls(camera, renderer.domElement);
      controls.maxPolarAngle = THREE.Math.degToRad(90);

      controls.rotateSpeed = 0.1;
      controls.screenSpacePanning = false;
      controls.minDistance = 10;
      controls.maxDistance = 3000;
      controls.panSpeed = 1;

      controls.enableDamping = true;
      controls.dampingFactor = 0.2;
      controls.enableInertia = true;
      controls.inertiaFactor = 0.9;

      controls.addEventListener('change', () => lightUpdate(light));
      renderer.clear();

      return controls;
    }

    function createShowRoomControl(scene, camera, renderer, ground) {
      const showRoomControl = new ShowRoomControl(scene, camera, renderer, ground);
      return showRoomControl;
    }

    function start() {
      scene.add(ground);
      lights.forEach((light) => scene.add(light));
      gridHelpers.forEach((gridHelper) => scene.add(gridHelper));

      animate();
    }

    function animate() {
      controls.update();

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    start();
    createShowRoomControl(scene, camera, renderer, ground);
  };

  return (
    <>
      <CommonHeader title="展会" />
      <ContainerSC>
        <ThreeContainerSC ref={threeRef} />
      </ContainerSC>
    </>
  );
};
