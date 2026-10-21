import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

export interface CameraWaypoint {
  pos: [number, number, number];
  target: [number, number, number];
  up?: [number, number, number]; // Dutch tilt / bank roll
  fov?: number;
  name: string;
  telemetry: string;
  side: 'left' | 'right'; // Which rail content docks to
}

export const SECTION_WAYPOINTS: Record<number, CameraWaypoint> = {
  // 0: Overview - Wide 3/4 cinematic angle, artifact framed in right-center (content on left rail)
  0: {
    pos: [-2.4, 0.5, 5.4],
    target: [-1.5, 0, 0],
    up: [0, 1, 0],
    fov: 46,
    name: 'Orbital Overview',
    telemetry: 'ELEV: +12° · AZIMUTH: 3/4 WIDE',
    side: 'left',
  },
  // 1: About - Low-angle dramatic upward view (Worm's-eye perspective looking up at the titanium monolith, artifact on right)
  1: {
    pos: [-2.6, -1.8, 3.9],
    target: [-1.6, 0.45, 0],
    up: [-0.12, 0.99, -0.05],
    fov: 44,
    name: 'Biometric Chamber',
    telemetry: 'ELEV: -38° LOW ANGLE · ROLL: +7°',
    side: 'left',
  },
  // 2: Skills - High bird's eye top-down diagonal angle looking down across orbital rings (artifact on left, content on right rail!)
  2: {
    pos: [3.6, 2.8, 5.0],
    target: [2.2, 0.1, 0],
    up: [0.15, 0.98, 0.05],
    fov: 43,
    name: 'Neural Lattice',
    telemetry: 'ELEV: +52° BIRD\'S EYE · ROLL: -9°',
    side: 'right',
  },
  // 3: Projects - Side-profile slice angle with deep perspective compression (artifact on right, content on left rail)
  3: {
    pos: [-2.8, 0.5, 3.4],
    target: [-1.7, -0.15, 0],
    up: [-0.08, 0.99, -0.08],
    fov: 42,
    name: 'Holodeck Projection',
    telemetry: 'ELEV: +8° SIDE PROFILE · FOV: 42°',
    side: 'left',
  },
  // 4: Experience - Steep Dutch-tilt dynamic orbit across chronology gimbal rings (entire ring mechanism framed openly on left, content on right rail)
  4: {
    pos: [3.7, -0.7, 5.0],
    target: [2.3, 0.05, 0],
    up: [0.22, 0.97, -0.05],
    fov: 42,
    name: 'Chronology Orbit',
    telemetry: 'ELEV: -24° DUTCH TILT · ROLL: -14°',
    side: 'right',
  },
  // 5: Certifications - Elevated technical inspection angle from upper-right (artifact on right, content on left rail)
  5: {
    pos: [-2.6, 1.8, 3.5],
    target: [-1.6, 0.2, 0],
    up: [-0.05, 0.99, 0.05],
    fov: 43,
    name: 'Credential Crest',
    telemetry: 'ELEV: +32° UPPER ANGLE · SPECULAR',
    side: 'left',
  },
  // 6: Contact - Macro zoom entering directly into the glowing quantum crystal core! (artifact centered in right viewport, content on left rail)
  6: {
    pos: [-0.9, 0.1, 2.1],
    target: [-0.9, 0, 0],
    up: [0, 1, 0],
    fov: 52,
    name: 'Quantum Core',
    telemetry: 'INTERNAL MACRO CORE · DIST: 2.1',
    side: 'left',
  },
};

export const OBJECT_NODES = [
  { index: 0, label: 'Overview', desc: 'Central Artifact Overview', pos: [0, 1.85, 0] as [number, number, number] },
  { index: 1, label: 'About', desc: 'Identity & Bio-Data', pos: [-1.4, 0.8, 1.0] as [number, number, number] },
  { index: 2, label: 'Skills', desc: 'Neural Stack Matrix', pos: [1.4, 1.0, 0.9] as [number, number, number] },
  { index: 3, label: 'Projects', desc: 'Production Portfolios', pos: [0, -1.75, 0.7] as [number, number, number] },
  { index: 4, label: 'Experience', desc: 'ITSM Timeline Ring', pos: [-1.4, -1.2, 0.8] as [number, number, number] },
  { index: 5, label: 'Certifications', desc: 'Oracle Credentials', pos: [1.4, -0.9, 0.9] as [number, number, number] },
  { index: 6, label: 'Contact', desc: 'Quantum Comm Link', pos: [0, 0, 1.3] as [number, number, number] },
];

