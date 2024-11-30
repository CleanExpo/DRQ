export interface EmergencyAlert {
  id: string;
  message: string;
  severity: EmergencySeverity;
  location?: string;
  timestamp: Date;
  expiresAt?: Date;
  contactNumber: string;
}

export enum EmergencySeverity {
  CRITICAL = 'CRITICAL',   // Life-threatening situations
  HIGH = 'HIGH',          // Severe property damage
  MEDIUM = 'MEDIUM',      // Moderate damage or risk
  LOW = 'LOW'            // General alerts
}

export interface IEmergencyService {
  // Get current active emergency alerts
  getCurrentAlerts(): EmergencyAlert[];
  
  // Get emergency contact information
  getEmergencyContact(): string;
  
  // Check if there are any critical alerts
  hasCriticalAlerts(): boolean;
  
  // Subscribe to emergency alerts
  subscribeToAlerts(callback: (alerts: EmergencyAlert[]) => void): () => void;
}

// Types for emergency response areas
export interface ServiceArea {
  name: string;
  isActive: boolean;
  responseTime: string;
  contactNumber: string;
}
