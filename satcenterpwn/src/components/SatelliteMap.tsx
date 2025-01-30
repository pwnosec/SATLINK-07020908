import React from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Satellite } from '../types';
import { Satellite as SatelliteIcon } from 'lucide-react';

interface Props {
  satellites: Satellite[];
  selectedSatellite: Satellite | null;
  onSelectSatellite: (satellite: Satellite | null) => void;
}

export const SatelliteMap: React.FC<Props> = ({
  satellites,
  selectedSatellite,
  onSelectSatellite,
}) => {
  return (
    <div className="h-[500px] rounded-xl overflow-hidden border border-cyan-500/20">
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 117.0,
          latitude: -2.0,
          zoom: 4
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        {satellites.map((satellite) => (
          <Marker
            key={satellite.id}
            longitude={satellite.longitude}
            latitude={satellite.latitude}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onSelectSatellite(satellite);
            }}
          >
            <div className="relative group cursor-pointer">
              <SatelliteIcon
                className={`w-6 h-6 ${
                  satellite.status === 'active'
                    ? 'text-green-400'
                    : satellite.status === 'standby'
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-current animate-ping" />
            </div>
          </Marker>
        ))}

        {selectedSatellite && (
          <Popup
            longitude={selectedSatellite.longitude}
            latitude={selectedSatellite.latitude}
            onClose={() => onSelectSatellite(null)}
            closeButton={true}
            closeOnClick={false}
            className="satellite-popup"
          >
            <div className="p-2">
              <h3 className="text-lg font-semibold mb-2">Starlink-{selectedSatellite.version}</h3>
              <div className="space-y-1 text-sm">
                <p>Operator: {selectedSatellite.operator}</p>
                <p>Type: {selectedSatellite.type}</p>
                <p>Height: {selectedSatellite.height_km.toFixed(1)} km</p>
                <p>Speed: {selectedSatellite.velocity_kms.toFixed(1)} km/s</p>
                {selectedSatellite.frequency && (
                  <p>Frequency: {selectedSatellite.frequency}</p>
                )}
                <p className="mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedSatellite.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : selectedSatellite.status === 'standby'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {selectedSatellite.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};