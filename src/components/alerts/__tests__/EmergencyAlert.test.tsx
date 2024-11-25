import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmergencyAlert from '../EmergencyAlert';

describe('EmergencyAlert', () => {
  it('renders emergency alert with title and description', () => {
    render(
      <EmergencyAlert
        title="Emergency Response Required"
        description="Water damage reported in Brisbane CBD. Response time: 30 minutes."
      />
    );

    expect(screen.getByText('Emergency Response Required')).toBeInTheDocument();
    expect(
      screen.getByText('Water damage reported in Brisbane CBD. Response time: 30 minutes.')
    ).toBeInTheDocument();
  });

  it('applies correct styles for destructive variant', () => {
    const { container } = render(
      <EmergencyAlert
        variant="destructive"
        title="Emergency Alert"
      />
    );

    const alertElement = container.firstChild as HTMLElement;
    expect(alertElement).toHaveClass('border-red-600');
    expect(alertElement).toHaveClass('bg-red-50');
  });

  it('applies correct styles for warning variant', () => {
    const { container } = render(
      <EmergencyAlert
        variant="warning"
        title="Warning Alert"
      />
    );

    const alertElement = container.firstChild as HTMLElement;
    expect(alertElement).toHaveClass('border-yellow-600');
    expect(alertElement).toHaveClass('bg-yellow-50');
  });

  it('renders children content when provided', () => {
    render(
      <EmergencyAlert>
        <button>Emergency Action</button>
      </EmergencyAlert>
    );

    expect(screen.getByText('Emergency Action')).toBeInTheDocument();
  });
});
