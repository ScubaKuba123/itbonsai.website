import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf, Mail, RotateCcw } from 'lucide-react';
import * as THREE from 'three';
import gsap from 'gsap';
import './bonsai-landing.css';
import './bonsai-premium.css';

export type Category = {
  id: string;
  label: string;
  description: string;
  position: [number, number, number];
  rotation: number;
  color: string;
  subcategories?: string[];
};

export const CATEGORY_DATA: Category[] = [
  { id: 'web', label: 'STRONY WWW', description: 'Nowoczesne strony, które przyciągają uwagę i konwertują.', position: [-2.9, 2.6, 0.15], rotation: -0.45, color: '#d8ff45', subcategories: ['Landing pages', 'Strony firmowe', 'E-commerce', 'Interaktywne / 3D'] },
  { id: 'ai', label: 'AI & AUTOMATYZACJE', description: 'Systemy, które zdejmują powtarzalną pracę z Twojego zespołu.', position: [-0.85, 4.25, 0.05], rotation: -0.08, color: '#c5e98e' },
  { id: 'apps', label: 'APLIKACJE', description: 'Cyfrowe produkty zaprojektowane do codziennego użycia.', position: [2.55, 3.1, 0.2], rotation: 0.35, color: '#f2e96b' },
  { id: 'brand', label: 'BRANDING', description: 'Charakter marki, który zostaje w pamięci.', position: [-3.2, 1.15, -0.05], rotation: -0.62, color: '#b7ff3c' },
  { id: 'seo', label: 'SEO', description: 'Widoczność, która buduje się spokojnie i długoterminowo.', position: [0.8, 1.55, 0.2], rotation: 0.12, color: '#d6ef8e' },
  { id: 'studio', label: 'STUDIO / O NAS', description: 'Poznaj ludzi i sposób pracy za tym ogrodem.', position: [3.35, 1.05, 0.05], rotation: 0.52, color: '#edf39d' },
];

type Point = [number, number, number];
type BranchSpec = { id: string; points: Point[]; radius: number; start: number; end: number; energy?: boolean };

const branchSpecs: BranchSpec[] = [
  { id: 'root-left', points: [[0, 0.2, 0], [-0.8, 0.06, 0.12], [-2.0, -0.06, 0.06]], radius: 0.14, start: 0, end: 0.22 },
  { id: 'root-right', points: [[0.25, 0.17, 0.02], [0.9, 0.03, 0.18], [1.95, -0.04, 0.12]], radius: 0.16, start: 0, end: 0.24 },
  { id: 'root-front', points: [[0, 0.16, 0.2], [0.18, -0.05, 0.75], [0.52, -0.14, 1.25]], radius: 0.12, start: 0, end: 0.25 },
  { id: 'trunk', points: [[0, 0.05, 0], [-0.12, 1.25, 0.05], [0.14, 2.35, -0.02], [-0.08, 3.2, 0.02], [-0.22, 4.05, 0.02]], radius: 0.3, start: 0.06, end: 0.56, energy: true },
  { id: 'web', points: [[-0.02, 2.08, 0], [-0.72, 2.28, 0.05], [-1.65, 2.55, 0.1], [-2.72, 2.72, 0.12]], radius: 0.14, start: 0.44, end: 0.72, energy: true },
  { id: 'web-twig', points: [[-1.25, 2.47, 0.08], [-1.72, 2.9, 0.03], [-2.35, 3.05, 0.08]], radius: 0.07, start: 0.58, end: 0.78 },
  { id: 'ai', points: [[-0.13, 3.18, 0.02], [-0.55, 3.5, 0.05], [-0.8, 4.12, 0.02]], radius: 0.125, start: 0.48, end: 0.76, energy: true },
  { id: 'ai-twig', points: [[-0.5, 3.54, 0.04], [-1.12, 3.72, 0], [-1.55, 3.95, 0.05]], radius: 0.06, start: 0.62, end: 0.8 },
  { id: 'apps', points: [[0.08, 2.58, -0.02], [0.9, 2.7, 0.1], [1.7, 2.95, 0.14], [2.44, 3.08, 0.18]], radius: 0.14, start: 0.45, end: 0.72, energy: true },
  { id: 'apps-twig', points: [[1.4, 2.88, 0.12], [1.88, 3.38, 0.05], [2.22, 3.52, 0.12]], radius: 0.06, start: 0.6, end: 0.79 },
  { id: 'brand', points: [[-0.06, 1.48, 0.01], [-0.85, 1.42, -0.02], [-1.76, 1.2, -0.04], [-2.95, 1.2, -0.03]], radius: 0.13, start: 0.3, end: 0.68, energy: true },
  { id: 'brand-twig', points: [[-1.68, 1.2, -0.04], [-2.08, 0.8, 0], [-2.55, 0.7, 0.02]], radius: 0.06, start: 0.52, end: 0.77 },
  { id: 'seo', points: [[0.08, 1.52, 0.04], [0.52, 1.42, 0.16], [0.75, 1.5, 0.2]], radius: 0.105, start: 0.34, end: 0.68, energy: true },
  { id: 'studio', points: [[0.18, 1.98, 0], [1.05, 1.64, 0.04], [1.98, 1.16, 0.04], [3.12, 1.08, 0.04]], radius: 0.14, start: 0.4, end: 0.7, energy: true },
  { id: 'studio-twig', points: [[2.03, 1.17, 0.05], [2.5, 1.56, 0.02], [2.96, 1.68, 0.06]], radius: 0.06, start: 0.58, end: 0.78 },
];

