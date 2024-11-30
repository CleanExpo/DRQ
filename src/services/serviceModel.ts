import { Filter } from 'mongodb';
import { databaseService } from './database';
import { Service, COLLECTIONS, CreateServiceInput } from '@/models/types';

type ServiceFilter = Filter<Service>;

export class ServiceModel {
  private collection = COLLECTIONS.SERVICES;

  async findBySlug(slug: string): Promise<Service | null> {
    return databaseService.findOne<Service>(
      this.collection,
      { slug, active: true } as ServiceFilter
    );
  }

  async findAll(filter: ServiceFilter = { active: true }): Promise<Service[]> {
    return databaseService.find<Service>(this.collection, filter);
  }

  async create(serviceData: CreateServiceInput): Promise<Service> {
    try {
      // Get the highest order number and increment by 1
      const services = await this.findAll({} as ServiceFilter);
      const maxOrder = services.reduce((max, service) => Math.max(max, service.order), 0);
      
      const newService = {
        ...serviceData,
        active: serviceData.active ?? true,
        order: serviceData.order ?? maxOrder + 1,
      };
      
      return databaseService.insertOne<Service>(this.collection, newService);
    } catch (error) {
      console.error('Failed to create service:', error);
      throw new Error('Failed to create service');
    }
  }

  async update(slug: string, update: Partial<Service>): Promise<boolean> {
    try {
      return databaseService.updateOne<Service>(
        this.collection,
        { slug } as ServiceFilter,
        update
      );
    } catch (error) {
      console.error('Failed to update service:', error);
      return false;
    }
  }

  async delete(slug: string): Promise<boolean> {
    // Soft delete by setting active to false
    return this.update(slug, { active: false });
  }

  async reorder(slugs: string[]): Promise<boolean> {
    try {
      // Update order for each service based on its position in the slugs array
      await Promise.all(
        slugs.map((slug, index) =>
          this.update(slug, { order: index + 1 })
        )
      );
      return true;
    } catch (error) {
      console.error('Failed to reorder services:', error);
      return false;
    }
  }

  async search(query: string): Promise<Service[]> {
    if (!query?.trim()) {
      return this.findAll();
    }

    try {
      const searchRegex = new RegExp(query.trim(), 'i');
      const filter: ServiceFilter = {
        active: true,
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { content: { $regex: searchRegex } },
        ],
      };
      return this.findAll(filter);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  async findRelated(service: Service, limit: number = 3): Promise<Service[]> {
    if (!service?.title) {
      return [];
    }

    try {
      const words = service.title.split(' ');
      if (words.length === 0) {
        return [];
      }

      const searchTerm = words[0];
      if (!searchTerm) {
        return [];
      }

      const searchRegex = new RegExp(searchTerm, 'i');
      
      const filter: ServiceFilter = {
        active: true,
        slug: { $ne: service.slug }, // Exclude current service
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
        ],
      };
      
      const services = await databaseService.find<Service>(this.collection, filter);
      return services.slice(0, limit);
    } catch (error) {
      console.error('Find related error:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const serviceModel = new ServiceModel();
