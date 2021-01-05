import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import CommonHeader from '../../../components/common_header';

const ContainerSC = styled('div')`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const EarthSC = styled('div')`
  border: none;
  cursor: pointer;
  width: 100%;
  height: 100vh;
  background-color: #EEEEEE;
`;

export default () => {
  const earthRef = useRef(null);
  const continents = useRef([
    {
      text: 'Asia',
      position: [0, 0, 201],
    },
    {
      text: 'Europe',
      position: [0, 0, -201],
    },
    {
      text: 'North America',
      position: [201, 0, 0],
    },
    {
      text: 'South America',
      position: [-201, 0, 0],
    },
    {
      text: 'Africa',
      position: [0, 218, 0],
    },
    {
      text: 'Oceania',
      position: [0, -201, 0],
    },
    {
      text: 'Antarctica',
      position: [0, -201, 0],
    },
  ]);
  const city = useRef([
    {
      text: 'Shanghai',
      position: [31.221469, 121.356642],
    },
    {
      text: 'Glasgow',
      position: [55.921751, -4.297487],
    },
  ]);
  const coordinate = useRef([
    {
      text: '+z',
      position: [0, 0, 201],
    },
    {
      text: '-z',
      position: [0, 0, -201],
    },
    {
      text: '+x',
      position: [201, 0, 0],
    },
    {
      text: '-x',
      position: [-201, 0, 0],
    },
    {
      text: '+y',
      position: [0, 218, 0],
    },
    {
      text: '-y',
      position: [0, -201, 0],
    },
  ]);

  useEffect(() => {
    initial();
  }, []);

  function lglt2xyz(longitude, latitude, radius) {
    // 将经度，纬度转换为rad坐标
    const lg = THREE.Math.degToRad(longitude);
    const lt = THREE.Math.degToRad(latitude);
    const temp = radius * Math.cos(lt);
    // 获取x，y，z坐标
    const x = temp * Math.sin(lg);
    const y = radius * Math.sin(lt);
    const z = temp * Math.cos(lg);
    return [x, y, z];
  }

  function makeLabelCanvas(size, name) {
    const borderSize = 2;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const ratio = getPixelRatio(ctx);

    ctx.imageSmoothingQuality = 'high';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const font = `${size}px Microsoft YaHei`;
    ctx.font = font;
    // measure how long the name will be
    const doubleBorderSize = borderSize * 2;
    const width = ctx.measureText(name).width + doubleBorderSize;
    const height = size + doubleBorderSize;
    ctx.canvas.width = width * ratio;
    ctx.canvas.height = height * ratio;

    ctx.scale(ratio, ratio);

    // need to set font again after resizing canvas
    ctx.font = font;
    ctx.textBaseline = 'top';

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgb(0,0,0)';
    // eslint-disable-next-line no-mixed-operators
    ctx.fillText(name, borderSize, borderSize);

    return ctx.canvas;
  }

  const initial = () => {
    let width;
    let height;

    // 帧蘋
    let stats;
    function initStats() {
      stats = new Stats();
      earthRef.current.appendChild(stats.dom);
    }

    // 渲染器
    let renderer;
    function initThree() {
      width = earthRef.current.clientWidth;
      height = earthRef.current.clientHeight;
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      const Ratio = getPixelRatio(earthRef.current);
      renderer.setPixelRatio(Ratio);
      renderer.setSize(width, height);
      earthRef.current.appendChild(renderer.domElement);
      renderer.setClearColor(0x000000, 1.0);
    }

    // 相机
    let camera;
    function initCamera() {
      // 透视相机 视角越大，看到的场景越大，那么中间的物体相对于整个场景来说，就越小了
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 1000;
      camera.lookAt({ x: 0, y: 0, z: 0 });
    }

    // 场景
    let scene;
    function initScene() {
      scene = new THREE.Scene();
    }

    let earthGroup;
    function initEarthGroup() {
      earthGroup = new THREE.Group();
      scene.add(earthGroup);
    }

    // 光源
    let light;
    function initLight() {
      // A light source positioned directly above the scene, with color fading from the sky color to the ground color.
      // 位于场景正上方的光源，颜色从天空颜色渐变为地面颜色。
      // light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
      // scene.add(light);

      // 环境光
      // light = new THREE.AmbientLight(0xffffff);
      // light.position.set(0, 0, 10000);
      // scene.add(light);

      // 平行光
      // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
      // light = new THREE.DirectionalLight('rgb(255,255,187)', 1);
      light = new THREE.DirectionalLight('rgb(255,255,210)', 1);
      light.position.set(0, 0, 10000);

      scene.add(light);
    }

    // 地球
    let earthMesh;
    function initEarth() {
      const earthGeo = new THREE.SphereGeometry(200, 100, 100);
      const earthMater = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/static/Earth.jpg'),
      });
      earthMesh = new THREE.Mesh(earthGeo, earthMater);
      earthMesh.position.set(0, 0, 0);
      earthGroup.add(earthMesh);
    }

    // 云
    let cloudsMesh;
    function initClouds() {
      const cloudsGeo = new THREE.SphereGeometry(201, 100, 100);
      const cloudsMater = new THREE.MeshPhongMaterial({
        alphaMap: new THREE.TextureLoader().load('//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/static/clouds.jpg'),
        transparent: true,
        opacity: 0.2,
      });
      cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMater);
      cloudsMesh.position.set(0, 0, 0);
      earthGroup.add(cloudsMesh);
    }

    function initCoordinate() {
      coordinate.current.forEach((item) => {
        create2DFont(item.text, item.position);
      });
    }

    function initCity() {
      city.current.forEach((item) => {
        create2DFont(item.text, item.position);
      });
    }

    function create2DFont(text, position) {
      if (position.length === 2) {
        position = lglt2xyz(200, position[0], position[1]);
        console.log(position);
        console.log(text);
      }
      const canvas = makeLabelCanvas(12, text);
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      const labelMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
      });

      const labelGeometry = new THREE.PlaneBufferGeometry(18 * text.length / 3.4, 18);

      const text2DMesh1 = new THREE.Mesh(labelGeometry, labelMaterial);
      text2DMesh1.position.set(...position);
      earthGroup.add(text2DMesh1);
    }

    let controls;
    function threeStart() {
      initThree();
      initStats();
      initCamera();
      initScene();
      initEarthGroup();
      initLight();
      initEarth();
      initClouds();
      initCoordinate();
      initCity();
      // 载入控制器
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', lightUpdate);
      renderer.clear();
      animate();
    }

    function lightUpdate() {
      light.position.copy(camera.position);
    }

    function animate() {
      controls.update();
      stats.update();
      // 地球自转
      // earthGroup.rotation.y -= 0.002;

      // 漂浮的云层
      cloudsMesh.rotation.y -= 0.001;
      cloudsMesh.rotation.z += 0.001;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    threeStart();
  };

  const getPixelRatio = function (context) {
    const backingStore = context.backingStorePixelRatio
      || context.webkitBackingStorePixelRatio
      || context.mozBackingStorePixelRatio
      || context.msBackingStorePixelRatio
      || context.oBackingStorePixelRatio
      || context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  };

  return (
    <>
      <CommonHeader
        title="地球"
      >
        <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/sdk/three.min.js" />
        <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/sdk/OrbitControls.js" />
        <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/sdk/stats.min.js" />
      </CommonHeader>
      <ContainerSC>
        <EarthSC ref={earthRef} />
      </ContainerSC>
    </>
  );
};
