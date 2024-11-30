'use client';

import React, { useState } from 'react';
import { useForm } from '@/hooks/useForm';

interface SubmissionDisplayProps {
  submission: {
    id: string;
    formId: string;
    data: Record<string, any>;
    metadata: {
      submittedAt: string;
      status: string;
      processedAt?: string;
      error?: string;
    };
  };
}

const SubmissionDisplay: React.FC<SubmissionDisplayProps> = ({ submission }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="border rounded p-3 mb-2 bg-white">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <span className={`font-medium ${getStatusColor(submission.metadata.status)}`}>
            {submission.metadata.status}
          </span>
          <span className="mx-2">•</span>
          <span className="text-gray-600">{submission.id}</span>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(submission.metadata.submittedAt).toLocaleTimeString()}
        </span>
      </div>
      
      {isExpanded && (
        <div className="mt-2 space-y-2 text-sm">
          <div>
            <span className="font-medium">Data:</span>
            <pre className="mt-1 bg-gray-50 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(submission.data, null, 2)}
            </pre>
          </div>
          {submission.metadata.processedAt && (
            <div>
              <span className="font-medium">Processed: </span>
              <span className="text-gray-600">
                {new Date(submission.metadata.processedAt).toLocaleString()}
              </span>
            </div>
          )}
          {submission.metadata.error && (
            <div className="text-red-600">
              <span className="font-medium">Error: </span>
              {submission.metadata.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface MetricDisplayProps {
  label: string;
  value: number | string;
  color?: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ 
  label, 
  value, 
  color = 'green' 
}) => (
  <div className={`p-4 bg-${color}-50 rounded-lg`}>
    <div className="text-sm text-gray-600">{label}</div>
    <div className={`text-2xl font-bold text-${color}-600`}>
      {typeof value === 'number' ? value.toFixed(2) : value}
    </div>
  </div>
);

interface FormMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  formId?: string;
}

export const FormMonitor: React.FC<FormMonitorProps> = ({
  position = 'bottom-right',
  formId = 'monitor'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'submissions' | 'metrics' | 'form'>('submissions');

  const {
    form,
    submissions,
    metrics,
    isSubmitting
  } = useForm({
    formId,
    onSuccess: (submission) => {
      console.log('Form submitted:', submission);
    }
  });

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  if (!isVisible) return null;

  const TabButton: React.FC<{
    tab: 'submissions' | 'metrics' | 'form';
    label: string;
  }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
        activeTab === tab
          ? 'bg-white text-green-600 border-b-2 border-green-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50`}
      style={{ maxWidth: isExpanded ? '600px' : '50px' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-2 right-2 z-10 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
      >
        {isExpanded ? '×' : '📝'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Form Monitor</h2>
            {form && (
              <div className="text-sm text-gray-600 mt-1">
                Form: {form.name}
              </div>
            )}
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="submissions" label="Submissions" />
              <TabButton tab="metrics" label="Metrics" />
              <TabButton tab="form" label="Form Config" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'submissions' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Submissions" 
                    value={metrics.totalSubmissions}
                  />
                  <MetricDisplay 
                    label="Success Rate" 
                    value={`${metrics.successRate}%`}
                    color={metrics.successRate > 90 ? 'green' : 'yellow'}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Submissions</h3>
                  {submissions.length > 0 ? (
                    submissions.map(submission => (
                      <SubmissionDisplay 
                        key={submission.id} 
                        submission={submission}
                      />
                    ))
                  ) : (
                    <div className="text-gray-500">No submissions yet</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Forms" 
                    value={metrics.totalForms}
                  />
                  <MetricDisplay 
                    label="Active Forms" 
                    value={metrics.activeForms}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Submissions by Form</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.submissionsByForm).map(([formId, count]) => (
                      <div 
                        key={formId}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium">{formId}</span>
                        <span className="text-gray-600">{count} submissions</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'form' && form && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold mb-2">Form Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Endpoint: </span>
                      <code className="bg-white px-1 rounded">
                        {form.submitEndpoint}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium">Status: </span>
                      <span className={`
                        ${form.metadata.status === 'active' ? 'text-green-600' : 
                          form.metadata.status === 'inactive' ? 'text-yellow-600' : 
                          'text-red-600'}
                      `}>
                        {form.metadata.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Version: </span>
                      {form.metadata.version}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Fields</h3>
                  <div className="space-y-2">
                    {form.fields.map(field => (
                      <div 
                        key={field.id}
                        className="p-2 bg-gray-50 rounded"
                      >
                        <div className="font-medium">{field.label}</div>
                        <div className="text-sm text-gray-600">
                          <span className="bg-gray-200 px-1 rounded">{field.type}</span>
                          {field.validation?.required && (
                            <span className="ml-2 text-red-500">required</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Last Update: {new Date(metrics.lastUpdate).toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-600">
                {isSubmitting && 'Processing submission...'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormMonitor;