const barkVertex = `varying vec2 vUv; varying vec3 vNormal; void main(){ vUv=uv; vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const barkFragment = `uniform float uProgress; uniform float uTime; uniform float uActive; varying vec2 vUv; varying vec3 vNormal; void main(){ if(vUv.x>uProgress) discard; float grain=sin(vUv.x*58.0+vUv.y*11.0)+sin(vUv.x*130.0-vUv.y*24.0)*.35; vec3 base=mix(vec3(.16,.085,.038),vec3(.42,.24,.10),vUv.y); base+=grain*.018; float light=dot(vNormal,normalize(vec3(-.3,.8,.6)))*.14+.58; vec3 energy=vec3(.68,.95,.18)*uActive*(.12+.22*sin(uTime*2.0+vUv.x*18.0)); gl_FragColor=vec4(base*light+energy,1.0); }`;
const energyFragment = `uniform float uProgress; uniform float uTime; uniform float uActive; varying vec2 vUv; varying vec3 vNormal; void main(){ if(vUv.x>uProgress) discard; float flow=pow(max(0.0,sin((vUv.x-uTime*.18)*38.0)),10.0); float edge=pow(1.0-abs(vUv.y-.5)*2.0,1.5); float alpha=(.06+flow*.7)*edge*uActive; gl_FragColor=vec4(.78,1.0,.18,alpha); }`;

function useTube(points: Point[], radius: number, tubularSegments = 32) {
  return useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'catmullrom', 0.55);
    const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, 8, false);
    return { geometry };
  }, [points, radius, tubularSegments]);
}

function Branch({ spec, growth, active }: { spec: BranchSpec; growth: React.MutableRefObject<number>; active: boolean }) {
  const { geometry } = useTube(spec.points, spec.radius, spec.id === 'trunk' ? 48 : 28);
  const material = useMemo(() => new THREE.ShaderMaterial({ uniforms: { uProgress: { value: 0 }, uTime: { value: 0 }, uActive: { value: 0 } }, vertexShader: barkVertex, fragmentShader: barkFragment }), []);
  useFrame(({ clock }) => {
    const local = THREE.MathUtils.clamp((growth.current - spec.start) / (spec.end - spec.start), 0, 1);
    material.uniforms.uProgress.value = THREE.MathUtils.smoothstep(local, 0.02, 0.98);
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uActive.value = THREE.MathUtils.damp(material.uniforms.uActive.value, active ? 1 : 0, 5, 1 / 60);
  });
  return <mesh geometry={geometry} material={material} castShadow receiveShadow />;
}

function EnergyBranch({ spec, growth, active }: { spec: BranchSpec; growth: React.MutableRefObject<number>; active: boolean }) {
  const { geometry } = useTube(spec.points, spec.radius * 0.26, 28);
  const material = useMemo(() => new THREE.ShaderMaterial({ uniforms: { uProgress: { value: 0 }, uTime: { value: 0 }, uActive: { value: 0 } }, vertexShader: barkVertex, fragmentShader: energyFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), []);
  useFrame(({ clock }) => {
    const local = THREE.MathUtils.clamp((growth.current - spec.start) / (spec.end - spec.start), 0, 1);
    material.uniforms.uProgress.value = local;
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uActive.value = THREE.MathUtils.damp(material.uniforms.uActive.value, active ? 1 : 0.52, 3.5, 1 / 60);
  });
  return <mesh geometry={geometry} material={material} />;
}

function makeLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.22, 0.52, 0.82, 1.06);
  shape.quadraticCurveTo(0.18, 1.31, -0.82, 1.06);
  shape.quadraticCurveTo(-0.22, 0.52, 0, 0);
  return new THREE.ExtrudeGeometry(shape, { depth: 0.055, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.025, bevelThickness: 0.015 });
}

function LeafNode({ category, growth, active, onHover, onSelect }: { category: Category; growth: React.MutableRefObject<number>; active: boolean; onHover: (id: string | null) => void; onSelect: (id: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(makeLeafGeometry, []);
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({ color: category.color, roughness: 0.48, metalness: 0.05, transmission: 0.08, thickness: 0.16, transparent: true, emissive: category.color, emissiveIntensity: 0.04 }), [category.color]);
  useFrame(() => {
    if (!group.current) return;
    const reveal = THREE.MathUtils.clamp((growth.current - 0.69) / 0.25, 0, 1);
    const target = reveal * (active ? 1.08 : 1);
    const s = THREE.MathUtils.damp(group.current.scale.x, target, active ? 6 : 4, 1 / 60);
    group.current.scale.set(s, s, s);
    material.opacity = reveal;
    material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, active ? 0.5 : 0.06, 5, 1 / 60);
    group.current.rotation.z = category.rotation + Math.sin(performance.now() * 0.00035 + category.position[0]) * 0.012;
  });
  return <group ref={group} position={category.position} rotation={[0.1, -0.15, category.rotation]}>
    <mesh geometry={geometry} material={material} castShadow onPointerOver={(e) => { e.stopPropagation(); onHover(category.id); }} onPointerOut={() => onHover(null)} onClick={(e) => { e.stopPropagation(); onSelect(category.id); }} />
    <mesh position={[0, 0.54, 0.075]} rotation={[0, 0, 0.2]}><boxGeometry args={[0.018, 1.05, 0.01]} /><meshBasicMaterial color="#eff8c0" transparent opacity={0.28} /></mesh>
    <Html position={[0, 0.55, 0.13]} center distanceFactor={7.6} zIndexRange={[10, 0]}>
      <button className={`leaf-label ${active ? 'is-active' : ''}`} onMouseEnter={() => onHover(category.id)} onMouseLeave={() => onHover(null)} onClick={() => onSelect(category.id)} aria-label={`${category.label}: ${category.description}`}><span>{category.label}</span>{active ? <small>{category.description}</small> : null}</button>
    </Html>
  </group>;
}

function MiniLeaf({ position, rotation, scale = 0.42 }: { position: Point; rotation: number; scale?: number }) {
  const geometry = useMemo(makeLeafGeometry, []);
  return <mesh position={position} rotation={[0.1, 0, rotation]} scale={scale} geometry={geometry} castShadow><meshStandardMaterial color="#6c8b3a" roughness={0.78} /></mesh>;
}

function CameraJourney({ selected }: { selected: string | null }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 2.1, 0));
  useEffect(() => {
    const mobile = typeof window !== 'undefined' && window.innerWidth < 620;
    const category = CATEGORY_DATA.find((item) => item.id === selected);
    const destination = category ? new THREE.Vector3(category.position[0] * 0.36, category.position[1] * 0.38 + 1.4, mobile ? 9.5 : 6.5) : new THREE.Vector3(0, 2.2, mobile ? 15.5 : 11);
    const look = category ? new THREE.Vector3(category.position[0] * 0.52, category.position[1] * 0.52, 0) : new THREE.Vector3(0, 2.1, 0);
    const ctx = gsap.context(() => {
      gsap.to(camera.position, { x: destination.x, y: destination.y, z: destination.z, duration: selected ? 1.55 : 1.1, ease: 'power3.inOut' });
      gsap.to(target.current, { x: look.x, y: look.y, z: look.z, duration: selected ? 1.55 : 1.1, ease: 'power3.inOut' });
    });
    return () => ctx.revert();
  }, [camera, selected]);
  useFrame(({ clock }) => {
    const idle = selected ? 0 : 1;
    camera.position.x += Math.sin(clock.elapsedTime * 0.32) * 0.0008 * idle;
    camera.position.y += Math.cos(clock.elapsedTime * 0.24) * 0.0005 * idle;
    camera.lookAt(target.current);
  });
  return null;
}

function BonsaiTree({ growth, active, hovered, onHover, onSelect }: { growth: React.MutableRefObject<number>; active: string | null; hovered: string | null; onHover: (id: string | null) => void; onSelect: (id: string) => void }) {
  return <group position={[0, -0.35, 0]} scale={0.84}>
    {branchSpecs.map((spec) => <group key={spec.id}><Branch spec={spec} growth={growth} active={Boolean(active && active === spec.id)} />{spec.energy ? <EnergyBranch spec={spec} growth={growth} active={Boolean(active)} /> : null}</group>)}
    <group>{CATEGORY_DATA.map((category) => <LeafNode key={category.id} category={category} growth={growth} active={active === category.id || hovered === category.id} onHover={onHover} onSelect={onSelect} />)}<MiniLeaf position={[-1.4, 3.65, 0]} rotation={-0.55} scale={0.32} /><MiniLeaf position={[1.25, 3.78, 0]} rotation={0.5} scale={0.28} /><MiniLeaf position={[-2.0, 1.85, 0]} rotation={-1.0} scale={0.3} /><MiniLeaf position={[2.3, 2.16, 0]} rotation={0.85} scale={0.3} /><MiniLeaf position={[1.45, 0.78, 0]} rotation={0.72} scale={0.24} /></group>
    <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[2.25, 64]} /><meshStandardMaterial color="#071008" roughness={1} transparent opacity={0.8} /></mesh>
    <mesh position={[0, -0.55, 0]} castShadow><cylinderGeometry args={[1.75, 1.48, 0.68, 48, 1, false]} /><meshStandardMaterial color="#1e1911" roughness={0.82} metalness={0.06} /></mesh>
    <mesh position={[0, -0.2, 0]} castShadow><torusGeometry args={[1.72, 0.1, 12, 48]} /><meshStandardMaterial color="#6b4d2f" roughness={0.64} /></mesh>
  </group>;
}

function Scene({ growth, selected, hovered, onHover, onSelect }: { growth: React.MutableRefObject<number>; selected: string | null; hovered: string | null; onHover: (id: string | null) => void; onSelect: (id: string) => void }) {
  const mobile = typeof window !== 'undefined' && window.innerWidth < 620;
  return <Canvas shadows dpr={[1, 1.6]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
    <PerspectiveCamera makeDefault position={[0, 2.2, mobile ? 15.5 : 11]} fov={mobile ? 38 : 32} near={0.1} far={100} /><CameraJourney selected={selected} />
    <color attach="background" args={['#050706']} /><ambientLight intensity={0.52} color="#9bad7a" /><directionalLight position={[-4, 7, 6]} intensity={3.2} color="#e9f0c5" castShadow shadow-mapSize={[1024, 1024]} /><pointLight position={[0, 2.8, 2.5]} intensity={2.5} distance={8} color="#d8ff45" /><pointLight position={[-3, 0, 2]} intensity={1.2} distance={5} color="#8aa45b" />
    <BonsaiTree growth={growth} active={selected} hovered={hovered} onHover={onHover} onSelect={onSelect} /><ContactShadows position={[0, -0.93, 0]} opacity={0.46} scale={7} blur={2.8} far={3.2} color="#000000" />
  </Canvas>;
}

function Logo() { return <a className="bonsai-logo" href="#top" aria-label="BonsAI Studio — początek"><span className="logo-mark"><Leaf /></span><span>BonsAI <em>Studio</em></span></a>; }

export function BonsaiLanding() {
  const growth = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const active = CATEGORY_DATA.find((category) => category.id === selected) ?? null;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    const timeline = gsap.to(growth, { current: 1, duration: media.matches ? 0.08 : 5.15, delay: media.matches ? 0 : 0.25, ease: 'power2.inOut', onComplete: () => setReady(true) });
    const tick = window.setInterval(() => setElapsed((value) => Math.min(5, value + 0.1)), 100);
    if (media.matches) { setReady(true); setElapsed(5); }
    return () => { media.removeEventListener('change', change); timeline.kill(); window.clearInterval(tick); };
  }, []);

  const phase = useMemo(() => elapsed < 1.2 ? 'KORZENIE' : elapsed < 2.5 ? 'TRZON' : elapsed < 3.55 ? 'GAŁĘZIE' : elapsed < 4.45 ? 'ENERGIA' : 'LIŚCIE', [elapsed]);
  const handleSelect = (id: string) => setSelected((current) => current === id ? null : id);

  return <main id="top" className={`bonsai-app ${ready ? 'is-ready' : 'is-growing'} ${reduced ? 'reduced-motion' : ''} ${selected ? 'has-selection' : ''}`}>
    <div className="premium-grain" aria-hidden="true" />
    <header className="bonsai-header premium-header"><Logo /><div className="header-center"><span>THE DIGITAL GARDEN</span><i /></div><a className="talk-link" href="mailto:studio@itbonsai.pl?subject=Porozmawiajmy"><span>Porozmawiajmy</span><ArrowRight /></a></header>
    <section className="premium-copy" aria-labelledby="hero-title"><p className="intro-kicker"><span className="signal-dot" /> BonsAI Studio / Gdańsk</p><h1 id="hero-title">Budujemy<br /><i>rzeczy z życiem.</i></h1><p className="intro-description">Strony, aplikacje i automatyzacje, które rosną razem z ambicją Twojej marki.</p><a className="premium-scroll" href="#services"><span>Przejdź przez ogród</span><ArrowRight /></a></section>
    <section id="services" className="premium-stage" aria-label="Interaktywne drzewo BonsAI — wybierz kategorię">
      <div className="stage-orbit orbit-one" aria-hidden="true" /><div className="stage-orbit orbit-two" aria-hidden="true" />
      <div className="stage-art"><div className="stage-light" aria-hidden="true" /><img src="/bonsai-hero-foreground-v2.png" alt="Bonsai z ciepłymi, złotymi liniami energii" /><div className="webgl-support" aria-hidden="true"><Scene growth={growth} selected={selected} hovered={hovered} onHover={setHovered} onSelect={handleSelect} /></div></div>
      <div className="category-nodes">{CATEGORY_DATA.map((category, index) => <button key={category.id} className={`category-node node-${index + 1} ${selected === category.id ? 'is-active' : ''}`} onMouseEnter={() => setHovered(category.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(category.id)} onBlur={() => setHovered(null)} onClick={() => handleSelect(category.id)} aria-label={`${category.label}: ${category.description}`}><span className="node-dot" /><span>{category.label}</span><i>{String(index + 1).padStart(2, '0')}</i></button>)}</div>
      <div className="stage-index"><span>01</span><i /><span>06</span></div>
    </section>
    <div className="premium-status"><span><i /> Obiekt interaktywny</span><b>{phase}</b></div>
    <nav className="semantic-nav premium-semantic-nav" aria-label="Kategorie BonsAI Studio">{CATEGORY_DATA.map((category) => <button key={category.id} className={selected === category.id ? 'is-active' : ''} onClick={() => handleSelect(category.id)}>{category.label}</button>)}</nav>
    <AnimatePresence>{active ? <motion.aside className="category-panel premium-panel" initial={{ opacity: 0, x: -24, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: -18, y: 10 }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }} aria-live="polite"><div className="panel-top"><span>Wybrana gałąź</span><button onClick={() => setSelected(null)} aria-label="Wróć do drzewa"><RotateCcw /></button></div><h2>{active.label}</h2><p>{active.description}</p>{active.subcategories ? <div className="subleaf-list">{active.subcategories.map((sub, index) => <span key={sub}><i>0{index + 1}</i>{sub}</span>)}</div> : null}<a href={`mailto:studio@itbonsai.pl?subject=${encodeURIComponent(active.label)}`} className="panel-cta">Porozmawiajmy <Mail /></a></motion.aside> : null}</AnimatePresence>
    <footer className="bonsai-footer premium-footer"><span>Gdańsk · Poland</span><span>WEB · APPS · AI</span><span className="footer-note">Zbudowane z ciekawości <Leaf /></span></footer><div className="intro-curtain" aria-hidden="true"><span>bonsai / 01</span></div>
  </main>;
}
