import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
  const tapStartRef = useRef({ x: 0, y: 0, time: 0 });

  const angle = (index / total) * Math.PI * 2;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  return (
    <group
      ref={meshRef}
      position={[x, 0, z]}
      rotation={[0, angle, 0]}
      scale={hovered ? 1.07 : 1}
      userData={{ photoIndex: index }}
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
      {/* 3D Image Card */}
      <Image
        url={url}
        scale={[cardWidth, cardHeight]}
        radius={0.08}
        transparent
        toneMapped={false}
        userData={{ photoIndex: index }}
      />

      {/* Invisible Interactive Hit-Test Plane for 100% Reliable Click/Tap */}
      <mesh
        position={[0, 0, 0.02]}
        userData={{ photoIndex: index }}
        onPointerDown={(e) => {
          e.stopPropagation();
          tapStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          const dx = Math.abs(e.clientX - tapStartRef.current.x);
          const dy = Math.abs(e.clientY - tapStartRef.current.y);
          const dt = Date.now() - tapStartRef.current.time;
          // Tap threshold: moved less than 18px and released under 450ms
          if (dx < 18 && dy < 18 && dt < 450) {
            onSelect(index);
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!hasMovedRef.current) {
            onSelect(index);
          }
        }}
      >
        <planeGeometry args={[cardWidth, cardHeight]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
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
  const { camera, raycaster, gl } = useThree();
  const lastSelectTimeRef = useRef(0);

  // Deduplicated selection callback
  const safeSelect = useCallback(
    (index: number) => {
      const now = Date.now();
      if (now - lastSelectTimeRef.current > 350) {
        lastSelectTimeRef.current = now;
        onSelect(index);
      }
    },
    [onSelect]
  );

  // Direct Three.js Canvas Raycaster fallback: Guaranteed tap detection on mobile and desktop
  useEffect(() => {
    const dom = gl.domElement;
    let downPos = { x: 0, y: 0, time: 0 };

    const handleCanvasPointerDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY, time: Date.now() };
    };

    const handleCanvasPointerUp = (e: PointerEvent) => {
      const dx = Math.abs(e.clientX - downPos.x);
      const dy = Math.abs(e.clientY - downPos.y);
      const dt = Date.now() - downPos.time;

      // Only trigger if pointer moved less than 16px (not dragging) and under 450ms
      if (dx < 16 && dy < 16 && dt < 450 && groupRef.current) {
        const rect = dom.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(groupRef.current.children, true);

        for (const hit of intersects) {
          let cur: THREE.Object3D | null = hit.object;
          while (cur && cur !== groupRef.current) {
            if (typeof cur.userData?.photoIndex === 'number') {
              safeSelect(cur.userData.photoIndex);
              return;
            }
            cur = cur.parent;
          }
        }
      }
    };

    dom.addEventListener('pointerdown', handleCanvasPointerDown);
    dom.addEventListener('pointerup', handleCanvasPointerUp);

    return () => {
      dom.removeEventListener('pointerdown', handleCanvasPointerDown);
      dom.removeEventListener('pointerup', handleCanvasPointerUp);
    };
  }, [camera, raycaster, gl, safeSelect]);

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
          onSelect={safeSelect}
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
  const cardWidth = Math.max(1.1, Math.min(1.6, 1.6 - (count > 6 ? (count - 6) * 0.025 : 0)));
  const cardHeight = cardWidth * 1.33;

  // Chord distance between adjacent items at radius R is: 2 * R * sin(PI / N)
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

  // Pointer event listeners on window to handle smooth global dragging without capturing or blocking canvas clicks
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const currentX = e.clientX;
      const deltaX = currentX - lastXRef.current;
      lastXRef.current = currentX;

      if (Math.abs(currentX - startXRef.current) > 12) {
        hasMovedRef.current = true;
      }

      const sensitivity = 0.0055;
      rotationRef.current += deltaX * sensitivity;
      velocityRef.current = deltaX * sensitivity;
    };

    const handleGlobalPointerUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Left click or touch only
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
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
          <span>&bull; Tap photo to view</span>
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
