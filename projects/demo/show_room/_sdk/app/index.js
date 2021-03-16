import * as THREE from 'three';
import { MapControls } from '../OrbitControls';
import ShowRoomControl from '../controls';
import { AnimationControls } from '../controls/AnimationControls';

export default class App {
  constructor({
    mode,
    renderDom,
    showRoomData,
    webCallback,
  }) {
    App.mode = mode;
    this.showRoomData = showRoomData;

    this.renderDom = renderDom;
    this.width = renderDom.clientWidth;
    this.height = renderDom.clientHeight;

    this.scale3d = 1 / 4;

    this.renderer = App.createRender(renderDom, this.width, this.height);
    this.persCamera = App.createPersCamera(this.width, this.height, this.scale3d);
    this.orthoCamera = App.createOrthoCamera(this.width, this.height);
    this.scene = App.createScene();
    this.lights = App.createLights();
    this.ground = App.createGround();
    this.control2d = App.create2DControls(this.orthoCamera, this.renderer);
    this.control3d = App.create3DControls(this.persCamera, this.renderer);
    this.raycaster = new THREE.Raycaster();
    this.raycasterPosition = new THREE.Vector2();

    this.showRoomControl = null;

    this.webCallback = {
      getShowRoomControl: webCallback.getShowRoomControl,
      onSelectCancel: webCallback.onSelectCancel,
      onSelected: webCallback.onSelected,
    };

    this.animationControls = new AnimationControls();

    App.selectedShowRoom = null;
    App.camera = mode === '2D' ? this.orthoCamera : this.persCamera;

    this.initial();
  }

  initial() {
    this.start();
    if (App.mode === '3D') {
      // this.renderer.scale.set(this.scale3d, this.scale3d, this.scale3d);
    }
    this.showRoomControl = App.createShowRoomControl(
      this.scene,
      this.persCamera,
      this.renderer,
      this.ground,
      this.showRoomData,
    );
    this.webCallback.getShowRoomControl(this.showRoomControl);
    App.initialEventListener({
      scene: this.scene,
      renderer: this.renderer,
      raycaster: this.raycaster,
      position: this.raycasterPosition,
      renderDom: this.renderDom,
      webCallback: this.webCallback,
      control2d: this.control2d,
      control3d: this.control3d,
    });
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  onWindowResize() {
    this.width = this.renderDom.clientWidth;
    this.height = this.renderDom.clientHeight;
    this.persCamera.aspect = this.width / this.height;
    this.persCamera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  start() {
    this.lights.forEach((light) => this.scene.add(light));

    this.animate();
  }

  animate() {
    // if (this.mode === '2D') {
    //   this.control2d.update();
    // } else if (this.mode === '3D') {
    //   this.control3d.update();
    // }
    // this.scene.rotateY(0.0002);
    this.control3d.update();
    this.renderer.render(this.scene, App.camera);
    this.animationControls.update();
    requestAnimationFrame(this.animate.bind(this));
  }

  switchMode(mode) {
    if (mode === App.mode) return;
    App.mode = mode;
    const persCameraTrans = {
      posX: this.persCamera.position.x,
      posY: this.persCamera.position.y,
      posZ: this.persCamera.position.z,
      rotX: this.persCamera.rotation.x,
      rotY: this.persCamera.rotation.y,
      rotZ: this.persCamera.rotation.z,
    };
    const orthoCameraTrans = {
      posX: this.orthoCamera.position.x,
      posY: this.orthoCamera.position.y,
      posZ: this.orthoCamera.position.z,
      rotX: this.orthoCamera.rotation.x,
      rotY: this.orthoCamera.rotation.y,
      rotZ: this.orthoCamera.rotation.z,
    };
    if (mode === '2D') {
      this.scene.remove(this.persCamera);
      this.scene.add(this.orthoCamera);
      persCameraTrans.rotY = orthoCameraTrans.rotY;
      const to2DAnimation = this.animationControls.transformCamera(
        this.orthoCamera,
        persCameraTrans,
        orthoCameraTrans,
        'Cubic',
        'InOut',
      );
      to2DAnimation.onStart(() => {
        App.camera = this.orthoCamera;

        this.orthoCamera.left = -this.width * 4;
        this.orthoCamera.right = -this.orthoCamera.left;
        this.orthoCamera.updateProjectionMatrix();

        this.control2d.enabled = false;
        this.control3d.enabled = false;
      });
      to2DAnimation.onComplete(() => {
        this.control2d.enabled = true;
        this.control3d.enabled = false;
      });
      to2DAnimation.start();
    } else if (mode === '3D') {
      this.scene.remove(this.orthoCamera);
      this.scene.add(this.persCamera);
      const to3DAnimation = this.animationControls.transformCamera(
        this.persCamera,
        orthoCameraTrans,
        persCameraTrans,
        'Cubic',
        'InOut',
      );
      to3DAnimation.onStart(() => {
        App.camera = this.persCamera;

        this.control2d.enabled = false;
        this.control3d.enabled = false;

        this.persCamera.aspect = this.width / this.height;
        this.persCamera.updateProjectionMatrix();
      });
      to3DAnimation.onComplete(() => {
        this.control2d.enabled = false;
        this.control3d.enabled = true;
      });
      to3DAnimation.start();
    }
  }
}

App.createRender = (renderDom, width, height) => {
  // eslint-disable-next-line no-shadow
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  const Ratio = getPixelRatio(renderDom);
  renderer.setPixelRatio(Ratio);
  renderer.setSize(width, height);
  renderDom.appendChild(renderer.domElement);
  renderer.autoClearColor = false;

  return renderer;
};

App.createPersCamera = (width, height, scale) => {
  const persCamera = new THREE.PerspectiveCamera(
    90,
    width / height,
    0.5,
    100000,
  );
  persCamera.rotation.reorder('YXZ');

  const theta = THREE.Math.degToRad(0);
  const phi = THREE.Math.degToRad(50);
  const radius = Math.max(10 * 100 / scale);
  // eslint-disable-next-line max-len
  const position = new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, phi, theta));
  persCamera.position.copy(position);

