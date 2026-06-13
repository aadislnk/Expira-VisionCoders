import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// 3D Product Models
function MilkCarton() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(clock.elapsedTime * 0.8) * 0.005;
      ref.current.rotation.z += 0.003;
    }
  });
  return (
    <group ref={ref} position={[-3, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.8, 1.4, 0.5]} />
        <meshStandardMaterial color="#f4d4c5" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.5]} />
        <meshStandardMaterial color="#d4a574" roughness={0.3} />
      </mesh>
    </group>
  );
}

function MedicineBottle() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(clock.elapsedTime * 0.9 + 1) * 0.005;
      ref.current.rotation.y += 0.002;
    }
  });
  return (
    <group ref={ref} position={[0, 1.2, 0]}>
      <mesh>
        <cylinderGeometry args={[0.35, 0.4, 1.2, 16]} />
        <meshStandardMaterial color="#e8b87e" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#d97c6b" roughness={0.2} />
      </mesh>
    </group>
  );
}

function CosmeticBottle() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(clock.elapsedTime * 0.7 + 2) * 0.005;
      ref.current.rotation.z += 0.0015;
    }
  });
  return (
    <group ref={ref} position={[3, 0.5, 0]}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.35, 1.4, 12]} />
        <meshStandardMaterial color="#d97c6b" roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#fef9f6" roughness={0.2} />
      </mesh>
    </group>
  );
}

function GroceryBox() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(clock.elapsedTime * 0.6 + 3) * 0.006;
      ref.current.rotation.y += 0.0025;
    }
  });
  return (
    <group ref={ref} position={[0, -0.8, 2]}>
      <mesh>
        <boxGeometry args={[1, 0.7, 0.8]} />
        <meshStandardMaterial color="#b8956a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.41]}>
        <planeGeometry args={[1, 0.7]} />
        <meshStandardMaterial color="#c9945a" roughness={0.4} />
      </mesh>
    </group>
  );
}

// 3D Arch
function Arch() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.2) * 0.02;
    }
  });

  return (
    <group ref={ref}>
      {/* Left arch pillar */}
      <mesh position={[-3.5, -1.5, 0]}>
        <boxGeometry args={[0.4, 3.5, 0.4]} />
        <meshStandardMaterial color="#d4a574" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Right arch pillar */}
      <mesh position={[3.5, -1.5, 0]}>
        <boxGeometry args={[0.4, 3.5, 0.4]} />
        <meshStandardMaterial color="#d4a574" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Arch curve - made with spheres */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 19) * Math.PI;
        const x = Math.cos(angle - Math.PI / 2) * 3.8;
        const y = Math.sin(angle - Math.PI / 2) * 3.8 + 1.2;
        return (
          <mesh key={i} position={[x, y, 0]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#d4a574" roughness={0.4} metalness={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

// Camera controller
function CameraController({ mouseX = 0, mouseY = 0 }) {
  const cameraRef = useRef();

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.x = (mouseX / window.innerWidth) * 2 - 1;
      cameraRef.current.position.y = -(mouseY / window.innerHeight) * 2 + 1;
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 8]} fov={50} />;
}

export default function PremiumHeroScene({ mouseX = 0, mouseY = 0 }) {
  return (
    <Canvas className="hero-canvas" style={{ width: "100%", height: "100%" }}>
      <CameraController mouseX={mouseX} mouseY={mouseY} />

      {/* Lighting */}
      <ambientLight intensity={1.2} color="#fef9f6" />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#fef9f6" shadow-mapSize-width={2048} />
      <directionalLight position={[-5, 5, -5]} intensity={0.8} color="#f4d4c5" />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#e8b87e" />

      {/* Scene */}
      <group>
        <Arch />
        <MilkCarton />
        <MedicineBottle />
        <CosmeticBottle />
        <GroceryBox />
      </group>

      {/* Soft ground plane */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#f5ede4" roughness={0.8} />
      </mesh>
    </Canvas>
  );
}
