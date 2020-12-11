import * as THREE from 'three';

export default class PlaneBox {
  constructor({
    size,
    color,
    opacity,
    position,
  }) {
    this.size = size;
    this.color = color;
    this.opacity = opacity;
    this.position = position;
    this.planeBox = {};
    this.isOpen = false;
    this.initial();
  }

  initial() {
    // 中心plane
    // const planGeometry = new THREE.PlaneBufferGeometry(this.size, this.size, 1);
    // const planMaterial = new THREE.MeshBasicMaterial({
    //   color: this.color,
    //   transparent: true,
    //   opacity: this.opacity,
    //   side: THREE.DoubleSide,
    // });
    // this.plane = new THREE.Mesh(planGeometry, planMaterial);
    // this.plane.position.set(...this.position);
    // this.planeBox.push(this.plane);

    const planGeometry0 = new THREE.PlaneBufferGeometry(this.size, this.size, 1);
    const planMaterial0 = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: this.opacity,
      side: THREE.DoubleSide,
    });
    this.plane0 = new THREE.Mesh(planGeometry0, planMaterial0);
    this.plane0.position.set(0, this.size / 2, 0);
    this.plane0.rotation.y = Math.PI / 2;
    this.plane0Container = new THREE.Object3D();
    this.plane0Container.add(this.plane0);
    this.plane0Container.position.set(this.position[0] + this.size / 2, this.position[1] - this.size / 2, this.position[2]);
    this.planeBox[0] = this.plane0Container;



    const planGeometry1 = new THREE.PlaneBufferGeometry(this.size, this.size, 1);
    const planMaterial1 = new THREE.MeshLambertMaterial({
      color: this.color,
      transparent: true,
      opacity: this.opacity,
      side: THREE.DoubleSide,
    });
    this.plane1 = new THREE.Mesh(planGeometry1, planMaterial1);
    this.plane1.position.set(0, this.size / 2, 0);
    this.plane1.rotation.y = Math.PI / 2;
    this.plane1Container = new THREE.Object3D();
    this.plane1Container.add(this.plane1);
    this.plane1Container.position.set(this.position[0] - this.size / 2, this.position[1] - this.size / 2, this.position[2]);
    this.planeBox[1] = this.plane1Container;

    // const planGeometry2 = new THREE.PlaneBufferGeometry(this.size, this.size, 1);
    // const planMaterial2 = new THREE.MeshLambertMaterial({
    //   color: this.color,
    //   transparent: true,
    //   opacity: this.opacity,
    //   side: THREE.DoubleSide,
    // });
    // this.plane2 = new THREE.Mesh(planGeometry2, planMaterial2);
    // this.plane2.position.set(this.position[0], this.position[1] + this.size / 2, this.position[2]);
    // this.plane2.rotation.x = Math.PI / 2;
    // this.planeBox[2] = this.plane2;

    const planGeometry3 = new THREE.PlaneBufferGeometry(this.size, this.size, 1);
    const planMaterial3 = new THREE.MeshLambertMaterial({
      color: this.color,
      transparent: true,
      opacity: this.opacity,
      side: THREE.DoubleSide,
    });
    this.plane3 = new THREE.Mesh(planGeometry3, planMaterial3);
    this.plane3.position.set(this.position[0], this.position[1] - this.size / 2, this.position[2]);
    this.plane3.rotation.x = Math.PI / 2;
    this.planeBox[3] = this.plane3;

    const planGeometry4 = new THREE.PlaneBufferGeometry(this.size, this.size, 1);
    const planMaterial4 = new THREE.MeshLambertMaterial({
      color: this.color,
      transparent: true,
      opacity: this.opacity,
      side: THREE.DoubleSide,
    });
    this.plane4 = new THREE.Mesh(planGeometry4, planMaterial4);
    this.plane4.position.set(0, this.size / 2, 0);
    this.plane4Container = new THREE.Object3D();
    this.plane4Container.add(this.plane4);
    this.plane4Container.position.set(this.position[0], this.position[1] - this.size / 2, this.position[2] + this.size / 2);
    this.planeBox[4] = this.plane4Container;

    const planGeometry5 = new THREE.PlaneBufferGeometry(this.size, this.size, 1);
    const planMaterial5 = new THREE.MeshLambertMaterial({
      color: this.color,
      transparent: true,
      opacity: this.opacity,
      side: THREE.DoubleSide,
    });
    this.plane5 = new THREE.Mesh(planGeometry5, planMaterial5);
    this.plane5.position.set(0, this.size / 2, 0);
    this.plane5Container = new THREE.Object3D();
    this.plane5Container.add(this.plane5);
    this.plane5Container.position.set(this.position[0], this.position[1] - this.size / 2, this.position[2] - this.size / 2);
    this.planeBox[5] = this.plane5Container;

    // const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    // const points = [];
    // points.push( new THREE.Vector3(this.position[0] + this.size / 2, this.position[1] - this.size / 2, this.position[2] + this.size / 2));
    // points.push( new THREE.Vector3(this.position[0] + this.size / 2, this.position[1] - this.size / 2, this.position[2] - this.size / 2));
    // const geometry = new THREE.BufferGeometry().setFromPoints( points );
    // const line = new THREE.Line( geometry, material );
    // this.planeBox[6] = line;
  }

  addTo(scene) {
    Object.values(this.planeBox).forEach((item) => {
      scene.add(item);
    });
  }

  open() {
    this.animate({
      duration: 1000,
      timing: (timeFraction) => timeFraction,
      draw: (progress) => {
        // eslint-disable-next-line max-len
        this.plane0Container.rotation.z = - Math.PI / 2 * progress;
      },
    });

    this.animate({
      duration: 1000,
      timing: (timeFraction) => timeFraction,
      draw: (progress) => {
        // eslint-disable-next-line max-len
        this.plane1Container.rotation.z = Math.PI / 2 * progress;
      },
    });

    this.animate({
      duration: 1000,
      timing: (timeFraction) => timeFraction,
      draw: (progress) => {
        // eslint-disable-next-line max-len
        this.plane4Container.rotation.x = Math.PI / 2 * progress;
      },
    });

    this.animate({
      duration: 1000,
      timing: (timeFraction) => timeFraction,
      draw: (progress) => {
        // eslint-disable-next-line max-len
        this.plane5Container.rotation.x = -Math.PI / 2 * progress;
      },
    });

    this.isOpen = true;
  }

  close() {
    // this.plane0.rotation.x = 0;
    // this.plane0.position.set(this.position[0] + this.size / 2, this.position[1], this.position[2]);
    // this.plane0.rotation.y = Math.PI / 2;
    this.animate({
      duration: 1000,
      timing: (timeFraction) => timeFraction,
      draw: (progress) => {
        // eslint-disable-next-line max-len
        this.plane0Container.rotation.z = - Math.PI / 2 + Math.PI / 2 * progress;
      },
    });

    this.animate({
      duration: 1000,
      timing: (timeFraction) => timeFraction,
      draw: (progress) => {
        // eslint-disable-next-line max-len
        this.plane1Container.rotation.z = Math.PI / 2  - Math.PI / 2 * progress;
      },
    });

    this.animate({
      duration: 1000,
      timing: (timeFraction) => timeFraction,
      draw: (progress) => {
        // eslint-disable-next-line max-len
        this.plane4Container.rotation.x = Math.PI / 2  - Math.PI / 2 * progress;
      },
    });

    this.animate({
      duration: 1000,
      timing: (timeFraction) => timeFraction,
      draw: (progress) => {
        // eslint-disable-next-line max-len
        this.plane5Container.rotation.x =  - Math.PI / 2 + Math.PI / 2 * progress;
      },
    });

    this.isOpen = false;
  }

  getOpenState() {
    return this.isOpen;
  }

  animate({ timing, draw, duration }) {
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
      }
    });
  };
}
