import { useEffect, useRef } from 'react';
import './TagSphereVanilla.css';

import Vector3 from '../engine/Vector3.js';
import Div3D from '../engine/Div3D.js';
import SphereEngine from '../engine/SphereEngine.js';

const TAGS = [
  "Python", "JavaScript", "Java", "SQL", "C++", "Tailwind", "React",
  "Node.js", "MySQL", "PostgreSQL", "Tableau", "Docker", "Kubernetes", "AWS",
  "Salesforce", "AI", "LangChain", "GitHub", "Bash", "NIST CSF", "ISO 27001", "PCI DSS", "Risk Assessment", "Compliance", "Access Control",
  "Incident Response", "SOPs", "Cyber Strategy", "System Design", "Project Planning",
  "Technical Writing", "Data Analytics", "Visualizations", "Stored Procedures", "Cloud Deployment",
  "API Integration", "Full-Stack Dev", "Automation", "Agile",
  "BPMN", "SDLC"
];

export default function TagSphereVanilla() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const radius = 180;
    const elements = [];

    // Place each tag on the sphere and wrap in Div3D
    TAGS.forEach((text, i) => {
      const div3d = new Div3D();
      div3d.content.className = 'tag';
      div3d.content.innerText = text;
      container.appendChild(div3d.content);

      // Distribute using golden spiral (Fibonacci sphere)
      const total = TAGS.length;
      const offset = 2 / total;
      const increment = Math.PI * (3 - Math.sqrt(5));
      const y = ((i * offset) - 1) + (offset / 2);
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;

      div3d.x = Math.cos(phi) * r * radius;
      div3d.y = y * radius;
      div3d.z = Math.sin(phi) * r * radius;

      elements.push(div3d);
    });

    const engine = new SphereEngine(elements, container);
    engine.start();

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="sphere-container" />;
}
