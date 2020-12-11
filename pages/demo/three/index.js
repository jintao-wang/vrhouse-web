import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import CommonHeader from '../../../components/common_header';

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
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeContainer.current.clientWidth,
      threeContainer.current.clientHeight,
    );
    threeContainer.current.append(renderer.domElement);

    // eslint-disable-next-line max-len
    const camera = new THREE.PerspectiveCamera(
      75,
      threeContainer.current.clientWidth / threeContainer.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: 'rgb(1, 207, 104)',
      opacity: 0.6,
    });
    const cube = new THREE.Mesh(geometry, material);

    const scene = new THREE.Scene();
    scene.add(cube);

    function animate() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }, []);

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
