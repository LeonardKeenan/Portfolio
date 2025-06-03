import * as THREE from 'three';
import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const MAX_PARTICLES = 800;
const INITIAL_PARTICLES = 400;
const RADIUS = 400;
const HALF_RADIUS = RADIUS / 2;
const MIN_DISTANCE = 80;

export default function SkillsOrb() {
    const groupRef = useRef();
    const linesRef = useRef();
    const pointsRef = useRef();

    const particlesData = useRef([]);
    const positions = useRef(new Float32Array(MAX_PARTICLES * MAX_PARTICLES * 3));
    const colors = useRef(new Float32Array(MAX_PARTICLES * MAX_PARTICLES * 3));
    const particlePositions = useRef(new Float32Array(MAX_PARTICLES * 3));

    const particleGeometry = useMemo(() => {
        for (let i = 0; i < MAX_PARTICLES; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = Math.cbrt(Math.random()) * HALF_RADIUS; // uniform sphere

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            particlePositions.current[i * 3] = x;
            particlePositions.current[i * 3 + 1] = y;
            particlePositions.current[i * 3 + 2] = z;

            const SPEED = 0.5; // 👈 adjust this value to control speed

            particlesData.current.push({
                velocity: new THREE.Vector3(
                    (Math.random() * 2 - 1) * SPEED,
                    (Math.random() * 2 - 1) * SPEED,
                    (Math.random() * 2 - 1) * SPEED
                ),
                numConnections: 0
            });

        }


        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(particlePositions.current, 3).setUsage(THREE.DynamicDrawUsage));
        geom.setDrawRange(0, INITIAL_PARTICLES);

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
        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;

        for (let i = 0; i < INITIAL_PARTICLES; i++) {
            particlesData.current[i].numConnections = 0;

            const ix = i * 3;
            particlePositions.current[ix] += particlesData.current[i].velocity.x;
            particlePositions.current[ix + 1] += particlesData.current[i].velocity.y;
            particlePositions.current[ix + 2] += particlesData.current[i].velocity.z;

            // bounce logic
            const x = particlePositions.current[ix];
            const y = particlePositions.current[ix + 1];
            const z = particlePositions.current[ix + 2];
            const len = Math.sqrt(x * x + y * y + z * z);

            if (len > HALF_RADIUS) {
                const normal = new THREE.Vector3(x, y, z).normalize();
                const velocity = particlesData.current[i].velocity;
                const dot = velocity.dot(normal);
                velocity.sub(normal.multiplyScalar(2 * dot)); // reflect velocity
            }


            for (let j = i + 1; j < INITIAL_PARTICLES; j++) {
                const dx = particlePositions.current[ix] - particlePositions.current[j * 3];
                const dy = particlePositions.current[ix + 1] - particlePositions.current[j * 3 + 1];
                const dz = particlePositions.current[ix + 2] - particlePositions.current[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < MIN_DISTANCE) {
                    const alpha = 1.0 - dist / MIN_DISTANCE;

                    positions.current[vertexpos++] = particlePositions.current[ix];
                    positions.current[vertexpos++] = particlePositions.current[ix + 1];
                    positions.current[vertexpos++] = particlePositions.current[ix + 2];

                    positions.current[vertexpos++] = particlePositions.current[j * 3];
                    positions.current[vertexpos++] = particlePositions.current[j * 3 + 1];
                    positions.current[vertexpos++] = particlePositions.current[j * 3 + 2];

                    for (let k = 0; k < 6; k++) colors.current[colorpos++] = alpha;

                    numConnected++;
                }
            }
        }

        linesRef.current.geometry.setDrawRange(0, numConnected * 2);
        linesRef.current.geometry.attributes.position.needsUpdate = true;
        linesRef.current.geometry.attributes.color.needsUpdate = true;
        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        groupRef.current.rotation.y += 0.001;
    });

    return (
        <group ref={groupRef}>
            <points ref={pointsRef} geometry={particleGeometry}>
                <pointsMaterial color={'hotpink'} size={5} transparent blending={THREE.AdditiveBlending} sizeAttenuation={false} />
            </points>
            <lineSegments ref={linesRef} geometry={lineGeometry}>
                <lineBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} />
            </lineSegments>
        </group>
    );
}
