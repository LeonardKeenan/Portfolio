import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useEffect, useMemo } from 'react';

export default function MergedOrbAndTags({ radius = 265 }) {
    const groupRef = useRef();
    const { camera, gl } = useThree();
    const textRefs = useRef([]);
    const mouse = useRef({ x: 0, y: 0 });

    // Track mouse relative to canvas center
    useEffect(() => {
        const handleMouseMove = (e) => {
            const rect = gl.domElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            mouse.current.x = (e.clientX - centerX) / rect.width;
            mouse.current.y = (e.clientY - centerY) / rect.height;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [gl]);

    // Tag positions on sphere
    const tags = useMemo(() => [
        'React', 'Node.js', 'SQL', 'Docker', 'Cyber Strategy', 'Automation', 'Python',
        'Cloud Deployment', 'Access Control', 'PCI DSS', 'Tableau', 'AWS', 'C++',
        'PostgreSQL', 'SOPs', 'Compliance', 'Kubernetes', 'JavaScript', 'API Integration'
    ], []);

    const tagPositions = useMemo(() => {
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

    // Orb particle setup
    const MAX_PARTICLES = 500;
    const RADIUS = 500;
    const HALF_RADIUS = RADIUS / 2;
    const MIN_DISTANCE = 50;

    const particlesData = useRef([]);
    const positions = useRef(new Float32Array(MAX_PARTICLES * MAX_PARTICLES * 3));
    const colors = useRef(new Float32Array(MAX_PARTICLES * MAX_PARTICLES * 3));
    const particlePositions = useRef(new Float32Array(MAX_PARTICLES * 3));

    useMemo(() => {
        for (let i = 0; i < MAX_PARTICLES; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            // const radius = Math.cbrt(Math.random()) * HALF_RADIUS;
            const radius = HALF_RADIUS; // ✅ surface only


            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            particlePositions.current[i * 3] = x;
            particlePositions.current[i * 3 + 1] = y;
            particlePositions.current[i * 3 + 2] = z;

            const SPEED = 0.2; // 🔧 Adjust to control particle speed

            particlesData.current.push({
                velocity: new THREE.Vector3(
                    (Math.random() * 2 - 1) * SPEED,
                    (Math.random() * 2 - 1) * SPEED,
                    (Math.random() * 2 - 1) * SPEED
                ),
                numConnections: 0,
            });

        }
    }, []);

    const particleGeometry = useMemo(() => {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(particlePositions.current, 3).setUsage(THREE.DynamicDrawUsage));
        geom.setDrawRange(0, MAX_PARTICLES);
        return geom;
    }, []);

    const lineGeometry = useMemo(() => {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(positions.current, 3).setUsage(THREE.DynamicDrawUsage));
        geom.setAttribute('color', new THREE.BufferAttribute(colors.current, 3).setUsage(THREE.DynamicDrawUsage));
        geom.setDrawRange(0, 0);
        return geom;
    }, []);

    useFrame(() => {
        // Controlled rotation on Y (spin) and subtle pitch on X (wobble)
        const targetY = -mouse.current.x * 0.02;
        const targetX = -mouse.current.y * 0.005;
        groupRef.current.rotation.y += targetY;
        groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.1;

        // Update orb particles
        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;

        for (let i = 0; i < MAX_PARTICLES; i++) {
            particlesData.current[i].numConnections = 0;
            const ix = i * 3;

            particlePositions.current[ix] += particlesData.current[i].velocity.x;
            particlePositions.current[ix + 1] += particlesData.current[i].velocity.y;
            particlePositions.current[ix + 2] += particlesData.current[i].velocity.z;

            const x = particlePositions.current[ix];
            const y = particlePositions.current[ix + 1];
            const z = particlePositions.current[ix + 2];
            const len = Math.sqrt(x * x + y * y + z * z);
            if (len > HALF_RADIUS) {
                const normal = new THREE.Vector3(x, y, z).normalize();
                const velocity = particlesData.current[i].velocity;
                const dot = velocity.dot(normal);
                velocity.sub(normal.multiplyScalar(2 * dot));
            }

            for (let j = i + 1; j < MAX_PARTICLES; j++) {
                const dx = x - particlePositions.current[j * 3];
                const dy = y - particlePositions.current[j * 3 + 1];
                const dz = z - particlePositions.current[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < MIN_DISTANCE) {
                    const alpha = 1.0 - dist / MIN_DISTANCE;

                    positions.current[vertexpos++] = x;
                    positions.current[vertexpos++] = y;
                    positions.current[vertexpos++] = z;

                    positions.current[vertexpos++] = particlePositions.current[j * 3];
                    positions.current[vertexpos++] = particlePositions.current[j * 3 + 1];
                    positions.current[vertexpos++] = particlePositions.current[j * 3 + 2];

                    for (let k = 0; k < 6; k++) colors.current[colorpos++] = alpha;
                    numConnected++;
                }
            }
        }

        lineGeometry.setDrawRange(0, numConnected * 2);
        lineGeometry.attributes.position.needsUpdate = true;
        lineGeometry.attributes.color.needsUpdate = true;
        particleGeometry.attributes.position.needsUpdate = true;

        // Keep text facing camera
        textRefs.current.forEach((text) => {
            if (text) text.lookAt(camera.position);
        });
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* Tag Sphere */}
            {tags.map((tag, i) => (
                <Text
                    key={i}
                    ref={(el) => (textRefs.current[i] = el)}
                    position={tagPositions[i]}
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

            {/* Particle Orb */}
            <points geometry={particleGeometry}>
                <pointsMaterial
                    color={'#2684FF'}
                    size={8}
                    transparent
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation={true}
                />
            </points>
            <lineSegments geometry={lineGeometry}>
                <lineBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} />
            </lineSegments>
        </group>
    );
}