  return persCamera;
};

App.createOrthoCamera = (width, height) => {
  const orthoCamera = new THREE.OrthographicCamera(
    width * -4,
    width * 4,
    height * 4,
    height * -4,
    1,
    10000,
  );
  orthoCamera.position.set(0, 500, 0);
  orthoCamera.up = new THREE.Vector3(0, 1, 0);

  return orthoCamera;
};

App.createScene = () => new THREE.Scene();

App.createLights = () => {
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
};

App.createGround = () => {
  const geometry = new THREE.PlaneBufferGeometry(20000, 20000);
  const material = new THREE.MeshBasicMaterial({ color: '#DEDEDE' });

  const ground = new THREE.Mesh(geometry, material);
  ground.renderOrder = 10;
  ground.position.y -= 20;
  ground.rotation.set(-Math.PI / 2, 0, 0);

  return ground;
};

App.lightUpdate = (camera, light) => {
  light.position.copy(camera.position);
};

App.create2DControls = (camera, renderer, light) => {
  const controls = new MapControls(camera, renderer.domElement);
  controls.maxPolarAngle = THREE.Math.degToRad(90);

  controls.rotateSpeed = 0.5;
  controls.screenSpacePanning = false;
  controls.minDistance = 10;
  controls.maxDistance = 4000;
  controls.panSpeed = 1;

  controls.enableDamping = true;
  controls.dampingFactor = 0.2;
  controls.enableInertia = true;
  controls.inertiaFactor = 0.9;

  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };

  // controls.addEventListener('change', () => App.lightUpdate(camera, light));
  renderer.clear();

  return controls;
};

App.create3DControls = (camera, renderer, light) => {
  const controls = new MapControls(camera, renderer.domElement);
  controls.maxPolarAngle = THREE.Math.degToRad(90);

  controls.rotateSpeed = 0.5;
  controls.screenSpacePanning = false;
  controls.minDistance = 10;
  controls.maxDistance = 4000;
  controls.panSpeed = 1;

  controls.enableDamping = true;
  controls.dampingFactor = 0.2;
  controls.enableInertia = true;
  controls.inertiaFactor = 0.9;

  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.2;

  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };

  // controls.addEventListener('change', () => App.lightUpdate(camera, light));
  renderer.clear();

  return controls;
};

App.createShowRoomControl = (scene, camera, renderer, ground, showRoomData) => {
  const showRoomControl = new ShowRoomControl(scene, camera, renderer, ground, showRoomData);
  return showRoomControl;
};

