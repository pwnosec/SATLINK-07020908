import React from 'react';
import { format } from 'date-fns';
import { Timer, Compass, ArrowUp } from 'lucide-react';
import { SatellitePass } from '../types';

interface Props {
  pass: SatellitePass;
}

export const PassPrediction: React.FC<Props> = ({ pass }) => {
  const progress = ((Date.now() - pass.passStartTime) / (pass.passEndTime - pass.passStartTime)) * 100;
  const isActive = progress >= 0 && progress <= 100;

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl p-5 border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{pass.name}</h3>
        {isActive && (
          <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
            Active
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-3 mb-2">
            <Timer className="w-4 h-4 text-cyan-400" />
            <div className="text-sm text-gray-300">
              {format(pass.passStartTime, 'HH:mm:ss')} - {format(pass.passEndTime, 'HH:mm:ss')}
            </div>
          </div>
          
          {isActive && (
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <div className="text-sm text-gray-300">
              {pass.maxElevation.toFixed(1)}°
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ArrowUp className="w-4 h-4 text-cyan-400" />
            <div className="text-sm text-gray-300">
              {Math.round(pass.duration)}s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};