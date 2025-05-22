import Matrix3D from './Matrix3D.js';
import Camera3D from './Camera3D.js';

export default class SphereEngine {
    constructor(elements, container, focus = 500) {
        this.elements = elements; // array of Div3D
        this.container = container;
        this.view = new Matrix3D();
        this.camera = new Camera3D();
        this.camera2 = new Camera3D();
        this.camera2.z = 800;
        this.focus = focus;
        this.focusZoom = focus * this.camera.zoom;

        this.windowHalfX = window.innerWidth >> 1;
        this.windowHalfY = window.innerHeight >> 1;

        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseXDest = 0;
        this.mouseYDest = 0;

        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
    }

    onMouseMove(e) {
        this.mouseX = (e.clientX - this.windowHalfX) * 0.1;
        this.mouseY = (e.clientY - this.windowHalfY) * 0.1;
    }

    onResize() {
        this.windowHalfX = window.innerWidth >> 1;
        this.windowHalfY = window.innerHeight >> 1;
    }

    start() {
        const loop = () => {
            this.update();
            requestAnimationFrame(loop);
        };
        loop();
    }

    update() {
        // Smooth mouse target
        this.mouseXDest += this.mouseX * 0.0015;
        this.mouseYDest += (this.mouseY - this.mouseYDest) * 0.1;

        // Move camera
        this.camera.x = Math.sin(this.mouseXDest) * this.camera2.z;
        this.camera.y = -this.mouseYDest * 10;
        this.camera.z = Math.cos(this.mouseXDest) * this.camera2.z;

        // Update view matrix
        this.view.lookAt(this.camera, this.camera.target, this.camera.up);

        // Project and render all elements
        for (let el of this.elements) {
            el.sz = el.x * this.view.n31 + el.y * this.view.n32 + el.z * this.view.n33 + this.view.n34;

            if (this.focus + el.sz < 0) {
                el.setHidden();
                continue;
            } else {
                el.setVisible();
            }

            const scale = this.focusZoom / (this.focus + el.sz);
            const sx = (el.x * this.view.n11 + el.y * this.view.n12 + el.z * this.view.n13 + this.view.n14) * scale;
            const sy = (el.x * this.view.n21 + el.y * this.view.n22 + el.z * this.view.n23 + this.view.n24) * -scale;

            const bounds = this.container.getBoundingClientRect();
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;

            el.setPosition2D(sx + centerX, sy + centerY, scale);

            el.setZIndex(el.sz);
        }
    }
}
