import React, { useEffect, useState } from 'react';
import { Satellite } from '../types';

interface Props {
  satellites: Satellite[];
  currentLocation: { lat: number; lng: number } | null;
}

export const RadarDisplay: React.FC<Props> = ({ satellites, currentLocation }) => {
  const [dots, setDots] = useState<Array<{ x: number; y: number; id: string }>>([]);

  useEffect(() => {
    if (!currentLocation) return;

    const newDots = satellites.map(sat => {
      const latDiff = sat.latitude - currentLocation.lat;
      const lngDiff = sat.longitude - currentLocation.lng;
      const x = (lngDiff / 180) * 0.8;
      const y = (latDiff / 90) * 0.8;
      
      return {
        x: x * 150 + 150,
        y: y * 150 + 150,
        id: sat.id
      };
    });

    setDots(newDots);
  }, [satellites, currentLocation]);

  return (
    <div className="relative bg-black/40 p-6 rounded-xl border border-cyan-500/20">
      <div className="radar-grid">
        <div className="radar-circles"></div>
        <div className="radar-line radar-animation"></div>
        
        {/* Center Point */}
        <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-cyan-400/50 rounded-full transform -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping"></div>
        </div>
        
        {/* Satellite Dots */}
        {dots.map(dot => (
          <div
            key={dot.id}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${dot.x}px`,
              top: `${dot.y}px`,
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
              animation: 'blink 2s ease-in-out infinite'
            }}
          >
            <div className="absolute -inset-1 bg-cyan-400/30 rounded-full animate-pulse"></div>
          </div>
        ))}
        
        {/* Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="border border-cyan-500/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
};