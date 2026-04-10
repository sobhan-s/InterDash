import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Torus } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Cuboid } from 'lucide-react';

function SpinningBox({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <Box
      ref={meshRef}
      position={position}
      scale={hovered ? 1.3 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial color={hovered ? 'hotpink' : color} />
    </Box>
  );
}

function FloatingSpheres() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  const spheres = Array.from({ length: 100 }, (_, i) => ({
    position: [Math.sin(i * 0.5) * 3, Math.cos(i * 0.3) * 2, Math.sin(i * 0.7) * 3] as [
      number,
      number,
      number,
    ],
    color: `hsl(${i * 3.6}, 70%, 60%)`,
    scale: 0.1 + Math.random() * 0.2,
  }));

  return (
    <group ref={groupRef}>
      {spheres.map((sphere, i) => (
        <Sphere key={i} position={sphere.position} args={[sphere.scale, 16, 16]}>
          <meshStandardMaterial color={sphere.color} />
        </Sphere>
      ))}
    </group>
  );
}

function SpinningTorus() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state, delta) => {
    ref.current.rotation.x += delta * 0.2;
    ref.current.rotation.z += delta * 0.1;
  });
  return (
    <Torus ref={ref} args={[2, 0.5, 16, 100]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#6366f1" wireframe />
    </Torus>
  );
}

interface ThreeSceneProps {
  counter: number;
  theme: string;
}

const ThreeScene = ({ counter, theme }: ThreeSceneProps) => {
  const [rotationSpeed, setRotationSpeed] = useState(1);
  useEffect(() => {
    setRotationSpeed(1 + Math.sin(counter * 0.1) * 0.5);
  }, [counter]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Cuboid className="h-4 w-4" />
          3D Visualization (Three.js)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full rounded-lg overflow-hidden border">
          <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />

            <SpinningBox position={[-2, 0, 0]} color="#ef4444" />
            <SpinningBox position={[2, 0, 0]} color="#3b82f6" />
            <SpinningBox position={[0, 2, 0]} color="#22c55e" />

            <FloatingSpheres />
            <SpinningTorus />

            <OrbitControls enableZoom enablePan />
            <gridHelper args={[10, 10]} />
          </Canvas>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Rotation speed: {rotationSpeed.toFixed(2)} | Render #{counter}
        </p>
      </CardContent>
    </Card>
  );
};

export default ThreeScene;
