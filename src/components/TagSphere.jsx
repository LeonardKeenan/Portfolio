import { Text } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useEffect } from 'react';

export default function TagSphere3D({ radius = 250 }) {
  const groupRef = useRef();
  const textRefs = useRef([]);
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const tags = useMemo(() => [
    'React', 'Node.js', 'SQL', 'Docker', 'Cyber Strategy', 'Automation', 'Python',
    'Cloud Deployment', 'Access Control', 'PCI DSS', 'Tableau', 'AWS', 'C++',
    'PostgreSQL', 'SOPs', 'Compliance', 'Kubernetes', 'JavaScript', 'API Integration'
  ], []);

  const positions = useMemo(() => {
    const points = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < tags.length; i++) {
      const y = 1 - (i / (tags.length - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      points.push([x * radius, y * radius, z * radius]);
    }
    return points;
  }, [tags, radius]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
  
      mouse.current.x = (e.clientX - centerX) / rect.width;  // distance from center in -0.5 to 0.5
      mouse.current.y = (e.clientY - centerY) / rect.height;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gl]);
  

  useFrame(() => {
    if (groupRef.current) {
      // Calculate spin and wobble
      const targetY = -mouse.current.x * 0.02; // inverted horizontal spin
      const targetX = -mouse.current.y * 0.005; // inverted vertical wobble
  
      // Apply spin (accumulative)
      groupRef.current.rotation.y += targetY;
  
      // Apply restricted X-axis wobble (not accumulative)
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.1;
    }
  
    // Make tags face the camera
    textRefs.current.forEach((text) => {
      if (text) text.lookAt(camera.position);
    });
  });
  

  return (
    <group ref={groupRef}>
      {tags.map((tag, i) => (
        <Text
          key={i}
          ref={(el) => (textRefs.current[i] = el)}
          position={positions[i]}
          fontSize={16}
          color="white"
          anchorX="center"
          anchorY="middle"
          onClick={() =>
            window.open(`https://www.google.com/search?q=${encodeURIComponent(tag)}`)
          }
          onPointerOver={(e) => e.object.material.color.set('#f0f')}
          onPointerOut={(e) => e.object.material.color.set('white')}
        >
          {tag}
        </Text>
      ))}
    </group>
  );
}
