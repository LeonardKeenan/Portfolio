import Vector3 from './Vector3.js';

export default class Matrix3D {
  constructor() {
    this.identity();
  }

  identity() {
    this.n11 = 1; this.n12 = 0; this.n13 = 0; this.n14 = 0;
    this.n21 = 0; this.n22 = 1; this.n23 = 0; this.n24 = 0;
    this.n31 = 0; this.n32 = 0; this.n33 = 1; this.n34 = 0;
  }

  lookAt(eye, target, up) {
    const z = Vector3.sub(target, eye).normalize(); // forward
    const x = Vector3.cross(z, up).normalize();    // right
    const y = Vector3.cross(x, z).normalize();     // up (recomputed)

    this.n11 = x.x; this.n12 = x.y; this.n13 = x.z; this.n14 = -Vector3.dot(x, eye);
    this.n21 = y.x; this.n22 = y.y; this.n23 = y.z; this.n24 = -Vector3.dot(y, eye);
    this.n31 = z.x; this.n32 = z.y; this.n33 = z.z; this.n34 = -Vector3.dot(z, eye);
  }

  transform(vector) {
    const { x, y, z } = vector;
    return new Vector3(
      this.n11 * x + this.n12 * y + this.n13 * z + this.n14,
      this.n21 * x + this.n22 * y + this.n23 * z + this.n24,
      this.n31 * x + this.n32 * y + this.n33 * z + this.n34
    );
  }

  transformVector(vector) {
    const { x, y, z } = vector;
    return new Vector3(
      this.n11 * x + this.n12 * y + this.n13 * z,
      this.n21 * x + this.n22 * y + this.n23 * z,
      this.n31 * x + this.n32 * y + this.n33 * z
    );
  }
}
