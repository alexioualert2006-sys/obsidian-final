import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/**
 * Fresnel rim-light shader — same electric-violet rim as the hero crystal.
 */
function useFresnelMaterial(color = "#8B5CF6", power = 2.4, intensity = 1.6) {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uPower: { value: power },
          uIntensity: { value: intensity },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(-mvPosition.xyz);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uPower;
          uniform float uIntensity;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            float f = 1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
            f = pow(f, uPower) * uIntensity;
            gl_FragColor = vec4(uColor * f, f);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.FrontSide,
      }),
    [color, power, intensity]
  );
}

/**
 * A tall, thin shard geometry (like a mini version of the hero crystal),
 * used for the "Launch" step.
 */
function buildMiniShard() {
  const segments = 6;
  const r = 0.42;
  const top = new THREE.Vector3(0.04, 1.2, -0.02);
  const bottom = new THREE.Vector3(-0.02, -0.9, 0.03);
  const ring = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const rr = r * (0.8 + 0.35 * Math.abs(Math.sin(i * 2.1 + 0.7)));
    ring.push(new THREE.Vector3(Math.cos(a) * rr, 0.02 * Math.sin(i * 1.6), Math.sin(a) * rr));
  }
  const positions = [];
  const normals = [];
  const pushTri = (a, b, c) => {
    const n = new THREE.Vector3()
      .subVectors(b, a)
      .cross(new THREE.Vector3().subVectors(c, a))
      .normalize();
    [a, b, c].forEach((v) => {
      positions.push(v.x, v.y, v.z);
      normals.push(n.x, n.y, n.z);
    });
  };
  for (let i = 0; i < segments; i++) {
    const cur = ring[i];
    const nxt = ring[(i + 1) % segments];
    pushTri(cur, nxt, top);
    pushTri(nxt, cur, bottom);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  g.computeBoundingSphere();
  return g;
}

function VariantGeometry({ variant }) {
  // Returns a Three geometry instance for the chosen variant.
  // Discover  → tetrahedron (4 facets)
  // Design    → octahedron (8 facets, design "diamond")
  // Build     → icosahedron (faceted core)
  // Launch    → mini upward shard (echo of hero crystal)
  const geom = useMemo(() => {
    switch (variant) {
      case "tetra":
        return new THREE.TetrahedronGeometry(1.05, 0);
      case "octa":
        return new THREE.OctahedronGeometry(1.0, 0);
      case "icosa":
        return new THREE.IcosahedronGeometry(1.0, 0);
      case "shard":
      default:
        return buildMiniShard();
    }
  }, [variant]);
  return <primitive object={geom} attach="geometry" />;
}

function StepMesh({ variant }) {
  const groupRef = useRef();
  const fresnelMat = useFresnelMaterial("#8B5CF6", 2.4, 1.7);
  const { pointer } = useThree();
  const target = useRef({ x: 0, y: 0 });

  // Slight static rotation offset so each variant catches light differently
  const baseRot = useMemo(() => {
    switch (variant) {
      case "tetra":
        return [0.35, 0.6, 0];
      case "octa":
        return [0.0, 0.0, 0];
      case "icosa":
        return [0.4, 0.2, 0.1];
      default:
        return [0.05, 0, 0];
    }
  }, [variant]);

  // Rotation speed varies subtly per variant for cinematic life
  const speed = variant === "shard" ? 0.18 : 0.22;

  useFrame((state, delta) => {
    target.current.x += (pointer.x - target.current.x) * Math.min(delta * 1.2, 1);
    target.current.y += (pointer.y - target.current.y) * Math.min(delta * 1.2, 1);
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
      groupRef.current.rotation.x = baseRot[0] + target.current.y * 0.15;
    }
  });

  return (
    <group ref={groupRef} rotation={baseRot}>
      {/* Main faceted black-glass body */}
      <mesh>
        <VariantGeometry variant={variant} />
        <meshPhysicalMaterial
          color={"#06060a"}
          metalness={0.2}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.08}
          ior={1.7}
          reflectivity={0.6}
          transmission={0.04}
          thickness={1}
          attenuationColor={"#1a0b2e"}
          attenuationDistance={0.6}
          envMapIntensity={0.7}
          flatShading
        />
      </mesh>

      {/* Fresnel rim — slightly larger silhouette */}
      <mesh material={fresnelMat} scale={[1.018, 1.012, 1.018]}>
        <VariantGeometry variant={variant} />
      </mesh>

      {/* Inner violet point light — subtle inner glow */}
      <pointLight position={[0, 0, 0]} intensity={0.9} color={"#8B5CF6"} distance={1.6} decay={2} />
    </group>
  );
}

export default function StepShape({ variant = "tetra" }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.05, 3.6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={0.1} />
      <directionalLight position={[3, 4, 2]} intensity={0.55} color={"#ffffff"} />
      <directionalLight position={[-3, -1, -2]} intensity={0.3} color={"#8B5CF6"} />

      <Environment resolution={128} frames={1} background={false}>
        <Lightformer form="circle" intensity={0.7} color="#ffffff" position={[2, 3, 2]} scale={[1.8, 1.8, 1]} />
        <Lightformer form="circle" intensity={1} color="#8B5CF6" position={[-2, 1, -1.5]} scale={[2.4, 2.4, 1]} />
        <Lightformer form="circle" intensity={0.4} color="#a78bfa" position={[0, -2, 1.5]} scale={[2, 2, 1]} />
      </Environment>

      <StepMesh variant={variant} />
    </Canvas>
  );
}
