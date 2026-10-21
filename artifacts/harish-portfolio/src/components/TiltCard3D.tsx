import React, { useRef, useState, useCallback } from 'react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
  scaleOnHover?: number;
}

export default function TiltCard3D({
  children,
  className = '',
  maxTilt = 12,
  glareOpacity = 0.22,
  scaleOnHover = 1.02,
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalised between -0.5 and 0.5
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;

    // Invert Y for correct natural 3D tilt
    const rotX = -normY * maxTilt;
    const rotY = normX * maxTilt;

    setTilt({
      x: rotX,
      y: rotY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  }, [maxTilt]);

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="w-full h-full relative transition-transform duration-200 ease-out will-change-transform rounded-sm overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, 1)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {children}

        {/* Specular 3D Light Glare Overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-sm"
          style={{
            opacity: isHovered ? glareOpacity : 0,
            background: `radial-gradient(circle 280px at ${tilt.glareX}% ${tilt.glareY}%, rgba(0, 212, 255, 0.4), transparent 80%)`,
            mixBlendMode: 'screen',
            transform: 'translateZ(20px)',
          }}
        />

        {/* Cyber Hologram Rim Edge Light */}
        <div
          className="absolute inset-0 pointer-events-none border border-transparent transition-all duration-300 rounded-sm"
          style={{
            borderColor: isHovered ? 'rgba(0, 212, 255, 0.4)' : 'transparent',
            boxShadow: isHovered ? '0 0 25px rgba(0, 212, 255, 0.2), inset 0 0 15px rgba(0, 212, 255, 0.08)' : 'none',
          }}
        />
      </div>
    </div>
  );
}
