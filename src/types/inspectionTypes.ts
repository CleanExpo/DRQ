export type ClaimType = 'water' | 'fire' | 'mould';

export interface ClientDetails {
  name: string;
  address: string;
  claimNumber: string;
  contactNumber: string;
  email: string;
}

export interface TechnicianDetails {
  name: string;
  certification: string;
  iicrcNumber: string;
}

export interface InspectionReading {
  type: 'moisture' | 'temperature' | 'humidity';
  value: number;
  unit: string;
  location: string;
  timestamp: Date;
}

export interface ImageData {
  url: string;
  description: string;
  annotations?: {
    x: number;
    y: number;
    note: string;
  }[];
}

export interface VoiceNote {
  url: string;
  transcription: string;
  timestamp: Date;
}

export interface BaseInspectionData {
  clientDetails: ClientDetails;
  technicianDetails: TechnicianDetails;
  dateOfInspection: Date;
  readings: InspectionReading[];
  images: ImageData[];
  voiceNotes: VoiceNote[];
  recommendations: string[];
}

export interface WaterDamageData extends BaseInspectionData {
  waterSource: string;
  affectedMaterials: string[];
  categoryOfWater: 1 | 2 | 3;
  moistureMap: ImageData;
}

export interface FireDamageData extends BaseInspectionData {
  fireSource: string;
  smokeType: string;
  sootDeposits: string[];
  structuralDamage: string[];
}

export interface MouldDamageData extends BaseInspectionData {
  mouldType: string;
  affectedSurfaces: string[];
  relativeHumidity: number;
  airQualityReadings: InspectionReading[];
}

export type InspectionReport = {
  id: string;
  type: ClaimType;
  status: 'draft' | 'completed' | 'reviewed';
  data: WaterDamageData | FireDamageData | MouldDamageData;
  createdAt: Date;
  updatedAt: Date;
};
