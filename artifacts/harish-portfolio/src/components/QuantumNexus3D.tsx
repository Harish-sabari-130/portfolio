import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface QuantumNexus3DProps {
  className?: string;
}

export default function QuantumNexus3D({ className = '' }: QuantumNexus3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);
  
  const [isInteracting, setIsInteracting] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [telemetry, setTelemetry] = useState({ rotX: 0, rotY: 0, fps: 60 });
  const [coreMode, setCoreMode] = useState<'cyan' | 'purple' | 'matrix'>('cyan');

  // Interactive mouse/touch tracking refs
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isDraggingRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.5;

    // 3. Renderer with antialias and alpha
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0a192f, 1.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00d4ff, 3.5, 50);
    cyanLight.position.set(4, 5, 4);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0xbd93f9, 3.0, 50);
    violetLight.position.set(-4, -5, -3);
    scene.add(violetLight);

    const coreLight = new THREE.PointLight(0x00ffff, 2.5, 10);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Master 3D Nexus Group
    const nexusGroup = new THREE.Group();
    scene.add(nexusGroup);

    // 5. Central Quantum Core (Dual Icosahedrons)
    // Outer wireframe icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(1.7, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const outerIcosa = new THREE.Mesh(outerGeo, outerMat);
    nexusGroup.add(outerIcosa);

    // Inner solid faceted icosahedron
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x081b33,
      emissive: 0x0066aa,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.85,
      flatShading: true,
      transparent: true,
      opacity: 0.85,
    });
    const innerIcosa = new THREE.Mesh(innerGeo, innerMat);
    nexusGroup.add(innerIcosa);

    // Core pulsing energy sphere
    const pulseGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      wireframe: true,
    });
    const pulseSphere = new THREE.Mesh(pulseGeo, pulseMat);
    nexusGroup.add(pulseSphere);

    // Luminous vertex nodes on outer icosahedron
    const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const posAttribute = outerGeo.getAttribute('position');
    const nodesGroup = new THREE.Group();
    for (let i = 0; i < posAttribute.count; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(posAttribute.getX(i), posAttribute.getY(i), posAttribute.getZ(i));
      nodesGroup.add(node);
    }
    outerIcosa.add(nodesGroup);

    // 6. Gyroscopic Orbital Rings (Torus)
    // Ring 1 (Cyan)
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.022, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.9,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    nexusGroup.add(ring1);

    // Ring 2 (Purple)
    const ring2Geo = new THREE.TorusGeometry(2.7, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xbd93f9,
      emissive: 0xbd93f9,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.9,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    nexusGroup.add(ring2);

    // Ring 3 (Outer Accent Dotted Ring)
    const ring3Geo = new THREE.TorusGeometry(3.05, 0.015, 8, 64);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x4d94ff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 6;
    nexusGroup.add(ring3);

    // 7. Orbiting Data Nodes / Satellites
    const satellites: THREE.Mesh[] = [];
    const satGeo = new THREE.OctahedronGeometry(0.12);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    for (let i = 0; i < 4; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      nexusGroup.add(sat);
      satellites.push(sat);
    }

    // 8. Swirling Quantum Particle Dust
    const particleCount = 220;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      particleScales[i] = Math.random() * 0.8 + 0.2;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    nexusGroup.add(particles);

    // 9. Animation Loop
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsUpdate = 0;

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // FPS Calculation
      frameCount++;
      if (elapsedTime - lastFpsUpdate > 0.5) {
        setTelemetry(prev => ({
          ...prev,
          fps: Math.round(frameCount / (elapsedTime - lastFpsUpdate)),
          rotX: Number((nexusGroup.rotation.x * (180 / Math.PI) % 360).toFixed(1)),
          rotY: Number((nexusGroup.rotation.y * (180 / Math.PI) % 360).toFixed(1)),
        }));
        frameCount = 0;
        lastFpsUpdate = elapsedTime;
      }

      // Smooth inertia rotation from mouse position
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Base auto-rotation influenced by user input
      const speedMultiplier = isDraggingRef.current ? 0.3 : rotationSpeed;
      nexusGroup.rotation.y += 0.008 * speedMultiplier + mouseRef.current.x * 0.02;
      nexusGroup.rotation.x += 0.004 * speedMultiplier + mouseRef.current.y * 0.02;

      // Individual component rotations for complex cyber gyroscopic feel
      outerIcosa.rotation.x -= 0.005;
      outerIcosa.rotation.z += 0.004;

      innerIcosa.rotation.y += 0.012;
      innerIcosa.rotation.x += 0.008;

      // Pulse core scaling (breathing heartbeat)
      const pulseScale = 1 + Math.sin(elapsedTime * 3) * 0.12;
      pulseSphere.scale.set(pulseScale, pulseScale, pulseScale);

      // Rings differential rotations
      ring1.rotation.z += 0.015;
      ring1.rotation.x += 0.005;

      ring2.rotation.z -= 0.012;
      ring2.rotation.y += 0.008;

      ring3.rotation.x += 0.004;
      ring3.rotation.z += 0.006;

      // Orbiting satellites
      satellites.forEach((sat, idx) => {
        const angle = elapsedTime * 0.8 + (idx * Math.PI) / 2;
        const orbitR = 2.5 + (idx % 2) * 0.4;
        sat.position.x = Math.cos(angle) * orbitR;
        sat.position.z = Math.sin(angle) * orbitR;
        sat.position.y = Math.sin(angle * 2) * 0.5;
        sat.rotation.x += 0.03;
        sat.rotation.y += 0.02;
      });

      // Swirling particles
      particles.rotation.y -= 0.002;
      particles.rotation.x += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    // Clean up
    return () => {
      resizeObserver.disconnect();
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      satGeo.dispose();
      satMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [rotationSpeed]);

  // Pointer event handlers for drag-to-rotate in 3D
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsInteracting(true);
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normalX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normalY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    mouseRef.current.targetX = normalX * 0.8;
    mouseRef.current.targetY = normalY * 0.8;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousPointerPosRef.current.x;
      const deltaY = e.clientY - previousPointerPosRef.current.y;

      mouseRef.current.x += deltaX * 0.015;
      mouseRef.current.y -= deltaY * 0.015;

      previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    setIsInteracting(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already lost
    }
  };

  return (
    <div
      className={`relative w-full aspect-square max-w-[340px] sm:max-w-[420px] md:max-w-[480px] mx-auto select-none ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Outer ambient holographic glow */}
      <div
        className="absolute -inset-4 sm:-inset-8 rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: isInteracting
            ? 'radial-gradient(circle, rgba(0,212,255,0.22) 0%, rgba(189,147,249,0.12) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(0,212,255,0.14) 0%, rgba(189,147,249,0.06) 50%, transparent 70%)',
          filter: 'blur(16px)',
        }}
      />

      {/* Cyber Reticle HUD Brackets */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top-left corner */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#00d4ff]/60" />
        {/* Top-right corner */}
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#00d4ff]/60" />
        {/* Bottom-left corner */}
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#00d4ff]/60" />
        {/* Bottom-right corner */}
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#00d4ff]/60" />

        {/* Outer Circular Reticle */}
        <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="47" fill="none" stroke="#00d4ff" strokeWidth="0.5" strokeDasharray="4 6" />
          <circle cx="50" cy="50" r="41" fill="none" stroke="#bd93f9" strokeWidth="0.3" strokeDasharray="1 5" />
          <line x1="50" y1="2" x2="50" y2="8" stroke="#00d4ff" strokeWidth="1" />
          <line x1="50" y1="92" x2="50" y2="98" stroke="#00d4ff" strokeWidth="1" />
          <line x1="2" y1="50" x2="8" y2="50" stroke="#00d4ff" strokeWidth="1" />
          <line x1="92" y1="50" x2="98" y2="50" stroke="#00d4ff" strokeWidth="1" />
        </svg>
      </div>

      {/* 3D Canvas Mount */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full touch-none rounded-2xl overflow-hidden relative z-0"
      />

      {/* Real-time Cyber HUD Telemetry Chips */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1 font-mono text-[9px] text-[#00d4ff]/80">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#050816]/80 border border-[#00d4ff]/30 backdrop-blur-md rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-ping" />
          <span>QUANTUM_CORE: ACTIVE</span>
        </div>
        <div className="hidden sm:block text-[8px] text-muted-foreground/80 pl-1">
          POS: [X:{telemetry.rotX}° Y:{telemetry.rotY}°]
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 pointer-events-none flex flex-col items-end gap-1 font-mono text-[9px] text-[#bd93f9]/80">
        <div className="px-2 py-0.5 bg-[#050816]/80 border border-[#bd93f9]/30 backdrop-blur-md rounded-sm">
          <span>FREQ: 120.4 THz</span>
        </div>
        <div className="hidden sm:block text-[8px] text-muted-foreground/80 pr-1">
          FPS: {telemetry.fps}
        </div>
      </div>

      {/* Bottom Interactive Prompt & Speed Selector */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto font-mono text-[10px]">
        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#050816]/85 border border-[#00d4ff]/30 backdrop-blur-md text-[#00d4ff] text-[9px] sm:text-[10px] rounded-sm shadow-[0_0_10px_rgba(0,212,255,0.15)]">
          <span className="animate-pulse">◈</span>
          <span>DRAG TO INSPECT 3D</span>
        </div>

        <div className="flex items-center gap-1 bg-[#050816]/85 border border-[#00d4ff]/20 backdrop-blur-md p-0.5 rounded-sm">
          <button
            onClick={() => setRotationSpeed(s => (s === 1 ? 2.5 : s === 2.5 ? 0.3 : 1))}
            className="px-2 py-0.5 hover:bg-[#00d4ff]/15 text-[#00d4ff] text-[9px] transition-colors rounded-sm cursor-pointer"
            title="Toggle rotation velocity"
            data-interactive="true"
          >
            {rotationSpeed === 1 ? '1.0x' : rotationSpeed === 2.5 ? '2.5x' : '0.3x'}
          </button>
        </div>
      </div>
    </div>
  );
}