interface FuturisticObject3DProps {
  currentSection: number;
  onSelectSection?: (index: number) => void;
}

export default function FuturisticObject3D({
  currentSection,
  onSelectSection,
}: FuturisticObject3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const hitBoxesRef = useRef<THREE.Mesh[]>([]);

  // Hover indicator state
  const [hoveredNode, setHoveredNode] = useState<{ index: number; label: string } | null>(null);

  // Dynamic scroll banking velocity
  const scrollRollRef = useRef(0);

  // Pointer drag vs click detection
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const pointerDownRef = useRef({ x: 0, y: 0, time: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });

  const currentSectionRef = useRef(currentSection);
  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  const onSelectSectionRef = useRef(onSelectSection);
  useEffect(() => {
    onSelectSectionRef.current = onSelectSection;
  }, [onSelectSection]);

  // Handle subtle camera banking on mouse wheel
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('.allow-scroll') ||
         target.closest('[data-saha-chat]') ||
         target.closest('#saha-ai-modal') ||
         target.closest('.saha-chatbox') ||
         target.closest('input') ||
         target.closest('textarea'))
      ) {
        return;
      }
      // Dynamic camera roll impulse during scrolling
      scrollRollRef.current += Math.sign(e.deltaY) * 0.08;
      // Clamp banking impulse
      scrollRollRef.current = Math.max(-0.25, Math.min(0.25, scrollRollRef.current));
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.075);

    // 2. Camera setup with real coordinate-based zoom & dynamic angles
    const initialWp = SECTION_WAYPOINTS[currentSectionRef.current] || SECTION_WAYPOINTS[0];
    const camera = new THREE.PerspectiveCamera(initialWp.fov || 45, width / height, 0.1, 100);

    const xOffsetDynamic = isMobile ? 0 : 0;
    const yOffsetDynamic = isMobile ? 0.6 : 0;
    const zOffsetDynamic = isMobile ? 1.8 : 0;

    camera.position.set(
      initialWp.pos[0] * (isMobile ? 0.3 : 1) + xOffsetDynamic,
      initialWp.pos[1] + yOffsetDynamic,
      initialWp.pos[2] + zOffsetDynamic
    );
    const cameraTarget = new THREE.Vector3(
      initialWp.target[0] * (isMobile ? 0.3 : 1),
      initialWp.target[1] + (isMobile ? 0.4 : 0),
      initialWp.target[2]
    );
    camera.lookAt(cameraTarget);
    if (initialWp.up) {
      camera.up.set(...initialWp.up);
    }
    cameraRef.current = camera;

    // 3. High visual fidelity WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Procedural Studio Lighting Environment Map (Realism & Specular Reflections)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new THREE.Scene();

    // Studio softbox light reflectors for crisp reflections on glass and titanium
    const boxGeo = new THREE.PlaneGeometry(12, 12);
    const boxMatKey = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    const pKey = new THREE.Mesh(boxGeo, boxMatKey);
    pKey.position.set(10, 16, 12);
    pKey.lookAt(0, 0, 0);
    envScene.add(pKey);

    const boxMatFill = new THREE.MeshBasicMaterial({ color: 0x818cf8 });
    const pFill = new THREE.Mesh(boxGeo, boxMatFill);
    pFill.position.set(-14, 10, -10);
    pFill.lookAt(0, 0, 0);
    envScene.add(pFill);

    const boxMatRim = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const pRim = new THREE.Mesh(boxGeo, boxMatRim);
    pRim.position.set(0, -12, 12);
    pRim.lookAt(0, 0, 0);
    envScene.add(pRim);

    const envMapTexture = pmremGenerator.fromScene(envScene, 0.04).texture;
    scene.environment = envMapTexture;

    // Real three-point studio lights (Warm key, cool fill, crisp rim specular)
    const ambientLight = new THREE.AmbientLight(0xf1f5f9, 0.55);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf8fafc, 2.2);
    keyLight.position.set(6, 9, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fillLight.position.set(-7, -4, 5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x818cf8, 2.2, 30);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    const coreLight = new THREE.PointLight(0x38bdf8, 1.8, 8);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 5. Central 3D Futuristic Artifact Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // ── A. Outer Crystalline Glass Shell (Crown Glass Refraction & Deep Reflections) ──
    const frameGeo = new THREE.IcosahedronGeometry(1.62, 0);
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: 0x07152b,
      metalness: 0.08,
      roughness: 0.04,
      transmission: 0.88,
      ior: 1.54, // Crown glass refractive index
      thickness: 1.4,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 0.94,
      attenuationColor: new THREE.Color(0x38bdf8),
      attenuationDistance: 1.8,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    masterGroup.add(frameMesh);

    // Precision Titanium Beveled Edges (Structural exoskeleton)
    const edgesGeo = new THREE.EdgesGeometry(frameGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    frameMesh.add(edgesMesh);

    // Polished Mirror-Chrome Vertex Fasteners (Catching sparkling specular glints)
    const vertexPositions = frameGeo.getAttribute('position');
    const vertexMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.98,
      roughness: 0.06,
    });
    const vertexGeo = new THREE.SphereGeometry(0.042, 16, 16);
    const uniqueVertices = new Set<string>();

    for (let i = 0; i < vertexPositions.count; i++) {
      const vx = vertexPositions.getX(i);
      const vy = vertexPositions.getY(i);
      const vz = vertexPositions.getZ(i);
      const key = `${vx.toFixed(2)},${vy.toFixed(2)},${vz.toFixed(2)}`;
      if (!uniqueVertices.has(key)) {
        uniqueVertices.add(key);
        const vMesh = new THREE.Mesh(vertexGeo, vertexMat);
        vMesh.position.set(vx, vy, vz);
        frameMesh.add(vMesh);
      }
    }

    // ── B. Internal Gyroscopic Chrono-Turbillion (Intricate Watchmaker Mechanics) ──
    const turbillionGroup = new THREE.Group();
    masterGroup.add(turbillionGroup);

    // Gimbal Ring 1: Equatorial Titanium Ring with Gear Notches
    const gimbalMat1 = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.94,
      roughness: 0.16,
    });
    const gimbal1Geo = new THREE.TorusGeometry(1.05, 0.038, 24, 120);
    const gimbal1 = new THREE.Mesh(gimbal1Geo, gimbalMat1);
    turbillionGroup.add(gimbal1);

    // Micro gear teeth around Gimbal 1
    const gearMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.2,
    });
    const toothGeo = new THREE.BoxGeometry(0.02, 0.07, 0.03);
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const tooth = new THREE.Mesh(toothGeo, gearMat);
      tooth.position.set(Math.cos(angle) * 1.08, Math.sin(angle) * 1.08, 0);
      tooth.rotation.z = angle;
      gimbal1.add(tooth);
    }

    // Gimbal Ring 2: Dark Obsidian Chrome Polar Ring
    const gimbalMat2 = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.98,
      roughness: 0.08,
    });
    const gimbal2Geo = new THREE.TorusGeometry(0.88, 0.03, 24, 120);
    const gimbal2 = new THREE.Mesh(gimbal2Geo, gimbalMat2);
    gimbal2.rotation.y = Math.PI / 4;
    turbillionGroup.add(gimbal2);

    // Gimbal Ring 3: Platinum Inner Gyro Ring
    const gimbalMat3 = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.92,
      roughness: 0.14,
    });
    const gimbal3Geo = new THREE.TorusGeometry(0.72, 0.022, 24, 120);
    const gimbal3 = new THREE.Mesh(gimbal3Geo, gimbalMat3);
    gimbal3.rotation.x = Math.PI / 3;
    turbillionGroup.add(gimbal3);

    // ── C. Central Quantum Prism Core (Deep Sapphire Singularity Nucleus) ──
    const innerGeo = new THREE.IcosahedronGeometry(0.5, 0);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x0369a1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      metalness: 0.25,
      roughness: 0.06,
      transmission: 0.65,
      ior: 1.62,
      thickness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 0.95,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    turbillionGroup.add(innerCore);

    // Counter-rotating delicate platinum micro-cage around nucleus
    const coreLatticeMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const coreLattice = new THREE.Mesh(innerGeo, coreLatticeMat);
    coreLattice.scale.set(1.04, 1.04, 1.04);
    innerCore.add(coreLattice);

    // Magnetic Chrome Chrono-Satellites
    const satGroup = new THREE.Group();
    const satGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      metalness: 0.98,
      roughness: 0.05,
    });
    const satMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      satGroup.add(sat);
      satMeshes.push(sat);
    }
    turbillionGroup.add(satGroup);

    // ── D. Outer Precision Chronology Astrolabe & Keplerian Orbit Tracks ──
    // Ring 1: Dual-Rail Aerospace Titanium Chronology Track
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.94,
      roughness: 0.18,
      emissive: 0x0369a1,
      emissiveIntensity: 0.2,
    });

    const ring1Geo = new THREE.TorusGeometry(2.35, 0.024, 24, 160);
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    masterGroup.add(ring1);

    // Companion Inner Rail
    const rail2Geo = new THREE.TorusGeometry(2.28, 0.012, 16, 160);
    const rail2Mat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.95,
      roughness: 0.12,
    });
    const rail2 = new THREE.Mesh(rail2Geo, rail2Mat);
    ring1.add(rail2);

    // Chronology Milestone Epoch Nodes orbiting on Ring 1 (ServiceNow, Freelance, Degree)
    const epochGroup = new THREE.Group();
    const epochAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
    const epochColors = [0x38bdf8, 0x818cf8, 0x34d399];
    const epochMeshes: THREE.Mesh[] = [];

    epochAngles.forEach((ang, idx) => {
      // Optical Glass Sphere with chrome bezel
      const epochGeo = new THREE.SphereGeometry(0.09, 20, 20);
      const epochMat = new THREE.MeshPhysicalMaterial({
        color: epochColors[idx],
        emissive: epochColors[idx],
        emissiveIntensity: 0.6,
        metalness: 0.5,
        roughness: 0.1,
        clearcoat: 1.0,
      });
      const epochNode = new THREE.Mesh(epochGeo, epochMat);
      epochNode.position.set(Math.cos(ang) * 2.35, Math.sin(ang) * 2.35, 0);

      // Saturnian Translucent Accretion Ring
      const haloGeo = new THREE.RingGeometry(0.12, 0.17, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: epochColors[idx],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      epochNode.add(halo);

      epochGroup.add(epochNode);
      epochMeshes.push(epochNode);
    });
    ring1.add(epochGroup);

    // 72-Tick Precision Graduation Astrolabe Dial
    const tickCount = 72;
    const tickGroup = new THREE.Group();
    const tickMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    for (let i = 0; i < tickCount; i++) {
      const a = (i / tickCount) * Math.PI * 2;
      const isMajor = i % 6 === 0;
      const isMedium = i % 2 === 0;
      const rInner = 2.35;
      const rOuter = 2.35 + (isMajor ? 0.13 : isMedium ? 0.07 : 0.04);
      const tickGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(Math.cos(a) * rInner, Math.sin(a) * rInner, 0),
        new THREE.Vector3(Math.cos(a) * rOuter, Math.sin(a) * rOuter, 0),
      ]);
      const tickLine = new THREE.Line(tickGeo, tickMat);
      tickGroup.add(tickLine);
    }
    ring1.add(tickGroup);

    // Ring 2: Dark Obsidian Chrome Orbit Track
    const ring2Geo = new THREE.TorusGeometry(2.65, 0.02, 20, 140);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.98,
      roughness: 0.1,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    masterGroup.add(ring2);

    // Ring 3: Fine Celestial Coordinate Ring
    const ring3Geo = new THREE.TorusGeometry(2.95, 0.014, 12, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.9,
      roughness: 0.25,
      transparent: true,
      opacity: 0.6,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 6;
    masterGroup.add(ring3);

    // ── E. Interactive Feature Nodes on the 3D Object ──
    const nodeGeo = new THREE.SphereGeometry(0.1, 18, 18);
    const hitBoxGeo = new THREE.SphereGeometry(0.38, 8, 8);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });

    const nodeMeshes: THREE.Mesh[] = [];
    const hitBoxes: THREE.Mesh[] = [];

    OBJECT_NODES.forEach((node) => {
      const isSelected = node.index === currentSectionRef.current;
      const mat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0x38bdf8 : 0x94a3b8,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, mat);
      nodeMesh.position.set(...node.pos);
      masterGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);

      // Subtle pulse ring around node
      const pulseRingGeo = new THREE.RingGeometry(0.14, 0.17, 24);
      const pulseRingMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
      pulseRing.lookAt(camera.position);
      nodeMesh.add(pulseRing);

      // Invisible hit-box for raycasting clicks
      const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      hitBox.position.set(...node.pos);
      hitBox.userData = { sectionIndex: node.index, label: node.label };
      masterGroup.add(hitBox);
      hitBoxes.push(hitBox);
    });

    hitBoxesRef.current = hitBoxes;

    // 8. Subtle Floating Stardust Ambient Points
    const starsCount = 200;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 16;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.035,
      transparent: true,
      opacity: 0.5,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 9. Animation Loop with Real 3D Camera Angles & Dynamic Smooth Lerp
    const clock = new THREE.Clock();
    const currentCameraPos = new THREE.Vector3().copy(camera.position);
    const targetCameraPos = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3().copy(cameraTarget);
    const targetLookAt = new THREE.Vector3();
    const currentCameraUp = new THREE.Vector3(0, 1, 0);
    const targetCameraUp = new THREE.Vector3(0, 1, 0);

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Retrieve target waypoint according to active section
      const activeWp = SECTION_WAYPOINTS[currentSectionRef.current] || SECTION_WAYPOINTS[0];
      const isMobileNow = (container.clientWidth || window.innerWidth) < 768;

      const targetX = isMobileNow ? 0 : activeWp.pos[0];
      const targetY = activeWp.pos[1] + (isMobileNow ? 0.6 : 0);
      const targetZ = activeWp.pos[2] + (isMobileNow ? 1.8 : 0);
      targetCameraPos.set(targetX, targetY, targetZ);

      const lookX = isMobileNow ? 0 : activeWp.target[0];
      const lookY = activeWp.target[1] + (isMobileNow ? 0.4 : 0);
      const lookZ = activeWp.target[2];
      targetLookAt.set(lookX, lookY, lookZ);

      // Camera Up vector with dynamic scroll banking
      scrollRollRef.current = THREE.MathUtils.lerp(scrollRollRef.current, 0, 0.06);
      const baseUp = activeWp.up || [0, 1, 0];
      targetCameraUp.set(baseUp[0] + scrollRollRef.current, baseUp[1], baseUp[2]);

      // Smooth camera interpolation in 3D coordinate space
      const lerpFactor = 0.055;
      currentCameraPos.lerp(targetCameraPos, lerpFactor);
      currentLookAt.lerp(targetLookAt, lerpFactor);
      currentCameraUp.lerp(targetCameraUp, lerpFactor);

      camera.position.copy(currentCameraPos);
      camera.up.copy(currentCameraUp);
      camera.lookAt(currentLookAt);

      // Dynamic FOV interpolation
      const targetFov = activeWp.fov || 45;
      if (Math.abs(camera.fov - targetFov) > 0.1) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.05);
        camera.updateProjectionMatrix();
      }

      // Idle rotation + user drag influence
      if (!isDraggingRef.current) {
        dragOffsetRef.current.x *= 0.94;
        dragOffsetRef.current.y *= 0.94;
      }

      frameMesh.rotation.y += 0.0028 + dragOffsetRef.current.x * 0.05;
      frameMesh.rotation.x += 0.0016 + dragOffsetRef.current.y * 0.05;

      // Internal Watchmaker Turbillion Dynamics
      gimbal1.rotation.z += 0.008;
      gimbal2.rotation.y -= 0.006;
      gimbal3.rotation.x += 0.004;

      // Magnetic Satellite Orbit Dynamics
      satMeshes.forEach((sat, i) => {
        const satAngle = elapsed * 1.8 + (i * Math.PI * 2) / 3;
        sat.position.set(Math.cos(satAngle) * 0.65, Math.sin(satAngle * 0.8) * 0.25, Math.sin(satAngle) * 0.65);
      });

      innerCore.rotation.y -= 0.0045;
      innerCore.rotation.x += 0.0025;

      // Pulse breathing
      const pulse = 1 + Math.sin(elapsed * 2.5) * 0.04;
      innerCore.scale.set(pulse, pulse, pulse);

      // Rings differential rotation
      ring1.rotation.z += 0.006;
      ring2.rotation.z -= 0.0045;
      ring3.rotation.x += 0.0028;

      // Chronology Orbit details dynamic glow & pulse
      const isChronologyActive = currentSectionRef.current === 4;
      if (isChronologyActive) {
        ringMat.emissive.setHex(0x0284c7);
        ringMat.emissiveIntensity = 0.75 + Math.sin(elapsed * 4) * 0.25;
        tickMat.opacity = 0.8;
        epochMeshes.forEach((mesh, idx) => {
          const s = 1.0 + Math.sin(elapsed * 3 + idx) * 0.25;
          mesh.scale.set(s, s, s);
        });
      } else {
        ringMat.emissive.setHex(0x0369a1);
        ringMat.emissiveIntensity = 0.2;
        tickMat.opacity = 0.35;
        epochMeshes.forEach(mesh => mesh.scale.set(1, 1, 1));
      }

      // Update node materials according to selected section
      nodeMeshes.forEach((mesh, idx) => {
        const isCurrent = idx === currentSectionRef.current;
        (mesh.material as THREE.MeshBasicMaterial).color.setHex(isCurrent ? 0x38bdf8 : 0x64748b);
        mesh.scale.setScalar(isCurrent ? 1.5 : 1.0);

        // Keep pulse ring visible ONLY for active section node
        const childRing = mesh.children[0] as THREE.Mesh | undefined;
        if (childRing && childRing.material) {
          (childRing.material as THREE.MeshBasicMaterial).visible = isCurrent;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize handler
    const onResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      frameGeo.dispose();
      frameMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      ring3Geo.dispose();
      ringMat.dispose();
      nodeGeo.dispose();
      hitBoxGeo.dispose();
      hitBoxMat.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  // Raycast helper for pointer position
  const raycastPointer = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current || !cameraRef.current || hitBoxesRef.current.length === 0) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(hitBoxesRef.current);
    if (intersects.length > 0) {
      const target = intersects[0].object;
      return {
        index: target.userData.sectionIndex as number,
        label: target.userData.label as string,
      };
    }
    return null;
  }, []);

  // Pointer drag + click handlers with Raycasting
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    pointerDownRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;

      dragOffsetRef.current = {
        x: deltaX * 0.008,
        y: deltaY * 0.008,
      };

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Hover detection when not dragging
      const hit = raycastPointer(e.clientX, e.clientY);
      if (hit) {
        setHoveredNode(hit);
        if (containerRef.current) containerRef.current.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    // Check if this was a Click (not a drag)
    const dx = Math.abs(e.clientX - pointerDownRef.current.x);
    const dy = Math.abs(e.clientY - pointerDownRef.current.y);
    const dt = Date.now() - pointerDownRef.current.time;

    if (dx < 6 && dy < 6 && dt < 400) {
      const hit = raycastPointer(e.clientX, e.clientY);
      if (hit && onSelectSectionRef.current) {
        onSelectSectionRef.current(hit.index);
      }
    }
  };

  const activeWaypoint = SECTION_WAYPOINTS[currentSection] || SECTION_WAYPOINTS[0];

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="absolute inset-0 w-full h-full touch-none select-none z-0"
    >
      {/* Floating Interactive Raycast Hover Tooltip */}
      {hoveredNode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-30 px-3.5 py-1.5 rounded-full bg-sky-950/85 border border-sky-400/50 backdrop-blur-md text-sky-300 text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.35)] flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span>Click to Zoom: {hoveredNode.label}</span>
        </div>
      )}
    </div>
  );
}
