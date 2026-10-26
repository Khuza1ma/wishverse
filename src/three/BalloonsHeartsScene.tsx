import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Heart Mesh
function HeartMesh({ position, scale = 1, color = '#e11d48', speed = 1 }: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.25, y + 0.25);
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 1.0);
    shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    meshRef.current.position.y = initialY + Math.sin(t + position[0]) * 0.25;
    meshRef.current.rotation.y = Math.sin(t * 0.8 + position[2]) * 0.35;
    meshRef.current.rotation.z = Math.cos(t * 0.5) * 0.1;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      geometry={heartGeometry}
      rotation={[Math.PI, 0, 0]}
    >
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.4}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

// 3D Balloon Mesh with subtle string
function BalloonMesh({ position, color, scale = 1, speed = 1 }: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    groupRef.current.position.y = initialY + Math.sin(t + position[0] * 2) * 0.35;
    groupRef.current.rotation.z = Math.sin(t * 0.7) * 0.08;
    groupRef.current.rotation.y = Math.cos(t * 0.4) * 0.15;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Balloon Body */}
      <mesh position={[0, 0, 0]} scale={[1, 1.25, 1]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          metalness={0.1}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>
      {/* Balloon Knot */}
      <mesh position={[0, -0.7, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.08, 0.12, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Interactive Camera Rig reacting to pointer/touch
function InteractiveRig() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    // Soft camera tilt following touch/mouse
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.8, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.5, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export const BalloonsHeartsScene: React.FC<{ primaryColor?: string }> = ({
  primaryColor = '#e11d48',
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1)]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 6, 5]} intensity={1.5} color="#fff1f2" />
        <pointLight position={[-4, -2, 2]} intensity={1.2} color={primaryColor} />
        <pointLight position={[3, 3, 2]} intensity={1.0} color="#fda4af" />

        <InteractiveRig />

        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
          {/* Hearts scattered tastefully */}
          <HeartMesh position={[-2.4, 1.2, -1]} scale={1.1} color={primaryColor} speed={1.2} />
          <HeartMesh position={[2.5, 1.4, -0.8]} scale={0.95} color="#f43f5e" speed={0.9} />
          <HeartMesh position={[-1.8, -1.5, 0.5]} scale={0.7} color="#fb7185" speed={1.4} />
          <HeartMesh position={[2.1, -1.3, 0.2]} scale={0.85} color="#fda4af" speed={1.1} />
          <HeartMesh position={[0.2, 2.2, -2]} scale={1.3} color="#be123c" speed={0.8} />

          {/* Glossy Balloons */}
          <BalloonMesh position={[-3.1, -0.2, -1.5]} color="#f43f5e" scale={1.1} speed={1.0} />
          <BalloonMesh position={[3.2, 0.2, -1.5]} color="#fb7185" scale={1.15} speed={0.95} />
          <BalloonMesh position={[-1.2, 2.1, -1.8]} color="#fda4af" scale={0.85} speed={1.2} />
          <BalloonMesh position={[1.4, 2.3, -1.9]} color="#be123c" scale={0.9} speed={1.1} />
        </Float>
      </Canvas>
    </div>
  );
};
