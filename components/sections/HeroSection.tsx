"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Animated 3D sphere component
function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere args={[1, 100, 200]} scale={2.4} ref={meshRef}>
      <MeshDistortMaterial
        color="#4361ee"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

// Floating particles background
function ParticlesBackground() {
  const particlesRef = useRef<THREE.Points>(null);

  useEffect(() => {
    if (particlesRef.current) {
      const positions = new Float32Array(200 * 3);
      for (let i = 0; i < 200; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }

      particlesRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
    }
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.075;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial size={0.05} color="#4361ee" sizeAttenuation transparent />
    </points>
  );
}

export default function HeroSection() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Calculate mouse parallax for decorative elements
  const calculateMouseParallax = (depth = 10) => {
    if (!isMounted) return { x: 0, y: 0 }; // Return default values during SSR and initial render

    const x = (mousePosition.x - window.innerWidth / 2) / depth;
    const y = (mousePosition.y - window.innerHeight / 2) / depth;
    return { x, y };
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 sm:pt-20 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900/50 dark:to-gray-950 -z-10" />

      {isMounted && (
        <motion.div className="absolute inset-0 -z-5" style={{ opacity }}>
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"
            style={{
              x: calculateMouseParallax(20).x,
              y: calculateMouseParallax(20).y,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow"
            style={{
              animationDelay: "1s",
              x: calculateMouseParallax(30).x,
              y: calculateMouseParallax(30).y,
            }}
          />
        </motion.div>
      )}

      <div className="section-container px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="z-10"
          style={{ y: y1 }}
        >
          <motion.div variants={itemVariants} className="mb-4">
            <motion.span
              className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 shadow-md inline-block"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
              }}
            >
              Full-Stack Developer & AI Enthusiast
            </motion.span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight"
          >
            Crafting Digital <span className="gradient-text">Experiences</span>{" "}
            Through Code
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-xl"
          >
            I build beautiful, interactive, and high-performance web
            applications using modern technologies and best practices.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3 sm:gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden text-sm sm:text-base h-10 sm:h-11"
                asChild
              >
                <Link href="#contact">
                  <span className="relative z-10">Let's Talk</span>
                  <ArrowRight className="relative z-10 ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  <motion.span
                    className="absolute inset-0 bg-blue-700"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.3,
                    }}
                  />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="shadow-md hover:shadow-lg transition-all group text-sm sm:text-base h-10 sm:h-11"
                asChild
              >
                <Link
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download CV{" "}
                  <Download className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-y-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href="https://github.com/adoumouangnamouemmanuel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href="https://www.linkedin.com/in/ouang-namou-emmanuel-adoum/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </motion.div>
            </div>

            <div className="h-5 sm:h-6 border-l border-gray-300 dark:border-gray-700 mx-1 sm:mx-2"></div>

            <motion.span
              className="text-xs sm:text-sm text-muted-foreground flex items-center"
              animate={{
                scale: [1, 1.05, 1],
                transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
              }}
            >
              <span className="inline-block w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-500 mr-1.5 sm:mr-2"></span>
              Available for work
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative"
          style={{ y: y2 }}
        >
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] card-3d">
            <div className="card-3d-content relative w-full h-full">
              <div className="absolute inset-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-xl animate-pulse-slow"></div>
              <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 opacity-80"></div>

                {/* 3D Canvas */}
                <div className="absolute inset-0">
                  <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <AnimatedSphere />
                    <ParticlesBackground />
                    <OrbitControls
                      enableZoom={false}
                      autoRotate
                      autoRotateSpeed={0.5}
                    />
                  </Canvas>
                </div>

                <div className="relative h-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 text-center">
                  <motion.div
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg mb-4 sm:mb-6 relative"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Image
                      src="/images/emma-head.png"
                      alt="Developer portrait"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </motion.div>

                  <motion.h3
                    className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    Emmanuel Adoum
                  </motion.h3>

                  <motion.p
                    className="text-white dark:text-blue-400 font-medium mb-3 sm:mb-4 text-sm sm:text-base"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Full-Stack Developer & AI Enthusiast
                  </motion.p>

                  <motion.div
                    className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    {[
                      "React",
                      "Next.js",
                      "TypeScript",
                      "Node.js",
                      "Tailwind",
                      "Python",
                      "PyTorch",
                      "Machine Learning",
                      "Matlab",
                      "PostgreSQL",
                    ].map((tech, i) => (
                      <motion.span
                        key={i}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-[10px] sm:text-xs font-medium shadow-sm"
                        whileHover={{ scale: 1.1, y: -2 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: { delay: 1.1 + i * 0.1 },
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </motion.div>

                  <motion.div
                    className="w-full max-w-[200px] sm:max-w-xs bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="flex justify-between mb-1 sm:mb-2 text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Experience
                      </span>
                      <span className="font-medium">3+ years</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 sm:h-1.5">
                      <motion.div
                        className="bg-blue-600 h-1 sm:h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ delay: 1.3, duration: 1 }}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements - Only render on client side */}
          {isMounted && (
            <>
              <motion.div
                className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 w-8 sm:w-12 h-8 sm:h-12 bg-yellow-400 rounded-lg shadow-lg"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  delay: 0.5,
                }}
                style={{
                  x: calculateMouseParallax(10).x,
                  y: calculateMouseParallax(10).y,
                }}
              />

              <motion.div
                className="absolute -bottom-6 sm:-bottom-8 -left-6 sm:-left-8 w-10 sm:w-16 h-10 sm:h-16 bg-blue-500 rounded-full shadow-lg"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 4,
                  delay: 1.2,
                }}
                style={{
                  x: calculateMouseParallax(15).x,
                  y: calculateMouseParallax(15).y,
                }}
              />

              <motion.div
                className="absolute top-1/2 -right-3 sm:-right-4 w-6 sm:w-8 h-6 sm:h-8 bg-purple-500 rounded-lg shadow-lg"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2.5,
                  delay: 0.8,
                }}
                style={{
                  x: calculateMouseParallax(5).x,
                  y: calculateMouseParallax(5).y,
                }}
              />
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
