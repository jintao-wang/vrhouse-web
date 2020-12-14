import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import oc from 'three-orbit-controls';
import CommonHeader from '../../../components/common_header';
import TransparentBox from '../../../three_sdk/object/transparentBox';
import PlaneBox from '../../../three_sdk/object/planeBox';

const ContainerSC = styled('div')`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: orange;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Home = () => {
  const threeContainer = useRef(null);
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      threeContainer.current.clientWidth / threeContainer.current.clientHeight,
      0.1,
      10000,
    );
    const renderer = new THREE.WebGLRenderer({
      // 增加下面两个属性，可以抗锯齿
      antialias: true,
      alpha: true,
    });

    scene.background = new THREE.Color('rgb(236, 236, 236)');

    renderer.setSize(
      threeContainer.current.clientWidth,
      threeContainer.current.clientHeight,
    );
    threeContainer.current.append(renderer.domElement);

    camera.position.set(500, 800, 800);
    camera.lookAt(0, 0, 0);

    const raycaster = new THREE.Raycaster();
    const position = new THREE.Vector2();

    const planeBox = new PlaneBox({
      size: 100,
      color: 'rgb(251, 168, 74)',
      opacity: 0.6,
      position: [250, 50, 350],
    });

    const plane2Box = new PlaneBox({
      size: 100,
      color: 'rgb(251, 168, 74)',
      opacity: 0.6,
      position: [450, 200, 750],
    });

    planeBox.addTo(scene);
    plane2Box.addTo(scene);

    const onMouseMove = (event) => {
      getMousePosition(camera, event, renderer.domElement, position);
      raycaster.setFromCamera(position, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        console.log(intersects);
        if (planeBox.getOpenState()) {
          planeBox.close();
        } else {
          planeBox.open();
        }

        if (plane2Box.getOpenState()) {
          plane2Box.close();
        } else {
          plane2Box.open();
        }

        if (intersects[0].object.material.length) {
          intersects[0].object.material[intersects[0].face.materialIndex].color.set('rgb(140,20,0)');
        }
      }
    };

    threeContainer.current.addEventListener('click', onMouseMove, false);

    const OrbitControls = oc(THREE);
    const controls = new OrbitControls(camera, renderer.domElement);

    const light = new THREE.AmbientLight('rgb(234,233,233)');

    scene.add(light);

    const floorMat = new THREE.MeshStandardMaterial({
      roughness: 0.8,
      color: 0xffffff,
      metalness: 0.2,
      bumpScale: 0.0005,
    });
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/static/three-texture/IMG37.jpeg', (map) => {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set(8, 8);
      map.encoding = THREE.sRGBEncoding;
      floorMat.map = map;
      floorMat.needsUpdate = true;
    });

    const floorGeometry = new THREE.PlaneBufferGeometry(50000, 50000);
    const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
    floorMesh.receiveShadow = true;
    floorMesh.rotation.x = -Math.PI / 2.0;
    // scene.add(floorMesh);

    // grid
    const gridHelper = new THREE.GridHelper(2000, 20);
    scene.add(gridHelper);

    const planGeometry1 = new THREE.PlaneBufferGeometry(100, 100, 1);
    const planMaterial1 = new THREE.MeshBasicMaterial({
      color: 'rgb(23, 48, 99)', transparent: true, opacity: 0.6, side: THREE.DoubleSide,
    });
    const plane1 = new THREE.Mesh(planGeometry1, planMaterial1);
    plane1.position.set(-50, 50, 400);
    scene.add(plane1);

    const planGeometry2 = new THREE.PlaneBufferGeometry(100, 100, 1);
    const planMaterial2 = new THREE.MeshBasicMaterial({
      color: 'rgb(23, 148, 99)', transparent: true, opacity: 0.6, side: THREE.DoubleSide,
    });
    const plane2 = new THREE.Mesh(planGeometry2, planMaterial2);
    plane2.position.set(-50, 50, 300);
    scene.add(plane2);

    const planGeometry3 = new THREE.PlaneBufferGeometry(100, 100, 1);
    const planMaterial3 = new THREE.MeshBasicMaterial({
      color: 'rgb(23, 78, 99)', transparent: true, opacity: 0.6, side: THREE.DoubleSide,
    });
    const plane3 = new THREE.Mesh(planGeometry3, planMaterial3);
    plane3.position.set(-100, 50, 350);
    plane3.rotation.y = Math.PI / 2;
    scene.add(plane3);

    const planGeometry4 = new THREE.PlaneBufferGeometry(100, 100, 1);
    const planMaterial4 = new THREE.MeshBasicMaterial({
      color: 'rgb(23, 78, 99)', transparent: true, opacity: 0.6, side: THREE.DoubleSide,
    });
    const plane4 = new THREE.Mesh(planGeometry4, planMaterial4);
    plane4.position.set(0, 50, 350);
    plane4.rotation.y = Math.PI / 2;
    scene.add(plane4);

    const planGeometry5 = new THREE.PlaneBufferGeometry(100, 100, 1);
    const planMaterial5 = new THREE.MeshBasicMaterial({
      color: 'rgb(123, 78, 99)', transparent: true, opacity: 0.6, side: THREE.DoubleSide,
    });
    const plane5 = new THREE.Mesh(planGeometry5, planMaterial5);
    plane5.position.set(-50, 0, 350);
    plane5.rotation.x = Math.PI / 2;
    scene.add(plane5);

    const cube1_1 = new TransparentBox({
      size: 100,
      color: 'rgb(251, 168, 74)',
      opacity: 0.6,
      position: [-50, 50, -50],
    });
    const cube1_2 = new TransparentBox({
      size: 100,
      color: 'rgb(251, 168, 74)',
      opacity: 0.6,
      position: [-250, 50, -50],
    });
    const cube1_3 = new TransparentBox({
      size: 100,
      color: 'rgb(251, 168, 74)',
      opacity: 0.6,
      position: [-50, 50, -250],
    });
    const cube1_4 = new TransparentBox({
      size: 100,
      color: 'rgb(251, 168, 74)',
      opacity: 0.6,
      position: [-250, 50, -250],
    });
    scene.add(cube1_1.getObj());
    scene.add(cube1_2.getObj());
    scene.add(cube1_3.getObj());
    scene.add(cube1_4.getObj());

    const cube2_1 = new TransparentBox({
      size: 100,
      color: 'rgb(0,220,154)',
      opacity: 0.6,
      position: [250, 50, -50],
    });
    const cube2_2 = new TransparentBox({
      size: 100,
      color: 'rgb(0,220,154)',
      opacity: 0.6,
      position: [450, 50, -50],
    });
    const cube2_3 = new TransparentBox({
      size: 100,
      color: 'rgb(0,220,154)',
      opacity: 0.6,
      position: [250, 50, -250],
    });
    const cube2_4 = new TransparentBox({
      size: 100,
      color: 'rgb(0,220,154)',
      opacity: 0.6,
      position: [450, 50, -250],
    });

    scene.add(cube2_1.getObj());
    scene.add(cube2_2.getObj());
    scene.add(cube2_3.getObj());
    scene.add(cube2_4.getObj());

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }, []);

  const getMousePosition = (camera, domEvent, domElement, position) => {
    position.x = ((domEvent.clientX - domElement.getBoundingClientRect().left) / domElement.offsetWidth) * 2 - 1;
    position.y = -((domEvent.clientY - domElement.getBoundingClientRect().top) / domElement.offsetHeight) * 2 + 1;
  };

  return (
    <>
      <CommonHeader
        title="虚拟展厅"
      />
      <ContainerSC ref={threeContainer} />
    </>
  );
};

export default Home;
