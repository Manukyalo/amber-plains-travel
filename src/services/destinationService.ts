import { Destination } from "@/types";
import { destinationsData } from "@/data/destinationsData";

export const destinationService = {
  async getAllDestinations(): Promise<Destination[]> {
    return Promise.resolve(destinationsData);
  },

  async getFeaturedDestinations(): Promise<Destination[]> {
    return Promise.resolve(destinationsData.filter((d) => d.isFeatured));
  },

  async getDestinationBySlug(slug: string): Promise<Destination | null> {
    const item = destinationsData.find((d) => d.slug === slug);
    return Promise.resolve(item || null);
  },
};
