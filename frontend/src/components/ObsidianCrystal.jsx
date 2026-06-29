import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/**
 * Builds a tall vertical obsidian shard: an irregular elongated bipyramid
 * with subtle facet variation, flat-shaded for sharp angular facets.
 */
function buildShardGeometry() {
  const segments = 7;
  const ringRadius = 0.55;
  const upperHeight = 2.2;
  const lowerHeight = 1.6;

  const ring = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const r = ringRadius * (0.78 + 0.42 * Math.abs(Math.sin(i * 3.1 + 1.2)));
    const y = 0.05 * Math.sin(i * 2.3);
    ring.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
  }

  const top = new THREE.Vector3(0.08, upperHeight, -0.05);
  const bottom = new THREE.Vector3(-0.05, -lowerHeight, 0.06);

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

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geom.computeBoundingSphere();
  return geom;
}

/**
 * Custom Fresnel rim shader — additive electric-violet glow on edges only.
 */
function FresnelRim({ geometry, color = "#8B5CF6", power = 2.6, intensity = 1.6 }) {
  const material = useMemo(
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

  return <mesh geometry={geometry} material={material} />;
}

function Shard({ scrollRef }) {
  const groupRef = useRef();
  const innerRef = useRef();
  const { pointer } = useThree();

  const geometry = useMemo(() => buildShardGeometry(), []);
  // A very slightly larger geometry for the rim mesh so it doesn't z-fight
  const rimGeometry = useMemo(() => {
    const g = buildShardGeometry();
    g.scale(1.012, 1.006, 1.012);
    return g;
  }, []);

  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    target.current.x += (pointer.x - target.current.x) * Math.min(delta * 1.6, 1);
    target.current.y += (pointer.y - target.current.y) * Math.min(delta * 1.6, 1);

    // Scroll progress 0..1 (clamped) read from external ref so we never read DOM during render.
    const p = scrollRef ? Math.min(Math.max(scrollRef.current ?? 0, 0), 1) : 0;
    const eased = p * p * (3 - 2 * p); // smoothstep

    if (groupRef.current) {
      // Base rotation speeds up with scroll, max 2.4x
      const speed = 0.16 + eased * 0.24;
      groupRef.current.rotation.y += delta * speed;

      // Mouse tilt + a tiny scroll-driven backwards lean
      const tiltX = -target.current.y * 0.22 - eased * 0.18;
      groupRef.current.rotation.x = tiltX;
      // Push the crystal up and slightly back as the visitor scrolls past the hero
      groupRef.current.position.y = eased * 1.3;
      groupRef.current.position.z = -eased * 1.2;
      const s = 1 - eased * 0.18;
      groupRef.current.scale.set(s, s, s);

      if (innerRef.current) {
        innerRef.current.rotation.y = target.current.x * 0.32 + eased * 0.6;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={innerRef}>
        {/* Main obsidian — polished black glass */}
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color={"#06060a"}
            metalness={0.2}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.08}
            ior={1.7}
            reflectivity={0.6}
            transmission={0.05}
            thickness={1.2}
            attenuationColor={"#1a0b2e"}
            attenuationDistance={0.6}
            envMapIntensity={0.7}
            flatShading
          />
        </mesh>

        {/* Fresnel rim-light — electric violet only at silhouette edges */}
        <FresnelRim geometry={rimGeometry} color="#8B5CF6" power={2.6} intensity={1.8} />

        {/* Internal violet point light — subtle inner refraction glow */}
        <pointLight position={[0, 0.1, 0]} intensity={1.6} color={"#8B5CF6"} distance={2.4} decay={2} />
      </group>
    </group>
  );
}

export default function ObsidianCrystal({ scrollRef }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.1, 7.5], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      {/* Cinematic lighting */}
      <ambientLight intensity={0.08} />
      <directionalLight position={[4, 5, 3]} intensity={0.6} color={"#ffffff"} />
      <directionalLight position={[-4, -1, -2]} intensity={0.35} color={"#8B5CF6"} />
      <spotLight position={[0, 6, 4]} angle={0.4} penumbra={1} intensity={0.8} color={"#ffffff"} />

      {/* Procedural env for glossy reflections — no HDR download */}
      <Environment resolution={256} frames={1} background={false}>
        <Lightformer
          form="circle"
          intensity={0.7}
          color="#ffffff"
          position={[3, 4, 3]}
          scale={[2.2, 2.2, 1]}
        />
        <Lightformer
          form="circle"
          intensity={1.1}
          color="#8B5CF6"
          position={[-3, 1, -2]}
          scale={[3, 3, 1]}
        />
        <Lightformer
          form="circle"
          intensity={0.5}
          color="#a78bfa"
          position={[0, -3, 2]}
          scale={[2.5, 2.5, 1]}
        />
        <Lightformer
          form="circle"
          intensity={0.45}
          color="#ffffff"
          position={[0, 4, -3]}
          scale={[1.4, 1.4, 1]}
        />
      </Environment>

      <Shard scrollRef={scrollRef} />
    </Canvas>
  );
}
