export default class Matrix3 {
    constructor(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
      this.n11 = n11; this.n12 = n12; this.n13 = n13;
      this.n21 = n21; this.n22 = n22; this.n23 = n23;
      this.n31 = n31; this.n32 = n32; this.n33 = n33;
    }
  
    static rotationX(angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return new Matrix3(
        1, 0, 0,
        0, c, -s,
        0, s, c
      );
    }
  
    static rotationY(angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return new Matrix3(
        c, 0, s,
        0, 1, 0,
       -s, 0, c
      );
    }
  
    multiply(other) {
      const a = this;
      const b = other;
      return new Matrix3(
        a.n11 * b.n11 + a.n12 * b.n21 + a.n13 * b.n31,
        a.n11 * b.n12 + a.n12 * b.n22 + a.n13 * b.n32,
        a.n11 * b.n13 + a.n12 * b.n23 + a.n13 * b.n33,
  
        a.n21 * b.n11 + a.n22 * b.n21 + a.n23 * b.n31,
        a.n21 * b.n12 + a.n22 * b.n22 + a.n23 * b.n32,
        a.n21 * b.n13 + a.n22 * b.n23 + a.n23 * b.n33,
  
        a.n31 * b.n11 + a.n32 * b.n21 + a.n33 * b.n31,
        a.n31 * b.n12 + a.n32 * b.n22 + a.n33 * b.n32,
        a.n31 * b.n13 + a.n32 * b.n23 + a.n33 * b.n33
      );
    }
  }
  