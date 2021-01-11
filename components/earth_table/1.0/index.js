import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import oc from 'three-orbit-controls';
import PropTypes from 'prop-types';
import { isMobile, AnimateJS } from '../../../util/common';
import GlobalClose from '../../global-close/2.0';
import ZTop from '../../z_top/1.0';

const ContainerSC = styled('div')`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const EarthSC = styled('div')`
  border: none;
  //cursor: pointer;
  width: 100%;
  height: 100%;
  background-color: #EEEEEE;
  position: absolute;
`;

const PackageDisplayContainerSC = styled('div', ['visible'])`
  position: absolute;
  width: 100%;
  height: 100%;
  display: ${(props) => (props.visible ? 'unset' : 'none')};
`;

const PackageDisplayContentSC = styled('div', ['left', 'top', 'visible'])`
  position: absolute;
  left: ${(props) => props.left - 100}px;
  top: ${(props) => props.top + 20}px;
  width: 180px;
  background: white;
  box-shadow: 0 0 32px -10px rgba(0,0,0,.5);
  border-radius: 6px;
  overflow: hidden;
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  flex-direction: column;
  box-sizing: border-box;
`;

const VrContainerParentSC = styled('div', ['url'])`
  width: 100%;
  height: 130px;
  overflow: hidden;
  position: relative;
  
  .loading {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: url(${(props) => props.url}) no-repeat center / contain;
    transform: scale(.5);
  }
`;

const VrContainerSC = styled('div')`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const VrContentSC = styled('div')`
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  cursor: pointer;
  
  .point {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgb(204, 174, 104);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 14px;
  }
  .info {
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    padding-left: 5px;
    font-size: 12px;
    color: rgb(112, 112, 112);
    font-weight: 500;
    
    .line {
      margin-bottom: 2px;
    }
  }
`;

