import { useState, useEffect, useCallback } from 'react';
import { mediaService } from '@/services/MediaService';
import { logger } from '@/utils/logger';

interface MediaMetadata {
  filename: string;
  mimeType: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  format?: string;
  encoding?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  alt?: string;
  caption?: string;
  author?: string;
  license?: string;
  location?: {
    lat?: number;
    lng?: number;
    name?: string;
  };
}

interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  metadata: MediaMetadata;
  status: 'processing' | 'ready' | 'failed';
  error?: string;
}

interface MediaTransform {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  fit?: 'cover' | 'contain' | 'fill';
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

interface MediaMetrics {
  totalAssets: number;
  totalSize: number;
  assetsByType: Record<string, number>;
  storageUsage: {
    total: number;
    available: number;
    used: number;
  };
  processingQueue: number;
  lastUpdate: number;
}

interface UseMediaOptions {
  onAssetChange?: (type: string, data: any) => void;
  onError?: (error: Error) => void;
  transformOptions?: MediaTransform;
}

export function useMedia(options: UseMediaOptions = {}) {
  const {
    onAssetChange,
    onError,
    transformOptions
  } = options;

  const [metrics, setMetrics] = useState<MediaMetrics>(mediaService.getMetrics());
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = mediaService.onAssetEvent((type, data) => {
      onAssetChange?.(type, data);
      setMetrics(mediaService.getMetrics());
    });

    return unsubscribe;
  }, [onAssetChange]);

  const uploadAsset = useCallback(async (file: File): Promise<MediaAsset> => {
    try {
      setIsUploading(true);
      const asset = await mediaService.uploadAsset(file);
      setMetrics(mediaService.getMetrics());
      return asset;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Upload failed');
      onError?.(err);
      logger.error('Upload failed', { error });
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [onError]);

  const getAsset = useCallback(async (id: string): Promise<MediaAsset | null> => {
    try {
      return await mediaService.getAsset(id);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get asset');
      onError?.(err);
      logger.error('Failed to get asset', { id, error });
      return null;
    }
  }, [onError]);

  const transformImage = useCallback(async (
    id: string,
    transform: MediaTransform = transformOptions || {}
  ): Promise<string> => {
    try {
      return await mediaService.transformImage(id, transform);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Transform failed');
      onError?.(err);
      logger.error('Transform failed', { id, error });
      throw err;
    }
  }, [transformOptions, onError]);

  const updateAsset = useCallback(async (
    id: string,
    updates: Partial<MediaAsset>
  ): Promise<MediaAsset> => {
    try {
      const asset = await mediaService.updateAsset(id, updates);
      setMetrics(mediaService.getMetrics());
      return asset;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Update failed');
      onError?.(err);
      logger.error('Update failed', { id, error });
      throw err;
    }
  }, [onError]);

  const deleteAsset = useCallback(async (id: string): Promise<void> => {
    try {
      await mediaService.deleteAsset(id);
      setMetrics(mediaService.getMetrics());
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Delete failed');
      onError?.(err);
      logger.error('Delete failed', { id, error });
      throw err;
    }
  }, [onError]);

  const generateReport = useCallback(async () => {
    try {
      return await mediaService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Report generation failed');
      onError?.(err);
      logger.error('Report generation failed', { error });
      throw err;
    }
  }, [onError]);

  return {
    metrics,
    isUploading,
    uploadAsset,
    getAsset,
    transformImage,
    updateAsset,
    deleteAsset,
    generateReport
  };
}

// Example usage:
/*
function MediaUploader() {
  const {
    metrics,
    isUploading,
    uploadAsset,
    transformImage
  } = useMedia({
    onAssetChange: (type, data) => {
      console.log('Asset event:', type, data);
    },
    transformOptions: {
      width: 800,
      height: 600,
      quality: 80,
      format: 'webp'
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const asset = await uploadAsset(file);
      if (asset.type === 'image') {
        const transformedUrl = await transformImage(asset.id);
        console.log('Transformed image URL:', transformedUrl);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={isUploading} />
      {isUploading && <div>Uploading...</div>}
      <div>
        Storage used: {(metrics.storageUsage.used / 1024 / 1024).toFixed(2)}MB
      </div>
    </div>
  );
}
*/
