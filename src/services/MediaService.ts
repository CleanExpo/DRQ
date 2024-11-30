import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

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

class MediaService {
  private static instance: MediaService;
  private assets: Map<string, MediaAsset> = new Map();
  private metrics: MediaMetrics;
  private observers: ((type: string, data: any) => void)[] = [];
  private readonly supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private readonly supportedVideoTypes = ['video/mp4', 'video/webm'];
  private readonly maxFileSize = 50 * 1024 * 1024; // 50MB

  private constructor() {
    this.metrics = this.initializeMetrics();
  }

  public static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  private initializeMetrics(): MediaMetrics {
    return {
      totalAssets: 0,
      totalSize: 0,
      assetsByType: {},
      storageUsage: {
        total: 1000 * 1024 * 1024, // 1GB example limit
        available: 1000 * 1024 * 1024,
        used: 0
      },
      processingQueue: 0,
      lastUpdate: Date.now()
    };
  }

  public async uploadAsset(file: File): Promise<MediaAsset> {
    try {
      // Validate file
      this.validateFile(file);

      // Create asset record
      const asset: MediaAsset = {
        id: this.generateId(),
        type: this.getAssetType(file.type),
        url: '', // Will be set after upload
        metadata: {
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        status: 'processing'
      };

      // Process file
      const processedAsset = await this.processAsset(asset, file);
      this.assets.set(processedAsset.id, processedAsset);
      this.updateMetrics();
      this.notifyObservers('asset:uploaded', processedAsset);

      logger.debug('Asset uploaded', { id: processedAsset.id, type: processedAsset.type });
      return processedAsset;
    } catch (error) {
      logger.error('Asset upload failed', { error });
      throw error;
    }
  }

  private validateFile(file: File): void {
    if (file.size > this.maxFileSize) {
      throw new Error(`File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024}MB`);
    }

    if (!this.isSupportedType(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    if (file.size + this.metrics.storageUsage.used > this.metrics.storageUsage.total) {
      throw new Error('Storage limit exceeded');
    }
  }

  private isSupportedType(mimeType: string): boolean {
    return [
      ...this.supportedImageTypes,
      ...this.supportedVideoTypes
    ].includes(mimeType);
  }

  private getAssetType(mimeType: string): MediaAsset['type'] {
    if (this.supportedImageTypes.includes(mimeType)) return 'image';
    if (this.supportedVideoTypes.includes(mimeType)) return 'video';
    throw new Error(`Unsupported mime type: ${mimeType}`);
  }

  private async processAsset(asset: MediaAsset, file: File): Promise<MediaAsset> {
    try {
      this.metrics.processingQueue++;
      this.updateMetrics();

      // Generate URL
      const url = await this.uploadToStorage(file);
      asset.url = url;

      // Generate metadata
      if (asset.type === 'image') {
        const dimensions = await this.getImageDimensions(file);
        asset.metadata.dimensions = dimensions;
      }

      // Generate thumbnail for images and videos
      if (['image', 'video'].includes(asset.type)) {
        asset.thumbnailUrl = await this.generateThumbnail(file);
      }

      asset.status = 'ready';
      return asset;
    } catch (error) {
      asset.status = 'failed';
      asset.error = error instanceof Error ? error.message : 'Processing failed';
      throw error;
    } finally {
      this.metrics.processingQueue--;
      this.updateMetrics();
    }
  }

  private async uploadToStorage(file: File): Promise<string> {
    // In production, this would upload to cloud storage
    return URL.createObjectURL(file);
  }

  private async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private async generateThumbnail(file: File): Promise<string> {
    // In production, this would generate and upload a thumbnail
    return URL.createObjectURL(file);
  }

  public async getAsset(id: string): Promise<MediaAsset | null> {
    try {
      const cacheKey = `asset:${id}`;
      const cached = await cacheService.get<MediaAsset>(cacheKey);

      if (cached) {
        logger.debug('Asset loaded from cache', { id });
        return cached;
      }

      const asset = this.assets.get(id);
      if (asset) {
        await cacheService.set(cacheKey, asset, {
          ttl: 3600000, // 1 hour
          type: 'asset'
        });
      }

      return asset || null;
    } catch (error) {
      logger.error('Failed to get asset', { id, error });
      return null;
    }
  }

  public async transformImage(
    id: string,
    transform: MediaTransform
  ): Promise<string> {
    try {
      const asset = await this.getAsset(id);
      if (!asset || asset.type !== 'image') {
        throw new Error('Asset not found or not an image');
      }

      const cacheKey = `transform:${id}:${JSON.stringify(transform)}`;
      const cached = await cacheService.get<string>(cacheKey);

      if (cached) {
        logger.debug('Transformed image loaded from cache', { id });
        return cached;
      }

      // In production, this would transform the image using a service
      const transformedUrl = asset.url;
      
      await cacheService.set(cacheKey, transformedUrl, {
        ttl: 86400000, // 24 hours
        type: 'transform'
      });

      return transformedUrl;
    } catch (error) {
      logger.error('Image transformation failed', { id, error });
      throw error;
    }
  }

  public async updateAsset(id: string, updates: Partial<MediaAsset>): Promise<MediaAsset> {
    try {
      const asset = this.assets.get(id);
      if (!asset) {
        throw new Error(`Asset not found: ${id}`);
      }

      const updatedAsset: MediaAsset = {
        ...asset,
        ...updates,
        metadata: {
          ...asset.metadata,
          ...updates.metadata,
          updatedAt: new Date().toISOString()
        }
      };

      this.assets.set(id, updatedAsset);
      this.updateMetrics();
      this.notifyObservers('asset:updated', updatedAsset);

      // Invalidate cache
      await cacheService.invalidate(`asset:${id}`);

      logger.debug('Asset updated', { id });
      return updatedAsset;
    } catch (error) {
      logger.error('Failed to update asset', { id, error });
      throw error;
    }
  }

  public async deleteAsset(id: string): Promise<void> {
    try {
      const asset = this.assets.get(id);
      if (!asset) {
        throw new Error(`Asset not found: ${id}`);
      }

      // In production, this would delete from storage
      this.assets.delete(id);
      this.updateMetrics();
      this.notifyObservers('asset:deleted', { id });

      // Invalidate cache
      await cacheService.invalidate(`asset:${id}`);

      logger.debug('Asset deleted', { id });
    } catch (error) {
      logger.error('Failed to delete asset', { id, error });
      throw error;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public onAssetEvent(callback: (type: string, data: any) => void): () => void {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  private notifyObservers(type: string, data: any): void {
    this.observers.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        logger.error('Asset event callback failed', { error });
      }
    });
  }

  private updateMetrics(): void {
    const assets = Array.from(this.assets.values());

    this.metrics = {
      totalAssets: assets.length,
      totalSize: assets.reduce((sum, asset) => sum + asset.metadata.size, 0),
      assetsByType: assets.reduce((acc, asset) => {
        acc[asset.type] = (acc[asset.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      storageUsage: {
        ...this.metrics.storageUsage,
        used: assets.reduce((sum, asset) => sum + asset.metadata.size, 0)
      },
      processingQueue: this.metrics.processingQueue,
      lastUpdate: Date.now()
    };
  }

  public getMetrics(): MediaMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      assets: Array.from(this.assets.values()).map(asset => ({
        id: asset.id,
        type: asset.type,
        size: asset.metadata.size,
        status: asset.status,
        createdAt: asset.metadata.createdAt
      })),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const mediaService = MediaService.getInstance();
export default MediaService;
