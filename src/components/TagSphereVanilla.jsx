import { useEffect, useRef } from 'react';
import './TagSphereVanilla.css';

const TAGS = [
  "React", "Three.js", "Node.js", "WebGL",
  "MongoDB", "Vite", "AI", "Python",
  "Next.js", "Firebase"
];

export default function TagSphereVanilla() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const radius = 120;
    const fov = 300;
    const tags = [];

    // Create DOM elements
    TAGS.forEach((text, i) => {
      const el = document.createElement('span');
      el.className = 'tag';
      el.innerText = text;
      container.appendChild(el);
      tags.push({ el });
    });

    const total = tags.length;
    const positions = [];
    // Fibonacci Sphere Distribution
    const offset = 2 / total;
    const increment = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < total; i++) {
      const y = ((i * offset) - 1) + (offset / 2);
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment + Math.random() * 0.3; // Add jitter

      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;

      // Convert to spherical for consistent use
      const theta = Math.atan2(z, x);
      const pseudoPhi = Math.acos(y);

      positions.push({ phi: pseudoPhi, theta });
    }

    let mouseX = 0, mouseY = 0;
    const handleMouseMove = e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const sinX = Math.sin(mouseX);
      const cosX = Math.cos(mouseX);
      const sinY = Math.sin(mouseY);
      const cosY = Math.cos(mouseY);

      tags.forEach((tag, i) => {
        let x = radius * Math.cos(positions[i].theta) * Math.sin(positions[i].phi);
        let y = radius * Math.sin(positions[i].theta) * Math.sin(positions[i].phi);
        let z = radius * Math.cos(positions[i].phi);

        let y1 = y * cosY - z * sinY;
        let z1 = y * sinY + z * cosY;

        let x2 = x * cosX - z1 * sinX;
        let z2 = x * sinX + z1 * cosX;

        const scale = fov / (fov + z2);
        const left = x2 * scale + container.offsetWidth / 2;
        const top = y1 * scale + container.offsetHeight / 2;

        tag.el.style.left = `${left}px`;
        tag.el.style.top = `${top}px`;
        tag.el.style.transform = `translate(-50%, -50%) scale(${scale})`;
        tag.el.style.zIndex = Math.floor(z2);
        tag.el.style.opacity = scale;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="sphere-container" />;
}
