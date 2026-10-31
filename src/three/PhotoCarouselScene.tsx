import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItemProps {
  url: string;
  index: number;
  total: number;
  radius: number;
  cardWidth: number;
  cardHeight: number;
  hasMovedRef: React.MutableRefObject<boolean>;
  onSelect: (index: number) => void;
}

function CarouselItem({
  url,
  index,
  total,
  radius,
  cardWidth,
  cardHeight,
  hasMovedRef,
  onSelect,
}: CarouselItemProps) {
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
      scale={hovered ? 1.07 : 1}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
      }}
    >
      <Image
        url={url}
        scale={[cardWidth, cardHeight]}
        radius={0.08}
        transparent
        toneMapped={false}
        onClick={(e) => {
          e.stopPropagation();
          // Only trigger select if user was not actively dragging
          if (!hasMovedRef.current) {
            onSelect(index);
          }
        }}
      />
    </group>
  );
}

function CarouselRig({
  photos,
  radius,
  cardWidth,
  cardHeight,
  rotationRef,
  velocityRef,
  isDraggingRef,
  hasMovedRef,
  onSelect,
}: {
  photos: string[];
  radius: number;
  cardWidth: number;
  cardHeight: number;
  rotationRef: React.MutableRefObject<number>;
  velocityRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  hasMovedRef: React.MutableRefObject<boolean>;
  onSelect: (index: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    if (!isDraggingRef.current) {
      // Gentle inertia decay towards slow ambient spin
      velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, 0.0015, 0.04);
      rotationRef.current += velocityRef.current;
    }

    groupRef.current.rotation.y = rotationRef.current;
  });

  return (
    <group ref={groupRef}>
      {photos.map((url, i) => (
        <CarouselItem
          key={i}
          url={url}
          index={i}
          total={photos.length}
          radius={radius}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          hasMovedRef={hasMovedRef}
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
  const count = Math.max(photos.length, 1);

  // Dynamic geometry for N photos:
  // Card size smoothly adapts with comfortable margins
  const cardWidth = Math.max(1.1, Math.min(1.6, 1.6 - (count > 6 ? (count - 6) * 0.025 : 0)));
  const cardHeight = cardWidth * 1.33;

  // Chord distance between adjacent items at radius R is: 2 * R * sin(PI / N)
  // We want chord = cardWidth * 1.35 for pleasant spacing
  const minChord = cardWidth * 1.35;
  const sinAngle = Math.sin(Math.PI / Math.max(count, 3));
  const calculatedRadius = minChord / (2 * sinAngle);
  const radius = Math.max(2.8, calculatedRadius);

  // Position camera with plenty of vertical breathing room so cards are NEVER cut off
  const cameraZ = radius + 3.4;

  // Shared state refs for smooth drag and inertia
  const rotationRef = useRef(0);
  const velocityRef = useRef(0.002);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX;
    const deltaX = currentX - lastXRef.current;
    lastXRef.current = currentX;

    if (Math.abs(currentX - startXRef.current) > 5) {
      hasMovedRef.current = true;
    }

    const sensitivity = 0.0055;
    rotationRef.current += deltaX * sensitivity;
    velocityRef.current = deltaX * sensitivity;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleSpinLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    velocityRef.current = 0.035;
  };

  const handleSpinRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    velocityRef.current = -0.035;
  };

  return (
    <div
      className="w-full h-[520px] sm:h-[620px] relative select-none cursor-grab active:cursor-grabbing touch-none py-2"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 42 }}
        dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1)]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[0, 5, 5]} intensity={1.5} color="#fff" />
        <pointLight position={[0, -2, 3]} intensity={1} color="#fda4af" />

        <CarouselRig
          photos={photos}
          radius={radius}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          rotationRef={rotationRef}
          velocityRef={velocityRef}
          isDraggingRef={isDraggingRef}
          hasMovedRef={hasMovedRef}
          onSelect={onSelectPhoto}
        />
      </Canvas>

      {/* Interactive Controls & Hints */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 select-none z-10">
        <button
          onClick={handleSpinLeft}
          className="p-2 rounded-full glass-panel hover:bg-rose-500/20 text-rose-200 transition-all border border-rose-500/20 active:scale-95 shadow-lg"
          aria-label="Spin carousel left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="pointer-events-none text-xs text-rose-200/90 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-500/25 shadow-lg flex items-center gap-1.5 whitespace-nowrap">
          <span>Drag to spin</span>
          <span className="text-rose-400 font-semibold">({photos.length} photos)</span>
          <span>&bull; Tap to view</span>
        </div>

        <button
          onClick={handleSpinRight}
          className="p-2 rounded-full glass-panel hover:bg-rose-500/20 text-rose-200 transition-all border border-rose-500/20 active:scale-95 shadow-lg"
          aria-label="Spin carousel right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
