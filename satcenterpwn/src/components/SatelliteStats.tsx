import React from 'react';
import { Satellite } from '../types';
import { Activity, Signal, Wifi, Satellite as SatelliteIcon } from 'lucide-react';

interface Props {
  satellites: Satellite[];
}

export const SatelliteStats: React.FC<Props> = ({ satellites }) => {
  const averageHeight = satellites.reduce((acc, sat) => acc + sat.height_km, 0) / satellites.length;
  const averageSpeed = satellites.reduce((acc, sat) => acc + sat.velocity_kms, 0) / satellites.length;

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl p-5 border border-cyan-500/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Activity className="w-5 h-5 text-green-400" />}
          label="Active Satellites"
          value={satellites.length.toString()}
        />
        <StatCard
          icon={<Signal className="w-5 h-5 text-cyan-400" />}
          label="Avg. Height"
          value={`${averageHeight.toFixed(0)} km`}
        />
        <StatCard
          icon={<Wifi className="w-5 h-5 text-blue-400" />}
          label="Avg. Speed"
          value={`${averageSpeed.toFixed(1)} km/s`}
        />
        <StatCard
          icon={<SatelliteIcon className="w-5 h-5 text-purple-400" />}
          label="Coverage"
          value="98.5%"
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <span className="text-sm text-gray-400">{label}</span>
    </div>
    <div className="text-xl font-semibold text-white">{value}</div>
  </div>
);