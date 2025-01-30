import React from 'react';
import { Satellite } from '../types';

interface Props {
  satellite: Satellite;
}

export const ParabolaDisplay: React.FC<Props> = ({ satellite }) => {
  return (
    <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-cyan-500/20">
      <div className="absolute inset-0">
        {/* Parabola Path */}
        <svg
          className="w-full h-full"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 200 Q 200 0 400 200"
            fill="none"
            stroke="rgba(0, 255, 255, 0.2)"
            strokeWidth="2"
          />
          {/* Satellite Position on Parabola */}
          <circle
            cx="200"
            cy="100"
            r="4"
            fill="#00ffff"
            className="animate-pulse"
          />
          {/* Signal Beams */}
          <line
            x1="200"
            y1="100"
            x2="150"
            y2="200"
            stroke="rgba(0, 255, 255, 0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="200"
            y1="100"
            x2="250"
            y2="200"
            stroke="rgba(0, 255, 255, 0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="text-cyan-400 text-sm">
          Altitude: {Math.round(satellite.height_km)} km
        </div>
        <div className="text-gray-400 text-xs">
          Speed: {satellite.velocity_kms.toFixed(1)} km/s
        </div>
      </div>
    </div>
  );
};