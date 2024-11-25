'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InspectionReport, ClaimType, ClientDetails, TechnicianDetails } from '@/types/inspectionTypes';
import { InspectionService } from '@/services/inspectionService';

interface InspectionFormProps {
  onSubmit: (report: InspectionReport) => void;
}

export function InspectionForm({ onSubmit }: InspectionFormProps) {
  const [claimType, setClaimType] = useState<ClaimType>('water');
  const [report, setReport] = useState<InspectionReport | null>(null);
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    name: '',
    address: '',
    claimNumber: '',
    contactNumber: '',
    email: ''
  });
  const [technicianDetails, setTechnicianDetails] = useState<TechnicianDetails>({
    name: '',
    certification: '',
    iicrcNumber: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleCreateReport = () => {
    const newReport = InspectionService.createNewReport(claimType);
    setReport(newReport);
  };

  const handleSubmit = () => {
    if (!report) return;

    // Update report with form data
    const updatedReport: InspectionReport = {
      ...report,
      data: {
        ...report.data,
        clientDetails,
        technicianDetails
      }
    };

    const validationErrors = InspectionService.validateReport(updatedReport);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const finalizedReport = InspectionService.finalizeReport(updatedReport);
    onSubmit(finalizedReport);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex gap-4">
          <Button
            variant={claimType === 'water' ? 'default' : 'outline'}
            onClick={() => setClaimType('water')}
          >
            Water Damage
          </Button>
          <Button
            variant={claimType === 'fire' ? 'default' : 'outline'}
            onClick={() => setClaimType('fire')}
          >
            Fire Damage
          </Button>
          <Button
            variant={claimType === 'mould' ? 'default' : 'outline'}
            onClick={() => setClaimType('mould')}
          >
            Mould Damage
          </Button>
        </div>

        {!report ? (
          <Button onClick={handleCreateReport} className="w-full">
            Start New Inspection
          </Button>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Client Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={clientDetails.name}
                    onChange={(e) => setClientDetails(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claimNumber">Claim Number</Label>
                  <Input
                    id="claimNumber"
                    value={clientDetails.claimNumber}
                    onChange={(e) => setClientDetails(prev => ({
                      ...prev,
                      claimNumber: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientDetails.email}
                    onChange={(e) => setClientDetails(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Contact Number</Label>
                  <Input
                    id="clientPhone"
                    value={clientDetails.contactNumber}
                    onChange={(e) => setClientDetails(prev => ({
                      ...prev,
                      contactNumber: e.target.value
                    }))}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="clientAddress">Address</Label>
                  <Input
                    id="clientAddress"
                    value={clientDetails.address}
                    onChange={(e) => setClientDetails(prev => ({
                      ...prev,
                      address: e.target.value
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Technician Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technicianName">Name</Label>
                  <Input
                    id="technicianName"
                    value={technicianDetails.name}
                    onChange={(e) => setTechnicianDetails(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iicrcNumber">IICRC Number</Label>
                  <Input
                    id="iicrcNumber"
                    value={technicianDetails.iicrcNumber}
                    onChange={(e) => setTechnicianDetails(prev => ({
                      ...prev,
                      iicrcNumber: e.target.value
                    }))}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="certification">Certification</Label>
                  <Input
                    id="certification"
                    value={technicianDetails.certification}
                    onChange={(e) => setTechnicianDetails(prev => ({
                      ...prev,
                      certification: e.target.value
                    }))}
                  />
                </div>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md">
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={handleSubmit} className="w-full">
              Submit Report
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default InspectionForm;
