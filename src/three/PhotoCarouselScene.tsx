import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';

interface CarouselItemProps {
  url: string;
  index: number;
  total: number;
  radius: number;
  onSelect: (index: number) => void;
}

function CarouselItem({ url, index, total, radius, onSelect }: CarouselItemProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const angle = (index / total) * Math.PI * 2;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  return (
    <group
      ref={meshRef}
      position={[x, 0, z]}
      rotation={[0, angle, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
      }}
      scale={hovered ? 1.08 : 1}
    >
      {/* 3D Photo Card */}
      <Image
        url={url}
        scale={[1.8, 2.4]}
        radius={0.08}
        transparent
        toneMapped={false}
      />
    </group>
  );
}

function CarouselRig({
  photos,
  onSelect,
}: {
  photos: string[];
  onSelect: (index: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const previousPointerX = useRef(0);
  const angularVelocity = useRef(0.003); // gentle auto-rotation

  useFrame(() => {
    if (!groupRef.current) return;

    if (!isDragging.current) {
      // Smooth decay of velocity towards gentle idling
      angularVelocity.current = THREE.MathUtils.lerp(angularVelocity.current, 0.002, 0.04);
      groupRef.current.rotation.y += angularVelocity.current;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        isDragging.current = true;
        previousPointerX.current = e.clientX;
      }}
      onPointerUp={() => {
        isDragging.current = false;
      }}
      onPointerLeave={() => {
        isDragging.current = false;
      }}
      onPointerMove={(e) => {
        if (!isDragging.current || !groupRef.current) return;
        const deltaX = e.clientX - previousPointerX.current;
        previousPointerX.current = e.clientX;
        const dragSpeed = 0.005;
        groupRef.current.rotation.y += deltaX * dragSpeed;
        angularVelocity.current = deltaX * dragSpeed * 0.8;
      }}
    >
      {photos.map((url, i) => (
        <CarouselItem
          key={i}
          url={url}
          index={i}
          total={photos.length}
          radius={2.9}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

export const PhotoCarouselScene: React.FC<{
  photos: string[];
  onSelectPhoto: (index: number) => void;
}> = ({ photos, onSelectPhoto }) => {
  return (
    <div className="w-full h-[450px] sm:h-[550px] relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 48 }}
        dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1)]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[0, 4, 4]} intensity={1.5} color="#fff" />
        <pointLight position={[0, -2, 2]} intensity={1} color="#fda4af" />

        <CarouselRig photos={photos} onSelect={onSelectPhoto} />
      </Canvas>

      {/* Helpful Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none select-none text-xs text-rose-300/80 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-rose-500/20">
        Drag to spin &bull; Tap photo to view
      </div>
    </div>
  );
};
