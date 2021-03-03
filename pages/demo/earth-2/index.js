import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import oc from 'three-orbit-controls';
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
      position: [39.761844, 88.1847639],
      offset: [0, 0],
      rotate: Math.PI - 0.1,
    },
    {
      text: 'Europe',
      position: [49.579691, 18.951754],
      offset: [0, 0],
      // position: [49.579691, 13.951754],
      rotate: 1.2,
    },
    {
      text: 'North America',
      position: [47.018442, -104.844118],
      offset: [0, 0],
      rotate: -0.1,
    },
    {
      text: 'South America',
      position: [-13.180880, -59.286321],
      offset: [0, 0],
      rotate: -0.05,
    },
    {
      text: 'Africa',
      position: [7.164596, 22.394861],
      offset: [0, 0],
      rotate: 0.25,
    },
    {
      text: 'Oceania',
      position: [-23.155060, 134.149481],
      offset: [0, 0],
      rotate: 1,
    },
    {
      text: 'Antarctica',
      position: [-84.651654, 87.712143],
      offset: [0, 0],
      rotate: 0,
    },
  ]);
  const city = useRef([
    {
      text: '咸阳',
      position: [34.321852, 108.699388],
      offset: [-1, 0],
      rotate: -Math.PI / 2 - 0.55,
      color: 'rgba(255,255,255,.75)',
      flag: {
        color: 'rgb(206,3,20)',
        // color: 'rgb(50,206,206)',
      },
    },
    {
      text: '重庆',
      position: [29.429592, 106.912673],
      offset: [-1, 0],
      rotate: -Math.PI / 2 - 0.5,
      color: 'rgba(255,255,255,.75)',
      flag: {
        // color: 'rgb(206,3,20)',
        color: 'rgb(206,3,20)',
      },
    },
    {
      text: '天津',
      position: [39.336896, 117.357230],
      offset: [-1, 0],
      rotate: -Math.PI / 2 - 0.35,
      color: 'rgba(255,255,255,.75)',
      flag: {
        // color: 'rgb(206,3,20)',
        color: 'rgb(206,3,20)',
      },
    },
    {
      text: '泰州',
      position: [32.464003, 119.924084],
      offset: [-1, 0],
      rotate: -Math.PI / 2 - 0.1,
      color: 'rgba(255,255,255,.75)',
      flag: {
        // color: 'rgb(206,3,20)',
        color: 'rgb(206,3,20)',
      },
    },
    {
      text: '吴江',
      position: [29.128612, 120.639589],
      offset: [-1, 0],
      rotate: -Math.PI / 2 + 0.05,
      color: 'rgba(255,255,255,.75)',
      flag: {
        // color: 'rgb(206,3,20)',
        color: 'rgb(206,3,20)',
      },
    },
    {
      text: '惠州',
      position: [24.108112, 114.449786],
      offset: [-3, 0],
      rotate: -Math.PI / 2 + 0.1,
      color: 'rgba(255,255,255,.75)',
      flag: {
        // color: 'rgb(206,3,20)',
        color: 'rgb(206,3,20)',
      },
    },
    {
      text: '',
      position: [22.770210, 114.479475],
      offset: [0, 0],
      rotate: -Math.PI / 2 + 0.25,
      color: 'rgba(255,255,255,.75)',
      flag: {
        // color: 'rgb(206,3,20)',
        color: 'rgb(206,3,20)',
      },
    },
    {
      text: '越南',
      position: [10.895781, 106.402207],
      offset: [-2, 0],
      rotate: -Math.PI / 2 + 0.55,
      color: 'rgba(255,255,255,.75)',
      flag: {
        // color: 'rgb(206,3,20)',
        color: 'rgb(206,3,20)',
      },
    },
    {
      text: '爱沙尼亚',
      position: [58.934242, 24.233548],
      offset: [-1, 0],
      rotate: 1.5,
      color: 'rgba(255,255,255,.75)',
      flag: {
        // color: 'rgb(206,203,50)',
        color: 'rgb(206,203,50)',
      },
    },
    {
      text: '立陶宛',
      position: [56.217551, 22.706468],
      offset: [-1, 8],
      rotate: 1.45,
      color: 'rgba(255,255,255,.75)',
      flag: {
        // color: 'rgb(206,203,50)',
        color: 'rgb(206,203,50)',
      },
    },
    {
      text: '',
      position: [54.231018, 24.665954],
      offset: [0, 0],
      rotate: 0.9,
      color: 'rgba(255,255,255,.75)',
      flag: {
        // color: 'rgb(206,203,50)',
        color: 'rgb(206,203,50)',
      },
    },
    {
      text: '波兰',
      position: [53.134621, 18.005243],
      offset: [-1, 0],
      rotate: 1.3,
      color: 'rgba(255,255,255,.75)',
      flag: {
        // color: 'rgb(206,203,50)',
        color: 'rgb(206,203,50)',
      },
    },
    {
      text: '乌克兰',
      position: [47.290765, 32.720760],
      offset: [-1, 0],
      rotate: 1.3,
      color: 'rgba(255,255,255,.75)',
      flag: {
        // color: 'rgb(206,203,50)',
        color: 'rgb(206,203,50)',
      },
    },
    // {
    //   text: '芝华士-休斯顿',
    //   position: [29.727999, -95.299035],
    //   rotate: -0,
    //   color: 'rgba(255,255,255,.75)',
    //   flag: {
    //     color: 'rgb(206,203,50)',
    //   },
    // },
    // {
    //   text: '芝华士-温哥华',
    //   position: [49.243698, -123.077910],
    //   rotate: 0,
    //   color: 'rgba(255,255,255,.75)',
    //   flag: {
    //     color: 'rgb(206,203,50)',
    //   },
    // },
  ]);

  useEffect(() => {
    initial();
  }, []);

  function makeLabelCanvas(size, name, color) {
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

    ctx.fillStyle = 'rgba(255,255,255,0)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = color || 'rgb(0,0,0)';
    // eslint-disable-next-line no-mixed-operators
    ctx.fillText(name, borderSize, borderSize);

    return ctx.canvas;
  }

  // 经纬度转换函数
  const getPosition = function (longitude, latitude, radius) {
    const lg = THREE.Math.degToRad(longitude);
    const lt = THREE.Math.degToRad(latitude);
    const temp = radius * Math.cos(lt);
    const x = temp * Math.sin(lg);
    const y = radius * Math.sin(lt);
    const z = temp * Math.cos(lg);
    return {
      x,
      y,
      z,
    };
  };

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
      camera = new THREE.PerspectiveCamera(20, width / height, 1, 10000);
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 200;
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
      earthGroup.rotateY(-Math.PI - 0.5);
      scene.add(earthGroup);
    }

    // 光源
    let light;
    function initLight() {
      light = new THREE.DirectionalLight('rgb(255,255,210)', 1);
      light.position.set(0, 0, 10000);

      scene.add(light);
    }

    // 地球
    let earthMesh;
    function initEarth() {
      const earthGeo = new THREE.SphereGeometry(30, 50, 50);
      const earthMater = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/static/Earth.jpg'),
        // map: new THREE.TextureLoader().load('//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/static/202010231708.jpg'),
      });
      earthMesh = new THREE.Mesh(earthGeo, earthMater);
      earthMesh.position.set(0, 0, 0);
      earthGroup.add(earthMesh);
    }

    // 云
    let cloudsMesh;
    function initClouds() {
      const cloudsGeo = new THREE.SphereGeometry(30.1, 50, 50);
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

    function initContinents() {
      continents.current.forEach((item) => {
        create2DFont(item.text, item.position, item.rotate, null, item.offset);
      });
    }

    function initCity() {
      city.current.forEach((item) => {
        create2DFont(item.text, item.position, item.rotate, item.color, item.offset);
        if (item.flag) {
          setTimeout(() => {
            markingPointNew(item);
          });
        }
      });
    }

    function create2DFont(text, position, angle, color, offset) {
      if (position.length === 2) {
        const pos = getPosition(position[1] + offset[1] + 90, position[0] + offset[0], 30.2);
        position = [pos.x, pos.y, pos.z];
      }
      const canvas = makeLabelCanvas(24, text, color);
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      const labelMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
      });

      // const labelGeometry = new THREE.PlaneBufferGeometry(3 * text.length / 2.8, 3);
      const labelGeometry = new THREE.PlaneBufferGeometry(1.2 * text.length / 1, 1.2);

      const text2DMesh1 = new THREE.Mesh(labelGeometry, labelMaterial);
      text2DMesh1.position.set(...position);

      // const vector = new THREE.Vector3(...position).normalize();
      //
      // const qua = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 0), vector);
      // text2DMesh1.rotation.setFromQuaternion(qua);
      // text2DMesh1.rotateY(Math.PI/4);

      const vector = new THREE.Vector3(...position).normalize();

      const qua = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), vector);
      text2DMesh1.rotation.setFromQuaternion(qua);
      const obj = new THREE.Object3D();
      obj.add(text2DMesh1);
      earthGroup.add(obj);
      const q = new THREE.Quaternion().setFromAxisAngle(vector, angle);
      obj.rotation.setFromQuaternion(q);
    }

    // const markingPoint = function (marking) {
    //   const pos = getPosition(marking.position[1] + 90, marking.position[0], 30);
    //   const _pos = getPosition(marking.position[1] + 90, marking.position[0], 30 + 1);
    //   const curve = new THREE.CubicBezierCurve3(pos, pos, _pos, _pos);
    //   const points = curve.getPoints(100);
    //   const aGroup = new THREE.Group();
    //   points.forEach((pointItem, index) => {
    //     const radius = 0.5 - index * 0.005;
    //     const aGeo = new THREE.SphereGeometry(radius, 15, 15);
    //     const aMater = new THREE.MeshPhongMaterial({
    //       color: marking.flag.color,
    //       transparent: true,
    //       opacity: 1 - index * 0.01,
    //     });
    //     const aMesh = new THREE.Mesh(aGeo, aMater);
    //     aMesh.position.set(pointItem.x, pointItem.y, pointItem.z);
    //     aGroup.add(aMesh);
    //   });
    //   earthGroup.add(aGroup);
    // };

    const markingPointNew = function (marking) {
      const pos = getPosition(marking.position[1] + 90, marking.position[0], 32);
      const geometry = new THREE.ConeBufferGeometry(0.4, 1.4, 5);
      const material = new THREE.MeshPhongMaterial({
        color: marking.flag.color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      const cone = new THREE.Mesh(geometry, material);
      cone.position.set(pos.x, pos.y, pos.z);

      const vector = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
      const qua = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), vector);
      cone.rotation.setFromQuaternion(qua);

      const geo = new THREE.EdgesGeometry(cone.geometry); // or WireframeGeometry
      const mat = new THREE.LineBasicMaterial({
        color: marking.flag.color,
        linewidth: 1,
        transparent: true,
        opacity: 0.8,
      });
      const wireframe = new THREE.LineSegments(geo, mat);
      cone.add(wireframe);

      earthGroup.add(cone);
    };

    let controls;
    function threeStart() {
      initThree();
      // initStats();
      initCamera();
      initScene();
      initEarthGroup();
      initLight();
      initEarth();
      initClouds();
      initCity();
      // initCoordinate();
      initContinents();
      // 载入控制器
      const OrbitControls = oc(THREE);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', lightUpdate);
      renderer.clear();
      animate();
    }

    function lightUpdate() {
      light.position.copy(camera.position);
    }

    function animate() {
      controls.update();
      // const vector = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z).normalize();
      // let qua = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), vector);
      // rotateGlasgow.current.rotation.setFromQuaternion(qua);
      // stats.update();
      // 地球自转
      // earthGroup.rotation.y -= 0.002;

      // 漂浮的云层
      cloudsMesh.rotation.y -= 0.0002;
      cloudsMesh.rotation.z += 0.0002;

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
        {/* <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/sdk/three.min.js" /> */}
        {/* <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/sdk/OrbitControls.js" /> */}
        {/* <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/sdk/stats.min.js" /> */}
      </CommonHeader>
      <ContainerSC>
        <EarthSC ref={earthRef} />
      </ContainerSC>
    </>
  );
};
