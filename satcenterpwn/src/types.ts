export interface Satellite {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  height_km: number;
  velocity_kms: number;
  version: string;
  launch: string;
  operator: string;
  frequency?: string;
  status: 'active' | 'inactive' | 'standby';
  type: 'communication' | 'navigation' | 'observation' | 'other';
  country: string;
}

// ... (keep other existing interfaces)