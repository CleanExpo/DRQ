'use client';

import { useState, useCallback, KeyboardEvent, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, MapPin, Clock, Phone } from 'lucide-react';
import { SERVICE_REGIONS, type ServiceRegion } from '../../services/types/IServiceArea';
import { useAriaExpanded } from '../../hooks/useAriaExpanded';

export default function ServiceAreaDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [focusedRegionIndex, setFocusedRegionIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownAriaProps = useAriaExpanded(isOpen);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setActiveRegion(null);
    setFocusedRegionIndex(-1);
    toggleButtonRef.current?.focus();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if ((event.target as HTMLElement).getAttribute('data-testid') === 'dropdown-toggle') {
          setIsOpen(!isOpen);
        } else {
          const regionId = (event.target as HTMLElement).getAttribute('data-region-id');
          if (regionId) {
            setActiveRegion(activeRegion === regionId ? null : regionId);
          }
        }
        break;
      case 'Escape':
        event.preventDefault();
        closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        setFocusedRegionIndex(prev => 
          prev < SERVICE_REGIONS.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedRegionIndex(prev => 
          prev > 0 ? prev - 1 : prev
        );
        break;
      case 'Home':
        event.preventDefault();
        setFocusedRegionIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedRegionIndex(SERVICE_REGIONS.length - 1);
        break;
      case 'Tab':
        if (!event.shiftKey && focusedRegionIndex === SERVICE_REGIONS.length - 1) {
          closeDropdown();
        } else if (event.shiftKey && focusedRegionIndex === 0) {
          closeDropdown();
        }
        break;
    }
  }, [isOpen, activeRegion, focusedRegionIndex, closeDropdown]);

  // Focus management for keyboard navigation
  useEffect(() => {
    if (focusedRegionIndex >= 0) {
      const button = document.querySelector(
        `[data-testid="region-button-${SERVICE_REGIONS[focusedRegionIndex].id}"]`
      ) as HTMLButtonElement;
      button?.focus();
    }
  }, [focusedRegionIndex]);

  return (
    <div 
      ref={dropdownRef}
      className="relative" 
      data-testid="service-area-dropdown"
      onKeyDown={handleKeyDown}
    >
      {/* Dropdown Button */}
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        aria-controls="service-areas-menu"
        aria-haspopup="true"
        data-testid="dropdown-toggle"
        {...dropdownAriaProps}
      >
        <span>Service Areas</span>
        <ChevronDown 
          className={`ml-2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          id="service-areas-menu"
          className="absolute left-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50"
          data-testid="dropdown-menu"
          role="region"
          aria-label="Service areas menu"
        >
          {/* Regions List */}
          <div className="p-4">
            <div 
              className="font-semibold text-gray-200 mb-3"
              id="service-areas-heading"
            >
              Our Service Areas
            </div>
            <ul 
              className="space-y-2" 
              data-testid="regions-list"
              aria-labelledby="service-areas-heading"
              role="list"
            >
              {SERVICE_REGIONS.map((region, index) => {
                const isActive = activeRegion === region.id;
                const regionAriaProps = useAriaExpanded(isActive);
                return (
                  <li 
                    key={region.id} 
                    className="relative" 
                    data-testid={`region-${region.id}`}
                    role="listitem"
                  >
                    <button
                      type="button"
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-gray-700 text-white' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                        ${focusedRegionIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setActiveRegion(isActive ? null : region.id)}
                      onFocus={() => setFocusedRegionIndex(index)}
                      aria-controls={`region-details-${region.id}`}
                      data-testid={`region-button-${region.id}`}
                      data-region-id={region.id}
                      tabIndex={focusedRegionIndex === index ? 0 : -1}
                      {...regionAriaProps}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{region.name}</span>
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform
                            ${isActive ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </div>
                    </button>

                    {/* Region Details */}
                    {isActive && (
                      <div 
                        id={`region-details-${region.id}`}
                        className="mt-2 pl-3 space-y-3"
                        data-testid={`region-details-${region.id}`}
                        aria-label={`${region.name} details`}
                        role="region"
                      >
                        {/* Response Time */}
                        <div className="flex items-center text-sm text-gray-300">
                          <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                          <span>Response Time: {region.responseTime}</span>
                        </div>

                        {/* Contact */}
                        <div className="flex items-center text-sm text-gray-300">
                          <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                          <a 
                            href={`tel:${region.contactNumber}`}
                            className="text-blue-400 hover:text-blue-300"
                            data-testid={`region-contact-${region.id}`}
                          >
                            {region.contactNumber}
                          </a>
                        </div>

                        {/* Services */}
                        <div className="space-y-1">
                          <div 
                            className="text-sm font-medium text-gray-200"
                            id={`services-heading-${region.id}`}
                          >
                            Available Services:
                          </div>
                          <ul 
                            className="text-sm text-gray-300 space-y-1"
                            data-testid={`region-services-${region.id}`}
                            aria-labelledby={`services-heading-${region.id}`}
                            role="list"
                          >
                            {region.services.map(service => (
                              <li 
                                key={service.id} 
                                className="flex items-center"
                                data-testid={`service-${service.id}`}
                                role="listitem"
                              >
                                <span 
                                  className="w-2 h-2 bg-green-400 rounded-full mr-2"
                                  aria-hidden="true"
                                />
                                {service.name}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* View Details Link */}
                        <Link
                          href={`/areas/${region.id}`}
                          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
                          data-testid={`region-map-link-${region.id}`}
                        >
                          <MapPin className="w-4 h-4 mr-1" aria-hidden="true" />
                          View Coverage Map
                        </Link>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700 p-4 bg-gray-800 rounded-b-lg">
            <Link
              href="/areas"
              className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              data-testid="view-all-areas-link"
            >
              View All Service Areas
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
