import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Satellite, Radio, Loader2, Activity, Wifi, Terminal as TerminalIcon } from 'lucide-react';
import { Satellite as SatelliteType, SatellitePass, SSHConnection } from './types';
import { SatelliteCard } from './components/SatelliteCard';
import { PassPrediction } from './components/PassPrediction';
import { RadarDisplay } from './components/RadarDisplay';
import { SatelliteStats } from './components/SatelliteStats';
import { NetworkScanner } from './components/NetworkScanner';
import { SSHTerminal } from './components/SSHTerminal';
import { indonesiaSatellites } from './data/indonesiaSatellites';

const STARLINK_API = 'https://api.spacexdata.com/v4/starlink';
const MAX_DISTANCE_KM = 500;

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, height: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const groundDistance = R * c;
  return Math.sqrt(Math.pow(groundDistance, 2) + Math.pow(height, 2));
}

function App() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [satellites, setSatellites] = useState<SatelliteType[]>([]);
  const [passes, setPasses] = useState<SatellitePass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showTerminal, setShowTerminal] = useState(false);

  const handleSSHConnect = (connection: SSHConnection) => {
    console.log('SSH Connection established:', connection.host);
  };

  const handleSSHDisconnect = () => {
    console.log('SSH Connection closed');
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (geoError) => {
        setError('Failed to get location. Please allow location access.');
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchStarlinkSatellites = async () => {
      try {
        const response = await axios.get(STARLINK_API);
        const starlinkSatellites = response.data
          .filter((sat: any) => sat.latitude && sat.longitude && sat.height_km)
          .map((sat: any) => ({
            id: sat.id,
            name: `Starlink-${sat.version}`,
            latitude: sat.latitude,
            longitude: sat.longitude,
            height_km: sat.height_km,
            velocity_kms: sat.velocity_kms,
            version: sat.version,
            launch: sat.launch,
            operator: 'SpaceX',
            status: 'active' as const,
            type: 'communication' as const,
            country: 'USA'
          }));

        const allSatellites = [...starlinkSatellites, ...indonesiaSatellites]
          .filter((sat: SatelliteType) => {
            const distance = calculateDistance(
              location.lat,
              location.lng,
              sat.latitude,
              sat.longitude,
              sat.height_km
            );
            return distance <= MAX_DISTANCE_KM;
          })
          .sort((a: SatelliteType, b: SatelliteType) => {
            const distA = calculateDistance(location.lat, location.lng, a.latitude, a.longitude, a.height_km);
            const distB = calculateDistance(location.lat, location.lng, b.latitude, b.longitude, b.height_km);
            return distA - distB;
          });

        setSatellites(allSatellites);
        setLastUpdate(new Date());

        const simulatedPasses = allSatellites.slice(0, 5).map((sat: SatelliteType) => {
          const now = Date.now();
          const randomFutureTime = now + (Math.random() * 12 * 60 * 60 * 1000);
          
          return {
            id: sat.id,
            name: `Starlink-${sat.version}`,
            passStartTime: randomFutureTime,
            passEndTime: randomFutureTime + (Math.random() * 15 * 60 * 1000),
            maxElevation: Math.random() * 90,
            duration: Math.random() * 900
          };
        });

        setPasses(simulatedPasses.sort((a, b) => a.passStartTime - b.passStartTime));
        setLoading(false);
      } catch (err) {
        setError('Failed to load satellite data. Please check your internet connection and try again.');
        setLoading(false);
      }
    };

    fetchStarlinkSatellites();
    const interval = setInterval(fetchStarlinkSatellites, 30000);
    return () => clearInterval(interval);
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
          <p className="text-white text-lg">Loading Starlink satellite data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="bg-red-500/20 rounded-xl p-6 border border-red-500/20">
            <p className="text-white mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Satellite className="w-10 h-10 text-cyan-400 pulse-animation" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Satellite LiteFire
              </h1>
              {location && (
                <div className="text-gray-400 text-sm mt-1">
                  Location: {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}° | 
                  Last Update: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
          
          <SatelliteStats satellites={satellites} />
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Radio className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold">Satellite Radar</h2>
              </div>
              <RadarDisplay satellites={satellites} currentLocation={location} />
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TerminalIcon className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-semibold">SSH Terminal</h2>
                </div>
                <button
                  onClick={() => setShowTerminal(!showTerminal)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    showTerminal
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}
                >
                  {showTerminal ? 'Close Terminal' : 'Open Terminal'}
                </button>
              </div>
              {showTerminal && (
                <SSHTerminal
                  onConnect={handleSSHConnect}
                  onDisconnect={handleSSHDisconnect}
                />
              )}
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Wifi className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold">Network Scanner</h2>
              </div>
              <NetworkScanner />
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold">Active Satellites</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {satellites.slice(0, 4).map((satellite) => (
                  <SatelliteCard key={satellite.id} satellite={satellite} />
                ))}
              </div>
            </section>
          </div>
        </main>

        <section className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/20">
          <div className="flex items-center gap-3 mb-6">
            <Wifi className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold">Pass Predictions ({passes.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {passes.map((pass, index) => (
              <PassPrediction key={`${pass.id}-${index}`} pass={pass} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;