const EarthTable = ({
  activePackage,
  activeGroup,
  groupMap,
  vrDom,
  onPackageChange,
  loadState,
  visible,
}) => {
  const earthRef = useRef(null);
  const earthObj = useRef({});
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
  const packageObjs = useRef([]);
  const activePackageObj = useRef(null);
  const rotateAngle = useRef(0);
  const jumpHeight = useRef(0.06);
  const packageDisplayPosition = useRef({});
  const packageDisplayRef = useRef(null);
  const [isPackageDisplay, setPackageDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const stopAni = useRef(false);
  const activePackageRef = useRef(activePackage);
  const loaded = useRef(false);

  useEffect(() => {
    preloadImg('//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/static/Earth.jpg');
    preloadImg('//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/static/clouds.jpg');
  }, []);

  useEffect(() => {
    if (loadState === 'loadStart') {
      setLoading(true);
    } else {
      setTimeout(() => {
        setLoading(false);
        HouseViewer.BaseAPI.changeFloor(false);
      }, 2000);
    }
  }, [loadState]);

  useEffect(() => {
    if (visible && !loaded.current) {
      setTimeout(() => {
        loaded.current = true;
      }, 1000);
      initial();
    }
  }, [visible]);

  useEffect(() => {
    activePackageRef.current = activePackage;
    for (const item of packageObjs.current) {
      if (item.additionalData === activePackage) {
        activePackageObj.current = item;
      }
    }
  }, [activePackage]);

  // 事件监测
  useEffect(() => {
    if (!visible || loaded.current) return;
    const raycaster = new THREE.Raycaster();
    const position = new THREE.Vector2();

    const onEventListener = (event) => {
      event.stopPropagation();
      event.cancelBubble = true;
      // eslint-disable-next-line max-len
      getMousePosition(earthObj.current.camera, event, earthObj.current.renderer.domElement, position);
      raycaster.setFromCamera(position, earthObj.current.camera);
      const intersects = raycaster.intersectObjects(earthObj.current.scene.children, true);
      if (intersects.length > 0) {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of intersects) {
          if (item.object.type === 'Mesh') {
            for (const obj of packageObjs.current) {
              if (obj.additionalData === item.object.additionalData) {
                if (activePackageObj.current !== obj) {
                  stopAni.current = true;
                }
                activePackageObj.current = obj;
                break;
              }
            }
            if (item.object.additionalData) {
              if (activePackageRef.current === item.object.additionalData) {
                packageDisplayPosition.current.left = event.offsetX;
                packageDisplayPosition.current.top = event.offsetY;
                setPackageDisplay(true);
                packageDisplayRef.current.append(vrDom);
              } else {
                packageDisplayPosition.current.left = event.offsetX;
                packageDisplayPosition.current.top = event.offsetY;
                setPackageDisplay(true);
                packageDisplayRef.current.append(vrDom);
                onPackageChange(item.object.additionalData);
              }
              return;
            }
          }
        }
      }
    };

    earthRef.current.addEventListener('click', onEventListener, false);
  }, [visible]);

  const preloadImg = (url, callback) => {
    const img = new Image();
    img.crossOrigin = '';
    if (img.complete) {
      // eslint-disable-next-line no-unused-expressions
      callback && callback.call(img);
      return;
    }
    img.onload = function () {
      img.onload = null;
      // eslint-disable-next-line no-unused-expressions
      callback && callback.call(img);
    };

    img.src = url;
  };

  const getMousePosition = (camera, domEvent, domElement, position) => {
    // eslint-disable-next-line max-len,no-param-reassign
    position.x = ((domEvent.clientX - domElement.getBoundingClientRect().left) / domElement.offsetWidth) * 2 - 1;
    // eslint-disable-next-line max-len,no-param-reassign
    position.y = -((domEvent.clientY - domElement.getBoundingClientRect().top) / domElement.offsetHeight) * 2 + 1;
  };

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
    earthObj.current.earthRadius = isMobile ? 24 : 30;

    // 渲染器
    function initThree() {
      width = earthRef.current.clientWidth;
      height = earthRef.current.clientHeight;
      earthObj.current.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      const Ratio = getPixelRatio(earthRef.current);
      earthObj.current.renderer.setPixelRatio(Ratio);
      earthObj.current.renderer.setSize(width, height);
      earthRef.current.appendChild(earthObj.current.renderer.domElement);
      earthObj.current.renderer.setClearColor(0x000000, 1.0);
    }

    // 相机
    function initCamera() {
      // 透视相机 视角越大，看到的场景越大，那么中间的物体相对于整个场景来说，就越小了
      earthObj.current.camera = new THREE.PerspectiveCamera(20, width / height, 1, 10000);
      earthObj.current.camera.position.x = 0;
      earthObj.current.camera.position.y = 0;
      earthObj.current.camera.position.z = 200;
      earthObj.current.camera.lookAt({ x: 0, y: 0, z: 0 });
    }

    // 场景
    function initScene() {
      earthObj.current.scene = new THREE.Scene();
    }

    function initEarthGroup() {
      earthObj.current.earthGroup = new THREE.Group();
      earthObj.current.earthGroup.rotateY(-Math.PI - 0.5);
      earthObj.current.earthGroup.name = 'earthGroup';
      console.log(earthObj.current.earthGroup);
      earthObj.current.scene.add(earthObj.current.earthGroup);
    }

    // 光源
    function initLight() {
      earthObj.current.light = new THREE.DirectionalLight('rgb(255,255,210)', 1);
      earthObj.current.light.position.set(0, 0, 10000);

      earthObj.current.scene.add(earthObj.current.light);
    }

    // 地球
    function initEarth() {
      const earthGeo = new THREE.SphereGeometry(earthObj.current.earthRadius, 50, 50);
      const earthMater = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/static/Earth.jpg'),
      });
      earthObj.current.earthMesh = new THREE.Mesh(earthGeo, earthMater);
      earthObj.current.earthMesh.name = 'earth';
      earthObj.current.earthMesh.position.set(0, 0, 0);
      earthObj.current.earthGroup.add(earthObj.current.earthMesh);
    }

    // 云
    function initClouds() {
      const cloudsGeo = new THREE.SphereGeometry(earthObj.current.earthRadius + 0.1, 50, 50);
      const cloudsMater = new THREE.MeshPhongMaterial({
        alphaMap: new THREE.TextureLoader().load('//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/demo/earth/static/clouds.jpg'),
        transparent: true,
        opacity: 0.2,
      });
      earthObj.current.cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMater);
      earthObj.current.cloudsMesh.name = 'cloud';
      earthObj.current.cloudsMesh.position.set(0, 0, 0);
      earthObj.current.earthGroup.add(earthObj.current.cloudsMesh);
    }

    function initContinents() {
      continents.current.forEach((item) => {
        create2DFont(item.text, item.position, item.rotate, null, item.offset);
      });
    }

    function initGroup() {
      for (const [group, groupPackages] of groupMap) {
        groupPackages.forEach((packageInfo) => {
          create2DFont(
            packageInfo.table.text,
            packageInfo.table.position,
            packageInfo.table.rotate,
            group.tableTextColor,
            packageInfo.table.offset,
            packageInfo,
          );

          setTimeout(() => {
            markingPointNew({
              position: packageInfo.table.position,
              color: group.tableFlagColor,
              packageInfo,
            });
          });
        });
      }
    }

    function create2DFont(text, position, angle, color, offset, packageInfo) {
      if (position.length === 2) {
        const pos = getPosition(
          position[1] + offset[1] + 90,
          position[0] + offset[0],
          earthObj.current.earthRadius + 0.2,
        );
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
      const labelGeometry = new THREE.PlaneBufferGeometry(
        (1.2 * text.length) / 1,
        1.2,
      );

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
      text2DMesh1.name = '2DFont';
      text2DMesh1.additionalData = packageInfo;
      const obj = new THREE.Object3D();
      obj.add(text2DMesh1);
      earthObj.current.earthGroup.add(obj);
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

    const markingPointNew = function ({
      position,
      color,
      packageInfo,
    }) {
      const pos = getPosition(
        position[1] + 90,
        position[0],
        earthObj.current.earthRadius + 2,
      );
      const geometry = new THREE.ConeBufferGeometry(0.4, 1.4, 5);
      const material = new THREE.MeshPhongMaterial({
        color,
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
        color,
        linewidth: 1,
        transparent: true,
        opacity: 0.8,
      });
      const wireframe = new THREE.LineSegments(geo, mat);
      cone.add(wireframe);
      cone.additionalData = packageInfo;
      cone.name = 'markingPoint';

      const obj = new THREE.Object3D();
      obj.add(cone);
      obj.additionalData = packageInfo;

      packageObjs.current.push(obj);

      if (packageInfo === activePackage) {
        activePackageObj.current = obj;
      }

      earthObj.current.earthGroup.add(obj);

      const objRotateAni = () => {
        if (activePackageObj.current === obj) {
          rotateAngle.current += 0.05;
          const pos = getPosition(
            packageInfo.table.position[1] + 90,
            packageInfo.table.position[0],
            earthObj.current.earthRadius + 2,
          );
          const vector = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
          const qua = new THREE.Quaternion().setFromAxisAngle(vector, rotateAngle.current);
          obj.rotation.setFromQuaternion(qua);
        }
        requestAnimationFrame(objRotateAni);
      };

      const jumpPos = getPosition(
        packageInfo.table.position[1] + 90,
        packageInfo.table.position[0],
        earthObj.current.earthRadius + 2,
      );
      const jumpVector = new THREE.Vector3(jumpPos.x, jumpPos.y, jumpPos.z).normalize();
      const downPosition = { ...obj.position };

      const objJumpAni = (isUp) => {
        ani({
          duration: 800,
          // eslint-disable-next-line no-restricted-properties
          timing: (timeFraction) => -Math.pow(timeFraction, 2) + 2 * timeFraction,
          draw: (progress) => {
            if (activePackageObj.current !== obj) {
              obj.position.set(
                downPosition.x,
                downPosition.y,
                downPosition.z,
              );
              return;
            }
            if (isUp) {
              obj.translateOnAxis(
                jumpVector,
                jumpHeight.current * progress,
              );
            } else {
              obj.translateOnAxis(
                jumpVector,
                -jumpHeight.current * progress,
              );
            }
          },
          callback: () => {
            if (!isUp) {
              obj.position.set(
                downPosition.x,
                downPosition.y,
                downPosition.z,
              );
            }
            objJumpAni(!isUp);
          },
        });
      };

      const ani = ({
        timing,
        draw,
        duration,
        callback,
      }) => {
        const start = performance.now();
        // eslint-disable-next-line no-shadow
        requestAnimationFrame(function animate(time) {
          let timeFraction = (time - start) / duration;
          if (timeFraction > 1) timeFraction = 1;

          const progress = timing(timeFraction);
          draw(progress); // 绘制

          if (timeFraction < 1) {
            // eslint-disable-next-line no-unused-vars
            requestAnimationFrame(animate);
          } else {
            callback();
          }
        });
      };

      objRotateAni();
      objJumpAni(true);
    };

    function threeStart() {
      initThree();
      // initStats();
      initCamera();
      initScene();
      initEarthGroup();
      initLight();
      initEarth();
      initClouds();
      initGroup();
      // initCoordinate();
      initContinents();
      // 载入控制器
      const OrbitControls = oc(THREE);
      earthObj.current.controls = new OrbitControls(
        earthObj.current.camera,
        earthObj.current.renderer.domElement,
      );
      earthObj.current.controls.addEventListener('change', lightUpdate);
      earthObj.current.renderer.clear();
      animate();
    }

    function lightUpdate() {
      earthObj.current.light.position.copy(earthObj.current.camera.position);
    }

    function animate() {
      earthObj.current.controls.update();

      // if (activePackageObj.current) {
      //   rotateAngle.current += 0.1;
      //   const pos = getPosition(
      //     activePackageRef.current.table.position[1] + 90,
      //     activePackageRef.current.table.position[0],
      //     earthObj.current.earthRadius + 2,
      //   );
      //   const vector = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
      //   const qua = new THREE.Quaternion().setFromAxisAngle(vector, rotateAngle.current);
      //   activePackageObj.current.rotation.setFromQuaternion(qua);
      // }

      // 地球自转
      // earthGroup.rotation.y -= 0.002;

      // 漂浮的云层
      earthObj.current.cloudsMesh.rotation.y -= 0.0002;
      earthObj.current.cloudsMesh.rotation.z += 0.0002;

      earthObj.current.renderer.render(earthObj.current.scene, earthObj.current.camera);
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
    <ContainerSC>
      <EarthSC ref={earthRef} />
      <PackageDisplayContainerSC visible={isPackageDisplay}>
        <ZTop>
          <GlobalClose
            // openListener={isPackageDisplay}
            onClose={(e) => {
              if (!e.target.contains(document.body)) {
                setPackageDisplay(false);
              }
            }}
            // stopPropagation={false}
          >
            <PackageDisplayContentSC
              left={packageDisplayPosition.current.left}
              top={packageDisplayPosition.current.top}
              visible={isPackageDisplay && visible}
            >
              <VrContainerParentSC url={require('./static/Spin-1s-200px.gif')}>
                <VrContainerSC
                  ref={packageDisplayRef}
                />
                {
                  loading && <div className="loading" />
                }
              </VrContainerParentSC>
              <VrContentSC onClick={() => HouseViewer.BaseAPI.backToPanoramaView()}>
                <div className="point">{activePackage.introduction.index}</div>
                <div className="info">
                  {
                    activePackage.introduction.info.map((item) => (
                      <div className="line" key={item}>{item}</div>
                    ))
                  }
                </div>
              </VrContentSC>
            </PackageDisplayContentSC>
          </GlobalClose>
        </ZTop>
      </PackageDisplayContainerSC>
    </ContainerSC>
  );
};

EarthTable.propTypes = {
  activePackage: PropTypes.shape({
    introduction: PropTypes.shape({
      index: PropTypes.number,
      info: PropTypes.arrayOf(),
    }),
  }),
  activeGroup: PropTypes.shape({}),
  groupMap: PropTypes.shape({}),
  vrDom: PropTypes.node,
  onPackageChange: PropTypes.func,
  loadState: PropTypes.string.isRequired,
  visible: PropTypes.bool,
};

EarthTable.defaultProps = {
  activePackage: {},
  activeGroup: {},
  groupMap: {},
  vrDom: <div />,
  onPackageChange: () => {},
  visible: false,
};

export default EarthTable;
