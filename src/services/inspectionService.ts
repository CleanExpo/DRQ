import { 
  InspectionReport, 
  ClaimType,
  WaterDamageData,
  FireDamageData,
  MouldDamageData,
  InspectionReading,
  ImageData,
  VoiceNote
} from '../types/inspectionTypes';

export class InspectionService {
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static createNewReport(type: ClaimType): InspectionReport {
    const baseReport = {
      id: this.generateId(),
      type,
      status: 'draft' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: this.getInitialDataByType(type)
    };

    return baseReport;
  }

  private static getInitialDataByType(type: ClaimType): WaterDamageData | FireDamageData | MouldDamageData {
    const baseData = {
      clientDetails: {
        name: '',
        address: '',
        claimNumber: '',
        contactNumber: '',
        email: ''
      },
      technicianDetails: {
        name: '',
        certification: '',
        iicrcNumber: ''
      },
      dateOfInspection: new Date(),
      readings: [],
      images: [],
      voiceNotes: [],
      recommendations: []
    };

    switch (type) {
      case 'water':
        return {
          ...baseData,
          waterSource: '',
          affectedMaterials: [],
          categoryOfWater: 1,
          moistureMap: {
            url: '',
            description: 'Moisture mapping diagram'
          }
        };
      case 'fire':
        return {
          ...baseData,
          fireSource: '',
          smokeType: '',
          sootDeposits: [],
          structuralDamage: []
        };
      case 'mould':
        return {
          ...baseData,
          mouldType: '',
          affectedSurfaces: [],
          relativeHumidity: 0,
          airQualityReadings: []
        };
    }
  }

  static addReading(report: InspectionReport, reading: InspectionReading): InspectionReport {
    return {
      ...report,
      data: {
        ...report.data,
        readings: [...report.data.readings, reading]
      },
      updatedAt: new Date()
    };
  }

  static addImage(report: InspectionReport, image: ImageData): InspectionReport {
    return {
      ...report,
      data: {
        ...report.data,
        images: [...report.data.images, image]
      },
      updatedAt: new Date()
    };
  }

  static addVoiceNote(report: InspectionReport, note: VoiceNote): InspectionReport {
    return {
      ...report,
      data: {
        ...report.data,
        voiceNotes: [...report.data.voiceNotes, note]
      },
      updatedAt: new Date()
    };
  }

  static finalizeReport(report: InspectionReport): InspectionReport {
    return {
      ...report,
      status: 'completed',
      updatedAt: new Date()
    };
  }

  static validateReport(report: InspectionReport): string[] {
    const errors: string[] = [];

    // Basic validation
    if (!report.data.clientDetails.name) errors.push('Client name is required');
    if (!report.data.clientDetails.claimNumber) errors.push('Claim number is required');
    if (!report.data.technicianDetails.name) errors.push('Technician name is required');
    if (!report.data.technicianDetails.iicrcNumber) errors.push('IICRC number is required');

    // Type-specific validation
    switch (report.type) {
      case 'water':
        if (!(report.data as WaterDamageData).waterSource) {
          errors.push('Water source must be specified');
        }
        break;
      case 'fire':
        if (!(report.data as FireDamageData).fireSource) {
          errors.push('Fire source must be specified');
        }
        break;
      case 'mould':
        if (!(report.data as MouldDamageData).relativeHumidity) {
          errors.push('Relative humidity reading is required');
        }
        break;
    }

    return errors;
  }
}
