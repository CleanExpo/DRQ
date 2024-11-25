"use client";

import React from "react";

interface PhoneLinkProps {
  phone: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const PhoneLink: React.FC<PhoneLinkProps> = ({
  phone,
  className = "",
  children,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    window.location.href = `tel:${phone}`;
  };

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {children || phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
    </button>
  );
};
