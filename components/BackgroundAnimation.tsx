"use client";

import { useRef, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Sphere,
  MeshDistortMaterial,
  Float,
  OrbitControls,
} from "@react-three/drei";

function AnimatedSpheres() {
  const group = useRef<THREE.Group>(null);
  const smallSpheres = useRef<THREE.Mesh[]>([]);

  // Create small spheres
  useEffect(() => {
    smallSpheres.current = [];
    for (let i = 0; i < 10; i++) {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 32, 32),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x4361ee),
          metalness: 0.8,
          roughness: 0.2,
        })
      );

      // Random positions in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2 + Math.random() * 3;

      sphere.position.x = radius * Math.sin(phi) * Math.cos(theta);
      sphere.position.y = radius * Math.sin(phi) * Math.sin(theta);
      sphere.position.z = radius * Math.cos(phi);

      smallSpheres.current.push(sphere);
      group.current?.add(sphere);
    }

    return () => {
      smallSpheres.current.forEach((sphere) => {
        group.current?.remove(sphere);
      });
    };
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      group.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }

    smallSpheres.current.forEach((sphere, i) => {
      // Make each small sphere orbit with different speeds
      const time = state.clock.getElapsedTime();
      const radius = sphere.position.length();
      const speed = 0.2 + (i % 5) * 0.05;

      sphere.position.x = radius * Math.sin(time * speed + i);
      sphere.position.y =
        radius * Math.cos(time * speed + i) * Math.sin(time * 0.1);
      sphere.position.z =
        radius * Math.cos(time * speed + i) * Math.cos(time * 0.1);
    });
  });

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[1, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#4361ee"
            attach="material"
            distort={0.4}
            speed={1.5}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>
    </group>
  );
}

function ParticlesField() {
  const particlesRef = useRef<THREE.Points>(null);

  useEffect(() => {
    if (particlesRef.current) {
      const positions = new Float32Array(200 * 3);
      for (let i = 0; i < 200; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      }

      particlesRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
    }
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.05}
        color="#4361ee"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

export default function BackgroundAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Transform values based on scroll
  const yPosition = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 0.6, 0.4, 0.2]
  );
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity }}
    >
      <motion.div
        className="w-full h-full"
        style={{ y: yPosition, scale, rotateY }}
      >
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <AnimatedSpheres />
          <ParticlesField />
        </Canvas>
      </motion.div>
    </motion.div>
  );
}