import Vector3 from './Vector3.js';

export default class Camera3D extends Vector3 {
  constructor() {
    super(0, 0, 0);
    this.target = new Vector3(0, 0, 0);
    this.up = new Vector3(0, 1, 0);
    this.zoom = 3;
    this.focus = 500;
    this.roll = 0;
  }
}