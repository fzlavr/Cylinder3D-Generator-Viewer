// ─── CREATED: extracted from test.jsx ────────────────────────
import { OrbitControls, Grid } from "@react-three/drei";

export default function CylinderScene({ diameter, height, meshRef }) {
  const radius = diameter / 2 / 100;
  const h      = height / 100;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]}   intensity={1.2} castShadow />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} />

      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, h, 64]} />
        <meshStandardMaterial color="#4f8ef7" metalness={0.2} roughness={0.5} />
      </mesh>

      <Grid
        position={[0, -h / 2, 0]}
        args={[10, 10]}
        cellSize={0.1}
        cellColor="#94a3b8"
        sectionColor="#475569"
        fadeDistance={6}
        infiniteGrid
      />
      <OrbitControls makeDefault enablePan enableZoom enableRotate />
    </>
  );
}
