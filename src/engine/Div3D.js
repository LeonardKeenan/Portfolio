import Vector3 from './Vector3.js';

export default class Div3D extends Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    super(x, y, z);
    this.content = document.createElement('div');
    this.content.style.position = 'absolute';
    this.sx = 0; // screen x
    this.sy = 0; // screen y
    this.sz = 0; // screen z (depth)
  }

  setVisible() {
    this.content.style.visibility = 'visible';
  }

  setHidden() {
    this.content.style.visibility = 'hidden';
  }

  setPosition2D(x, y, scale) {
    this.content.style.left = `${x}px`;
    this.content.style.top = `${y}px`;
    this.content.style.transform = `scale(${scale}) translate(-50%, -50%)`;
  }

  setZIndex(z) {
    this.content.style.zIndex = 1000 + ((-z * 100) >> 0);
  }
}
