import React, { useState, useEffect } from 'react';
import { Wifi, Bluetooth, Nfc, Signal, Lock, Radio } from 'lucide-react';
import { WifiNetwork, BluetoothDevice, RFIDTag } from '../types';

// Simulated data generators
const generateWifiNetworks = (): WifiNetwork[] => {
  const networks = [
    { ssid: 'Home_Network_5G', strength: 90, security: 'WPA3', frequency: '5GHz', channel: 36 },
    { ssid: 'Office_WiFi', strength: 75, security: 'WPA2', frequency: '2.4GHz', channel: 6 },
    { ssid: 'Guest_Network', strength: 60, security: 'WPA2', frequency: '2.4GHz', channel: 11 },
    { ssid: 'IoT_Network', strength: 85, security: 'WPA2', frequency: '2.4GHz', channel: 1 },
  ].map(n => ({
    ...n,
    lastSeen: new Date()
  }));
  return networks;
};

const generateBluetoothDevices = (): BluetoothDevice[] => {
  const devices = [
    { name: 'Galaxy Buds Pro', macAddress: '00:1B:44:11:3A:B7', rssi: -65, type: 'Audio' },
    { name: 'iPhone 13', macAddress: '00:1A:7D:DA:71:13', rssi: -72, type: 'Phone' },
    { name: 'Smart Watch', macAddress: '00:1B:44:11:3A:B8', rssi: -58, type: 'Wearable' },
  ].map(d => ({
    ...d,
    lastSeen: new Date()
  }));
  return devices;
};

const generateRFIDTags = (): RFIDTag[] => {
  const tags = [
    { id: 'RF001', type: 'ISO 14443A', protocol: 'NFC-A', distance: 0.05 },
    { id: 'RF002', type: 'ISO 15693', protocol: 'NFC-V', distance: 0.08 },
  ].map(t => ({
    ...t,
    lastSeen: new Date()
  }));
  return tags;
};

export const NetworkScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wifi' | 'bluetooth' | 'rfid'>('wifi');
  const [wifiNetworks, setWifiNetworks] = useState<WifiNetwork[]>([]);
  const [bluetoothDevices, setBluetoothDevices] = useState<BluetoothDevice[]>([]);
  const [rfidTags, setRfidTags] = useState<RFIDTag[]>([]);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scanning) {
        setWifiNetworks(generateWifiNetworks());
        setBluetoothDevices(generateBluetoothDevices());
        setRfidTags(generateRFIDTags());
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [scanning]);

  const getSignalStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-400';
    if (strength >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-cyan-500/20 overflow-hidden">
      <div className="flex border-b border-cyan-500/20">
        <button
          className={`flex items-center gap-2 px-6 py-4 ${
            activeTab === 'wifi' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('wifi')}
        >
          <Wifi className="w-4 h-4" />
          <span>WiFi</span>
        </button>
        <button
          className={`flex items-center gap-2 px-6 py-4 ${
            activeTab === 'bluetooth' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('bluetooth')}
        >
          <Bluetooth className="w-4 h-4" />
          <span>Bluetooth</span>
        </button>
        <button
          className={`flex items-center gap-2 px-6 py-4 ${
            activeTab === 'rfid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('rfid')}
        >
          <Nfc className="w-4 h-4" />
          <span>RFID</span>
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            {activeTab === 'wifi' && 'Available Networks'}
            {activeTab === 'bluetooth' && 'Bluetooth Devices'}
            {activeTab === 'rfid' && 'RFID Tags'}
          </h3>
          <button
            onClick={() => setScanning(!scanning)}
            className={`px-4 py-2 rounded-lg text-sm ${
              scanning
                ? 'bg-green-500/20 text-green-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {scanning ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>

        <div className="space-y-3">
          {activeTab === 'wifi' && wifiNetworks.map((network, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Signal className={`w-5 h-5 ${getSignalStrengthColor(network.strength)}`} />
                  <div>
                    <div className="text-white font-medium">{network.ssid}</div>
                    <div className="text-gray-400 text-sm">
                      {network.frequency} - Ch {network.channel}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-400 text-sm">{network.security}</span>
                  <span className="text-cyan-400 font-medium">{network.strength}%</span>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'bluetooth' && bluetoothDevices.map((device, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Radio className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">{device.name}</div>
                    <div className="text-gray-400 text-sm">{device.macAddress}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{device.type}</span>
                  <span className="text-blue-400 font-medium">{device.rssi} dBm</span>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'rfid' && rfidTags.map((tag, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Nfc className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">{tag.id}</div>
                    <div className="text-gray-400 text-sm">{tag.protocol}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{tag.type}</span>
                  <span className="text-purple-400 font-medium">{tag.distance.toFixed(2)}m</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};