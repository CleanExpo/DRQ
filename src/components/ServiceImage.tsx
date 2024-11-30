'use client';

import Image from 'next/image';
import { CSSProperties } from 'react';

interface PexelsPhoto {
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
  };
  width: number;
  height: number;
  alt?: string;
}

interface ServiceImageProps {
  photo: PexelsPhoto;
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: CSSProperties;
}

const DEFAULT_IMAGE = {
  src: {
    original: 'https://placehold.co/1920x1080/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
    large2x: 'https://placehold.co/1920x1080/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
    large: 'https://placehold.co/1200x800/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
    medium: 'https://placehold.co/800x600/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
    small: 'https://placehold.co/400x300/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
  },
  width: 1920,
  height: 1080,
  alt: 'Disaster Recovery QLD Emergency Services',
};

const imageLoader = ({ src, width }: { src: string; width: number }) => {
  // For placeholder images, return as is
  if (src.includes('placehold.co')) {
    return src;
  }

  // For Pexels images, select the appropriate size based on width
  if (width <= 400) {
    return src.replace('/photos/', '/photos/small/');
  } else if (width <= 800) {
    return src.replace('/photos/', '/photos/medium/');
  } else if (width <= 1200) {
    return src.replace('/photos/', '/photos/large/');
  }
  return src.replace('/photos/', '/photos/large2x/');
};

export function ServiceImage({
  photo,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  style,
}: ServiceImageProps) {
  // Validate photo data and use fallback if needed
  const validPhoto = photo?.src?.original ? photo : DEFAULT_IMAGE;
  const imageAlt = alt || validPhoto.alt || DEFAULT_IMAGE.alt;

  return (
    <Image
      loader={imageLoader}
      src={validPhoto.src.original}
      alt={imageAlt}
      width={validPhoto.width}
      height={validPhoto.height}
      priority={priority}
      sizes={sizes}
      className={`object-cover ${className}`}
      style={style}
      quality={85}
    />
  );
}
