import React from "react";

// Grid utility functions - EXACTLY as your original
const createGridSVG = (spacing: number, strokeWidth: number = 1.33) => {
  const width = 1441;
  const height = 673;
  let paths = '';
  
  // Generate horizontal lines
  for (let y = 1; y < height; y += spacing) {
    paths += `<path d="M0 ${y}H${width}" stroke="#84CECB" stroke-width="${strokeWidth}" />`;
  }
  
  // Generate vertical lines
  for (let x = 14; x < width; x += spacing) {
    paths += `<path d="M${x} 1.66589V${height}" stroke="#84CECB" stroke-width="${strokeWidth}" />`;
  }
  
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>${paths}</g>
    </svg>
  `;
};

// Pre-generated grid patterns - EXACTLY as your original
const GRID_PATTERNS = {
  fine: createGridSVG(20, 1),
  normal: createGridSVG(31, 1.33),
  wide: createGridSVG(50, 1.5),
  original: createGridSVG(31, 1.33) // Based on your original BGGridLines spacing
};

// Grid background component - EXACTLY as your original
interface GridBackgroundProps {
  pattern: keyof typeof GRID_PATTERNS;
  opacity?: number;
}

const MobileGridBackground: React.FC<GridBackgroundProps> = ({
  pattern,
  opacity = 0.1
}) => {
  const svgContent = GRID_PATTERNS[pattern];

  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgContent)}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        opacity // ✅ Apply opacity directly here
      }}
    />
  );
};

const DesktopGridBackground: React.FC<GridBackgroundProps> = ({
  pattern,

}) => {
  const svgContent = GRID_PATTERNS[pattern];
  
  return (
    <div 
      className="absolute inset-0 w-full h-[99.9%] pointer-events-none z-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgContent)}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto'
      }}
    />
  );
};


// Simple opacity overlay that works on iOS Safari
interface OpacityOverlayProps {
  opacity: number;
}

const OpacityOverlay: React.FC<OpacityOverlayProps> = ({ opacity }) => {
  // Calculate the overlay alpha to reduce grid visibility
  const overlayAlpha = 1 - opacity;
  
  return (
    <div 
      className="absolute inset-0 w-full  pointer-events-none"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})`,
        zIndex: 1,
        // iOS Safari specific fixes
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        // Force layer creation
        willChange: 'transform',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
};


// Main grid wrapper component - simplified
interface GridWrapperProps {
  children: React.ReactNode;
  gridPattern?: keyof typeof GRID_PATTERNS;
  gridOpacity?: number;
  className?: string;
}

export const GridWrapper: React.FC<GridWrapperProps> = ({
  children,
  gridPattern = 'normal',
  gridOpacity = 0.07,
  className = ""
}) => (
  <div className={`relative ${className}`}>

    {/* Desktop version with separate overlay */}
    <div className="hidden sm:block">
      <DesktopGridBackground pattern={gridPattern} />
      <OpacityOverlay opacity={gridOpacity} />
    </div>

    {/* Mobile version with inline opacity */}
    <div className="block sm:hidden">
      <MobileGridBackground pattern={gridPattern} opacity={gridOpacity} />
      <OpacityOverlay opacity={gridOpacity} />
    </div>

    {/* Content layer */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);