import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface CakeSceneProps {
  isBlown: boolean;
  onBlowOut: () => void;
  primaryColor?: string;
}

// Flickering Candle with Flame and Wick
function Candle({
  position,
  isBlown,
}: {
  position: [number, number, number];
  isBlown: boolean;
}) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (isBlown) return;
    const t = state.clock.getElapsedTime();
    if (flameRef.current) {
      // Gentle flicker
      const s = 1 + Math.sin(t * 18 + position[0] * 5) * 0.12;
      flameRef.current.scale.set(s, s * 1.2, s);
      flameRef.current.rotation.z = Math.sin(t * 12) * 0.08;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + Math.sin(t * 20) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Candle Body */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 16]} />
        <meshStandardMaterial color="#fff1f2" roughness={0.3} />
      </mesh>
      
      {/* Wick */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.05, 8]} />
        <meshBasicMaterial color="#475569" />
      </mesh>

      {/* Flame (Only visible when not blown) */}
      {!isBlown && (
        <group position={[0, 0.52, 0]}>
          <mesh ref={flameRef}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <pointLight
            ref={lightRef}
            distance={1.5}
            intensity={1.0}
            color="#fbbf24"
          />
        </group>
      )}

      {/* Smoke particle when blown out */}
      {isBlown && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

// 3D Cake Assembly
function CakeGroup({
  isBlown,
  onBlowOut,
  primaryColor,
}: {
  isBlown: boolean;
  onBlowOut: () => void;
  primaryColor: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Gentle idle spin
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.15, 0]}
      scale={0.8}
      onClick={(e) => {
        e.stopPropagation();
        if (!isBlown) onBlowOut();
      }}
      onPointerOver={() => {
        if (!isBlown && typeof document !== 'undefined') {
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'auto';
        }
      }}
    >
      {/* Golden Cake Stand */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[1.5, 1.4, 0.1, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.3, 0.6, 0.45, 32]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Bottom Tier */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.6, 32]} />
        <meshStandardMaterial color="#fff1f2" roughness={0.4} />
      </mesh>
      {/* Bottom Tier Frosting Ribbon */}
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[1.21, 0.05, 16, 32]} />
        <meshStandardMaterial color={primaryColor} roughness={0.3} />
      </mesh>

      {/* Top Tier */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.55, 32]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.4} />
      </mesh>
      {/* Top Tier Frosting Drip Ring */}
      <mesh position={[0, 0.52, 0]}>
        <torusGeometry args={[0.81, 0.05, 16, 32]} />
        <meshStandardMaterial color={primaryColor} roughness={0.3} />
      </mesh>

      {/* Decorative berries / icing drops */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.65, 0.55, Math.sin(a) * 0.65]}
          >
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color={primaryColor} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Candles */}
      <Candle position={[0, 0.53, 0]} isBlown={isBlown} />
      <Candle position={[0.3, 0.53, 0.15]} isBlown={isBlown} />
      <Candle position={[-0.3, 0.53, 0.15]} isBlown={isBlown} />
      <Candle position={[0, 0.53, -0.3]} isBlown={isBlown} />
    </group>
  );
}

export const CakeScene: React.FC<CakeSceneProps> = ({
  isBlown,
  onBlowOut,
  primaryColor = '#e11d48',
}) => {
  return (
    <div className="w-full h-[430px] sm:h-[510px] relative select-none py-2">
      <Canvas
        camera={{ position: [0, 1.25, 4.4], fov: 38 }}
        dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1)]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} color="#fff" />
        <pointLight position={[-3, -1, -2]} intensity={0.6} color="#fda4af" />

        <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.12}>
          <CakeGroup
            isBlown={isBlown}
            onBlowOut={onBlowOut}
            primaryColor={primaryColor}
          />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.05}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>

      {!isBlown && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-xs text-rose-300/90 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-500/25 shadow-lg">
          Tap cake to blow out candles
        </div>
      )}
    </div>
  );
};
