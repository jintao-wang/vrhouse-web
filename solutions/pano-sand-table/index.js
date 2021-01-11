import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const ContainerSC = styled('div', ['sandImg'])`
  width: 100vw;
  height: 100vh;
  background: rgb(0,0,0) url(${(props) => props.sandImg}) no-repeat center / cover;
  position: relative;
  overflow: hidden;
`;

const PanoSandTable = () => {
  const container = useRef(null);
  const three = useRef(null);
  const [threeLoaded, setThreeLoaded] = useState(false);

  // 异步加载THREE模块
  useEffect(() => {
    import('../../../three/three.module')
      .then((module) => {
        setThreeLoaded(true);
        three.current = module;
      })
      .catch((err) => console.error(err.message));
  }, []);

  useEffect(() => {
    if (!threeLoaded) return;
    const THREE = three.current;
    let camera;
    let scene;
    let renderer;
    let mesh;
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const init = () => {
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 700;

      scene = new THREE.Scene();

      const texture = new THREE.TextureLoader().load('https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/static/pano-sand-table/hao.png');

      const geometry = new THREE.BoxBufferGeometry(200, 200, 200);
      const material = new THREE.MeshBasicMaterial({ map: texture });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.current.appendChild(renderer.domElement);
      window.addEventListener('resize', onWindowResize, false);
    };
    const animate = () => {
      requestAnimationFrame(animate);

      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.01;

      renderer.render(scene, camera);
    };
    init();
    animate();
  }, [threeLoaded]);

  return (
    <ContainerSC ref={container} />
  );
};

export default PanoSandTable;
