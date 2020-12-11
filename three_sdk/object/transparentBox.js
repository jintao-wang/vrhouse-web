import * as THREE from 'three';

export default class TransparentBox {
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
    this.transparentBox = null;
    this.initial();
  }

  initial() {
    const geometry = new THREE.BoxBufferGeometry(this.size, this.size, this.size);

    const boxMaterials = [
      new THREE.MeshPhongMaterial({
        color: this.color, transparent: true, opacity: this.opacity, side: THREE.DoubleSide,
      }),
      new THREE.MeshPhongMaterial({
        color: this.color, transparent: true, opacity: this.opacity, side: THREE.DoubleSide,
      }),
      new THREE.MeshPhongMaterial({
        color: this.color, transparent: true, opacity: this.opacity, side: THREE.DoubleSide,
      }),
      new THREE.MeshPhongMaterial({
        color: this.color, transparent: true, opacity: this.opacity, side: THREE.DoubleSide,
      }),
      new THREE.MeshPhongMaterial({
        color: this.color, transparent: true, opacity: this.opacity, side: THREE.DoubleSide,
      }),
      new THREE.MeshPhongMaterial({
        color: this.color, transparent: true, opacity: this.opacity, side: THREE.DoubleSide,
      }),
    ];

    // Create a MeshFaceMaterial, which allows the cube to have different materials on each face
    const cubeMaterial = new THREE.MeshFaceMaterial(boxMaterials);
    this.transparentBox = new THREE.Mesh(geometry, cubeMaterial);
    // this.transparentBox = new THREE.Mesh(geometry, meshBasicMaterial);
    this.transparentBox.position.set(...this.position);
    // this.transparentBox.cursor = 'pointer';
    // this.transparentBox.on('click', (ev) => {
    //   console.log(ev)
    // });
  }

  getObj() {
    return this.transparentBox;
  }

  changeColor(color, scene) {
    scene.remove(this.transparentBox);
    this.color = color;
    this.initial();
    scene.add(this.transparentBox);
  }

  changeColor2(color) {
    console.log(this.transparentBox);
    this.transparentBox.material[0].color.set(color);
    // this.transparentBox.material.color.set(color);
  }
}
