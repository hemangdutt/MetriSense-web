import React from 'react';

interface AshokaChakraMarkProps {
  size?: number;
  className?: string;
}

/**
 * Restrained, flat 24-spoke Ashoka Chakra institutional emblem
 * No gradients, no glow, no 3D effects — pure architectural geometry
 */
export const AshokaChakraMark: React.FC<AshokaChakraMarkProps> = ({
  size = 28,
  className = '',
}) => {
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Ashoka Chakra Government Emblem"
    >
      {/* Outer Rim */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="currentColor"
        strokeWidth="3.2"
      />
      {/* Inner Rim */}
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Central Hub */}
      <circle cx="32" cy="32" r="5" fill="currentColor" />
      {/* 24 Spokes + Rim Nodes */}
      {spokes.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 32 + 24 * Math.cos(rad);
        const y2 = 32 + 24 * Math.sin(rad);
        const dotRad = ((angle + 7.5) * Math.PI) / 180;
        const dotX = 32 + 24 * Math.cos(dotRad);
        const dotY = 32 + 24 * Math.sin(dotRad);
        return (
          <g key={angle}>
            <line
              x1="32"
              y1="32"
              x2={x2.toFixed(2)}
              y2={y2.toFixed(2)}
              stroke="currentColor"
              strokeWidth="1.35"
            />
            <circle
              cx={dotX.toFixed(2)}
              cy={dotY.toFixed(2)}
              r="1.15"
              fill="currentColor"
            />
          </g>
        );
      })}
    </svg>
  );
};
