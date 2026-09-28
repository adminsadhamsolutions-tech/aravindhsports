import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

function AthleteSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    // Delta-based rotation ensures uniform speed regardless of CPU/GPU load
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.15;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.25;
      wireRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1.2, 24, 24]}>
        <meshStandardMaterial
          color="#FF6B00"
          emissive="#FF6B00"
          emissiveIntensity={0.5}
          roughness={0.4}
          metalness={0.6}
        />
      </Sphere>
      <Icosahedron ref={wireRef} args={[1.7, 0]}>
        <meshBasicMaterial color="#ff8c38" wireframe transparent opacity={0.25} />
      </Icosahedron>
    </group>
  );
}

function OrbitingRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ring1.current) {
      ring1.current.rotation.x += delta * 0.5;
      ring1.current.rotation.y += delta * 0.3;
    }
    if (ring2.current) {
      ring2.current.rotation.y -= delta * 0.4;
      ring2.current.rotation.z += delta * 0.35;
    }
    if (ring3.current) {
      ring3.current.rotation.x -= delta * 0.25;
      ring3.current.rotation.z -= delta * 0.4;
    }
  });

  return (
    <>
      {/* meshBasicMaterial eliminates expensive multi-light calculations on transparent rings */}
      <Torus ref={ring1} args={[2.5, 0.025, 8, 48]}>
        <meshBasicMaterial color="#FF6B00" transparent opacity={0.55} />
      </Torus>
      <Torus ref={ring2} args={[3, 0.02, 8, 48]}>
        <meshBasicMaterial color="#ff8c38" transparent opacity={0.35} />
      </Torus>
      <Torus ref={ring3} args={[3.5, 0.015, 8, 48]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </Torus>
    </>
  );
}

function FloatingParticles() {
  const count = 60;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return arr;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#FF6B00" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={1} // Locked at 1 to prevent heavy multi-retina lag on laptops & phones
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        precision: 'lowp',
      }}
      frameloop="always"
      className="pointer-events-none"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 4]} intensity={1.2} color="#FF6B00" />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <AthleteSphere />
      </Float>

      <OrbitingRings />
      <FloatingParticles />
    </Canvas>
  );
}