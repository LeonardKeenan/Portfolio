// Vector3.js — 3D Vector used by TagSphere
export default class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  
    clone() {
      return new Vector3(this.x, this.y, this.z);
    }
  
    normalize() {
      const len = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
      if (len > 0) {
        this.x /= len;
        this.y /= len;
        this.z /= len;
      }
      return this;
    }
  
    multiplyScalar(s) {
      this.x *= s;
      this.y *= s;
      this.z *= s;
      return this;
    }
  
    applyMatrix(m) {
      const x = this.x, y = this.y, z = this.z;
      this.x = m.n11 * x + m.n12 * y + m.n13 * z;
      this.y = m.n21 * x + m.n22 * y + m.n23 * z;
      this.z = m.n31 * x + m.n32 * y + m.n33 * z;
      return this;
    }
  } 
  