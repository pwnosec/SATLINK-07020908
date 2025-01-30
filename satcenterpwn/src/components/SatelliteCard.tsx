import React from 'react';
import { Satellite as SatelliteIcon, Gauge, Navigation, Signal } from 'lucide-react';
import { Satellite } from '../types';
import { ParabolaDisplay } from './ParabolaDisplay';

interface Props {
  satellite: Satellite;
}

export const SatelliteCard: React.FC<Props> = ({ satellite }) => {
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group">
      <ParabolaDisplay satellite={satellite} />
      
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <SatelliteIcon className="w-6 h-6 text-cyan-400 group-hover:animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {satellite.name}
              </h3>
              <p className="text-sm text-gray-400">{satellite.operator}</p>
            </div>
          </div>
          <Signal className="w-5 h-5 text-cyan-400/70" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 p-3 bg-white/5 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-300">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">{satellite.velocity_kms.toFixed(1)} km/s</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">{Math.round(satellite.height_km)} km</span>
            </div>
          </div>
          
          <div className="space-y-2 text-right">
            <div className="text-gray-400 text-sm">
              {satellite.latitude.toFixed(2)}° N
            </div>
            <div className="text-gray-400 text-sm">
              {satellite.longitude.toFixed(2)}° E
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-cyan-400/70 border-t border-white/10 pt-3">
          <span>Launch: {satellite.launch}</span>
          {satellite.frequency && (
            <span className="px-2 py-1 bg-cyan-500/10 rounded-full">
              {satellite.frequency}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};