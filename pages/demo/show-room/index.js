import React, { useRef, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import * as THREE from 'three';
import { MapControls } from '../../../projects/demo/show_room/sdk/OrbitControls';
import CommonHeader from '../../../components/common_header';
import ShowRoomControl from '../../../projects/demo/show_room/_sdk/controls';
import Title from '../../../components/title/2.0';
import Animation from '../../../components/animation/2.0';
import Slide3D from '../../../components/slide_3d/1.0';
import ShowRoomPanel from '../../../projects/demo/show_room/components/show_room_panel/ShowRoomPanel';
import RegionPanel from '../../../projects/demo/show_room/components/region_panel/RegionPanel';
import { getUrlParameter, UUID8Bit } from '../../../tools/common';

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
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #EEEEEE;
`;

const opacityFadeIn = keyframes`
  0% {
     opacity: 0;
  }
  100% {
     opacity: 1;
  }
`;

const opacityFadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const opacityFadeCss = (aniTrigger) => {
  if (aniTrigger) return css` ${opacityFadeIn} .2s forwards`;
  return css` ${opacityFadeOut} .2s forwards`;
};

const Slide3DSC = styled('div', ['aniTrigger'])`
  animation: ${(props) => opacityFadeCss(props.aniTrigger)};
`;

const ShowRoomPanelContainerSC = styled.div`
  width: 240px;
  position: absolute;
  right: 30px;
  top: 50px;
`;

const RegionPanelContainerSC = styled.div`
  width: 260px;
  position: absolute;
  left: 45px;
  top: 50px;
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

const bookedMaterial = new THREE.MeshPhongMaterial({
  color: 'rgb(160,160,160)',
});

export default () => {
  const [isSlide3D, setSlide3D] = useState(false);
  const [isShowRoomPanel, setShowRoomPanel] = useState(false);
  const [regions, setAllRegions] = useState(null);
  const [showRoomPanelInfo, setShowRoomPanelInfo] = useState({
    code: null,
    number: null,
    size: [],
    area: null,
    price: null,
  });
  const [isCurrentBooked, setCurrentBooked] = useState(false);
  const [selectedShowRoomId, setSelectedShowRoom] = useState(null);
  const selectedShowRoom = useRef(null);

  const threeRef = useRef(null);
  useEffect(() => {
    const getShowRoomData = async () => {
      const packageId = getUrlParameter('packageId');
      const domain = getUrlParameter('domain');
      const showRoomDataRes = await fetch(`${domain}${packageId}/ShowRoomData.json?${UUID8Bit()}`);
      const showRoomData = await showRoomDataRes.json();
      initThree(threeRef.current, showRoomData);
      setAllRegions(showRoomData);
    };
    getShowRoomData();
  }, []);

  const initThree = (threeDom, showRoomData) => {
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
      controls.maxDistance = 4000;
      controls.panSpeed = 1;

      controls.enableDamping = true;
      controls.dampingFactor = 0.2;
      controls.enableInertia = true;
      controls.inertiaFactor = 0.9;

      controls.addEventListener('change', () => lightUpdate(light));
      renderer.clear();

      return controls;
    }

    function createShowRoomControl(scene, camera, renderer, ground, showRoomData) {
      const showRoomControl = new ShowRoomControl(scene, camera, renderer, ground, showRoomData);
      return showRoomControl;
    }

    function start() {
      // scene.add(ground);
      lights.forEach((light) => scene.add(light));
      // gridHelpers.forEach((gridHelper) => scene.add(gridHelper));

      animate();
    }

    function animate() {
      controls.update();

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    start();
    createShowRoomControl(scene, camera, renderer, ground, showRoomData);
    const raycaster = new THREE.Raycaster();
    const position = new THREE.Vector2();
    initialEventListener(scene, camera, renderer, raycaster, position);
    window.addEventListener('resize', onWindowResize);

    function onWindowResize() {
      camera.aspect = threeDom.clientWidth / threeDom.clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(threeDom.clientWidth, threeDom.clientHeight);
    }
  };

  const getMousePosition = (camera, domEvent, domElement, position) => {
    // eslint-disable-next-line max-len
    position.x = ((domEvent.clientX - domElement.getBoundingClientRect().left) / domElement.offsetWidth) * 2 - 1;
    // eslint-disable-next-line max-len
    position.y = -((domEvent.clientY - domElement.getBoundingClientRect().top) / domElement.offsetHeight) * 2 + 1;
  };

  const initialEventListener = (scene, camera, renderer, raycaster, position) => {
    const hoverShowRoom = new Map();

    const onMouseMove = (event) => {
      if (selectedShowRoom.current) return;
      getMousePosition(camera, event, renderer.domElement, position);
      raycaster.setFromCamera(position, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects[0]?.object.booked) return;

      if (intersects[0]?.object.type !== 'showRoom3D' && intersects[0]?.object.type !== 'showRoomName') {
        for (const showRoom of hoverShowRoom.keys()) {
          showRoom.material = hoverShowRoom.get(showRoom).originalMaterial;
          hoverShowRoom.get(showRoom).hoverMaterial.dispose();
        }
        hoverShowRoom.clear();
      }

      if (intersects.length > 0 && intersects[0].object.type === 'showRoom3D') {
        for (const showRoom of hoverShowRoom.keys()) {
          showRoom.material = hoverShowRoom.get(showRoom).originalMaterial;
          hoverShowRoom.get(showRoom).hoverMaterial.dispose();
        }
        hoverShowRoom.clear();

        const materialClone = intersects[0].object.material.clone();
        materialClone.opacity = 0.75;

        if (!hoverShowRoom.has(intersects[0].object)) {
          hoverShowRoom.set(
            intersects[0].object,
            {
              originalMaterial: intersects[0].object.material,
              hoverMaterial: materialClone,
            },
          );
        }
        intersects[0].object.material = materialClone;
      }
    };

    const onClick = (event) => {
      getMousePosition(camera, event, renderer.domElement, position);
      raycaster.setFromCamera(position, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0 && intersects[0].object.type === 'showRoom3D') {
        if (selectedShowRoom.current) {
          selectedShowRoom.current.material.opacity = 1;
        }

        if (selectedShowRoom.current === intersects[0].object) {
          // eslint-disable-next-line max-len
          selectedShowRoom.current.position.set(selectedShowRoom.current.position.x, selectedShowRoom.current.position.y - 150, selectedShowRoom.current.position.z);
          const textPositionPre = selectedShowRoom.current.text.position;
          textPositionPre.set(textPositionPre.x, textPositionPre.y - 150, textPositionPre.z);
          selectedShowRoom.current = null;
          setSelectedShowRoom(null);
          setShowRoomPanel(false);
          return;
        }

        if (selectedShowRoom.current) {
          // eslint-disable-next-line max-len
          selectedShowRoom.current.position.set(selectedShowRoom.current.position.x, selectedShowRoom.current.position.y - 150, selectedShowRoom.current.position.z);
          const textPositionPre = selectedShowRoom.current.text.position;
          textPositionPre.set(textPositionPre.x, textPositionPre.y - 150, textPositionPre.z);
        }

        const materialClone = intersects[0].object.material.clone();
        materialClone.opacity = 0.75;
        intersects[0].object.material = materialClone;

        const id = Symbol.for('showRoomId');
        setSelectedShowRoom(intersects[0].object[id]);
        setShowRoomPanel(true);
        setShowRoomPanelInfo(intersects[0].object.displayInfo);
        setCurrentBooked(intersects[0].object.booked);
        selectedShowRoom.current = intersects[0].object;
        // eslint-disable-next-line max-len
        selectedShowRoom.current.position.set(selectedShowRoom.current.position.x, selectedShowRoom.current.position.y + 150, selectedShowRoom.current.position.z);
        const textPosition = selectedShowRoom.current.text.position;
        textPosition.set(textPosition.x, textPosition.y + 150, textPosition.z);
      }
    };

    threeRef.current.addEventListener('mousemove', onMouseMove, false);
    threeRef.current.addEventListener('dblclick', onClick, false);
  };

  const handleBook = () => {
    selectedShowRoom.current.material = bookedMaterial;
    selectedShowRoom.current.booked = true;
    setCurrentBooked(true);
  };

  return (
    <>
      <CommonHeader title="展会" />
      <ContainerSC>
        <ThreeContainerSC ref={threeRef} />
        <Title
          titleName="上海国际汽车改装博览会"
          onChange={setSlide3D}
        />
        <Animation visible={isSlide3D}>
          <Slide3DSC>
            <Slide3D />
          </Slide3DSC>
        </Animation>
        {
          isShowRoomPanel && (
            <ShowRoomPanelContainerSC>
              <ShowRoomPanel
                showRoomPanelInfo={showRoomPanelInfo}
                onBook={handleBook}
                booked={isCurrentBooked}
              />
            </ShowRoomPanelContainerSC>
          )
        }
        <RegionPanelContainerSC>
          <RegionPanel
            regions={regions}
            selectedShowRoomId={selectedShowRoomId}
          />
        </RegionPanelContainerSC>
      </ContainerSC>
    </>
  );
};
