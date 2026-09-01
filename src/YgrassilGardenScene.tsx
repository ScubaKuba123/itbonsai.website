import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import type { Autonomy, SystemState } from './YgrassilPremiumScene';

function GardenFoundation({ state }: { state: SystemState }) {
  const lightIntensity = state === 'IDLE' ? 0.72 : 0.92;

  return <>
    <color attach="background" args={['#050708']} />
    <fog attach="fog" args={['#06120d', 7.5, 24]} />
    <PerspectiveCamera makeDefault position={[0, 5.2, 8.6]} rotation={[-0.54, 0, 0]} fov={42} />
    <ambientLight intensity={0.42} color="#86a47c" />
    <directionalLight position={[-4.5, 6, 4]} intensity={lightIntensity} color="#e4c36c" />
    <pointLight position={[0, 2.2, 1.6]} intensity={1.15} color="#bedf64" distance={9} />
    <pointLight position={[4.7, 1.8, -2.8]} intensity={0.62} color="#5ca8aa" distance={7} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.16, 0]} receiveShadow>
      <planeGeometry args={[18, 10.6, 32, 18]} />
      <meshStandardMaterial color="#09140d" roughness={0.94} metalness={0.02} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.145, 0.2]}>
      <circleGeometry args={[4.6, 64]} />
      <meshBasicMaterial color="#172713" transparent opacity={0.28} />
    </mesh>
  </>;
}

export function YgrassilGardenScene({ state, autonomy }: { state: SystemState; autonomy: Autonomy }) {
  return <div className={`yg-garden-canvas mode-${autonomy.toLowerCase()}`} aria-hidden="true">
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
      <GardenFoundation state={state} />
    </Canvas>
  </div>;
}