App.initialEventListener = ({
  scene,
  renderer,
  raycaster,
  position,
  renderDom,
  webCallback,
  control2d,
  control3d,
}) => {
  const hoverShowRoom = new Map();
  let timer = null;

  const getMousePosition = (domEvent, domElement, position) => {
    // eslint-disable-next-line max-len
    position.x = ((domEvent.clientX - domElement.getBoundingClientRect().left) / domElement.offsetWidth) * 2 - 1;
    // eslint-disable-next-line max-len
    position.y = -((domEvent.clientY - domElement.getBoundingClientRect().top) / domElement.offsetHeight) * 2 + 1;
  };

  const onMouseMove = (event) => {
    if (App.selectedShowRoom) return;
    getMousePosition(event, renderer.domElement, position);
    raycaster.setFromCamera(position, App.camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects[0]?.object.booked) return;

    if (intersects[0]?.object.type !== 'showRoom3D' && intersects[0]?.object.type !== 'showRoomName') {
      // eslint-disable-next-line no-restricted-syntax
      for (const showRoom of hoverShowRoom.keys()) {
        if (!showRoom.booked) {
          showRoom.material = hoverShowRoom.get(showRoom).originalMaterial;
          hoverShowRoom.get(showRoom).hoverMaterial.dispose();
        }
      }
      hoverShowRoom.clear();
    }

    if (intersects.length > 0 && intersects[0].object.type === 'showRoom3D') {
      // eslint-disable-next-line no-restricted-syntax
      for (const showRoom of hoverShowRoom.keys()) {
        if (!showRoom.booked) {
          showRoom.material = hoverShowRoom.get(showRoom).originalMaterial;
          hoverShowRoom.get(showRoom).hoverMaterial.dispose();
        }
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
    clearTimeout(timer);
    control3d.autoRotate = false;
    timer = setTimeout(() => {
      control3d.autoRotate = true;
    }, 10000);
    getMousePosition(event, renderer.domElement, position);
    raycaster.setFromCamera(position, App.camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0 && intersects[0].object.type === 'showRoom3D') {
      // 复原上一个点击的展位材质
      if (App.selectedShowRoom) {
        App.selectedShowRoom.material.opacity = 1;
      }

      // 再次点击已经原则的展位
      if (App.selectedShowRoom === intersects[0].object) {
        App.selectedShowRoom.position.set(
          App.selectedShowRoom.position.x,
          App.selectedShowRoom.position.y - 150,
          App.selectedShowRoom.position.z,
        );
        const textPositionPre = App.selectedShowRoom.text.position;
        textPositionPre.set(textPositionPre.x, textPositionPre.y - 150, textPositionPre.z);
        App.selectedShowRoom = null;
        // 回调
        webCallback.onSelectCancel();
        return;
      }

      // 复原上一个选择的不同的展位
      if (App.selectedShowRoom) {
        App.selectedShowRoom.position.set(
          App.selectedShowRoom.position.x,
          App.selectedShowRoom.position.y - 150,
          App.selectedShowRoom.position.z,
        );
        const textPositionPre = App.selectedShowRoom.text.position;
        textPositionPre.set(
          textPositionPre.x,
          textPositionPre.y - 150,
          textPositionPre.z,
        );
      }

      const materialClone = intersects[0].object.material.clone();
      materialClone.opacity = 0.75;
      intersects[0].object.material = materialClone;

      const id = Symbol.for('showRoomId');
      App.selectedShowRoom = intersects[0].object;
      App.selectedShowRoom.position.set(
        App.selectedShowRoom.position.x,
        App.selectedShowRoom.position.y + 150,
        App.selectedShowRoom.position.z,
      );
      webCallback.onSelected({
        showRoomId: intersects[0].object[id],
        displayInfo: intersects[0].object.displayInfo,
        booked: intersects[0].object.booked,
      });
      const textPosition = App.selectedShowRoom.text.position;
      textPosition.set(textPosition.x, textPosition.y + 150, textPosition.z);
      return;
    }
    if(!App.selectedShowRoom) return;
    // 点击非展位区域取消选择
    App.selectedShowRoom.position.set(
      App.selectedShowRoom.position.x,
      App.selectedShowRoom.position.y - 150,
      App.selectedShowRoom.position.z,
    );
    const textPositionPre = App.selectedShowRoom.text.position;
    textPositionPre.set(textPositionPre.x, textPositionPre.y - 150, textPositionPre.z);
    App.selectedShowRoom = null;
    // 回调
    webCallback.onSelectCancel();
  };

  renderDom.addEventListener('mousemove', onMouseMove, false);
  renderDom.addEventListener('click', onClick, false);
};

const getPixelRatio = (context) => {
  const backingStore = context.backingStorePixelRatio
    || context.webkitBackingStorePixelRatio
    || context.mozBackingStorePixelRatio
    || context.msBackingStorePixelRatio
    || context.oBackingStorePixelRatio
    || context.backingStorePixelRatio || 1;
  return (window.devicePixelRatio || 1) / backingStore;
};
