'use client';

import React from 'react';
import { getLanguageDirection } from '@/config/i18n.config';

interface DirectionProviderProps {
  children: React.ReactNode;
  locale: string;
}

export const DirectionProvider: React.FC<DirectionProviderProps> = ({ 
  children,
  locale
}) => {
  const dir = getLanguageDirection(locale);
  const isRTL = dir === 'rtl';

  // RTL specific styles
  const rtlStyles = {
    // Text alignment
    '.text-start': { textAlign: 'right' },
    '.text-end': { textAlign: 'left' },
    
    // Margins and paddings
    '.ms-auto': { marginLeft: '0', marginRight: 'auto' },
    '.me-auto': { marginRight: '0', marginLeft: 'auto' },
    '.ps-0': { paddingRight: '0' },
    '.pe-0': { paddingLeft: '0' },
    
    // Flexbox
    '.flex-row': { flexDirection: 'row-reverse' },
    '.justify-start': { justifyContent: 'flex-end' },
    '.justify-end': { justifyContent: 'flex-start' },
    
    // Borders
    '.border-s': { borderRight: 'inherit', borderLeft: 'none' },
    '.border-e': { borderLeft: 'inherit', borderRight: 'none' },
    
    // Grid
    '.col-start': { gridColumnStart: 'end' },
    '.col-end': { gridColumnStart: 'start' },
  };

  return (
    <div 
      dir={dir}
      className={`root-layout ${isRTL ? 'rtl' : 'ltr'}`}
      style={{
        ...(isRTL && {
          // Apply RTL specific styles when direction is RTL
          ...Object.fromEntries(
            Object.entries(rtlStyles).map(([selector, styles]) => [
              `& ${selector}`,
              styles
            ])
          )
        })
      }}
    >
      {children}
    </div>
  );
};

// CSS utility classes for RTL/LTR support
const rtlUtilities = `
  .rtl {
    direction: rtl;
    text-align: right;
  }

  .ltr {
    direction: ltr;
    text-align: left;
  }

  /* Logical properties */
  .rtl .ms-auto {
    margin-left: 0 !important;
    margin-right: auto !important;
  }

  .rtl .me-auto {
    margin-right: 0 !important;
    margin-left: auto !important;
  }

  .rtl .ps-0 {
    padding-right: 0 !important;
  }

  .rtl .pe-0 {
    padding-left: 0 !important;
  }

  /* Flexbox */
  .rtl .flex-row {
    flex-direction: row-reverse !important;
  }

  .rtl .justify-start {
    justify-content: flex-end !important;
  }

  .rtl .justify-end {
    justify-content: flex-start !important;
  }

  /* Border */
  .rtl .border-s {
    border-right: inherit !important;
    border-left: none !important;
  }

  .rtl .border-e {
    border-left: inherit !important;
    border-right: none !important;
  }

  /* Grid */
  .rtl .col-start {
    grid-column-start: end !important;
  }

  .rtl .col-end {
    grid-column-start: start !important;
  }

  /* Text alignment */
  .rtl .text-start {
    text-align: right !important;
  }

  .rtl .text-end {
    text-align: left !important;
  }

  /* Transform */
  .rtl .rotate-180 {
    transform: rotate(180deg) !important;
  }

  /* Scroll behavior */
  .rtl * {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
  }

  .rtl *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .rtl *::-webkit-scrollbar-track {
    background: transparent;
  }

  .rtl *::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
`;

// Export utilities for global styles
export const rtlStylesheet = rtlUtilities;

export default DirectionProvider;
