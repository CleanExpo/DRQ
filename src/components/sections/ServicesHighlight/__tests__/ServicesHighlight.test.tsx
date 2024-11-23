/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ServicesHighlight } from '../ServicesHighlight';
import { Locale } from '../../../../config/i18n.config';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe('ServicesHighlight', () => {
  const defaultLocale: Locale = 'en-AU';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all services', () => {
    render(<ServicesHighlight locale={defaultLocale} />);

    expect(screen.getByText('Water Damage Restoration')).toBeInTheDocument();
    expect(screen.getByText('Fire Damage Recovery')).toBeInTheDocument();
    expect(screen.getByText('Mould Remediation')).toBeInTheDocument();
  });

  it('should render service descriptions', () => {
    render(<ServicesHighlight locale={defaultLocale} />);

    expect(screen.getByText(/24\/7 emergency water damage restoration services/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional fire and smoke damage restoration services/i)).toBeInTheDocument();
    expect(screen.getByText(/Expert mould detection and removal services/i)).toBeInTheDocument();
  });

  it('should render service features', () => {
    render(<ServicesHighlight locale={defaultLocale} />);

    // Water Damage features
    expect(screen.getByText('Emergency Water Extraction')).toBeInTheDocument();
    expect(screen.getByText('Flood Damage Restoration')).toBeInTheDocument();
    expect(screen.getByText('Moisture Detection & Removal')).toBeInTheDocument();
    expect(screen.getByText('Structural Drying')).toBeInTheDocument();

    // Fire Damage features
    expect(screen.getByText('Fire Damage Restoration')).toBeInTheDocument();
    expect(screen.getByText('Smoke Damage Cleanup')).toBeInTheDocument();
    expect(screen.getByText('Odor Removal')).toBeInTheDocument();
    expect(screen.getByText('Content Restoration')).toBeInTheDocument();

    // Mould features
    expect(screen.getByText('Mould Inspection')).toBeInTheDocument();
    expect(screen.getByText('Safe Mould Removal')).toBeInTheDocument();
    expect(screen.getByText('Prevention Strategies')).toBeInTheDocument();
    expect(screen.getByText('Air Quality Testing')).toBeInTheDocument();
  });

  it('should render service icons', () => {
    render(<ServicesHighlight locale={defaultLocale} />);

    const icons = screen.getAllByRole('img');
    expect(icons[0]).toHaveAttribute('src', '/icons/water-damage.svg');
    expect(icons[1]).toHaveAttribute('src', '/icons/fire-damage.svg');
    expect(icons[2]).toHaveAttribute('src', '/icons/mould.svg');
  });

  it('should render learn more links', () => {
    render(<ServicesHighlight locale={defaultLocale} />);

    const links = screen.getAllByText('Learn More');
    expect(links).toHaveLength(3);
  });

  it('should render section title and subtitle', () => {
    render(<ServicesHighlight locale={defaultLocale} />);

    expect(screen.getByText('Our Emergency Services')).toBeInTheDocument();
    expect(screen.getByText(/Professional disaster recovery services available 24\/7/i)).toBeInTheDocument();
  });

  it('should mention all service areas in subtitle', () => {
    render(<ServicesHighlight locale={defaultLocale} />);

    const subtitle = screen.getByText(/Professional disaster recovery services available 24\/7 across Queensland/i);
    expect(subtitle).toBeInTheDocument();
  });
});
