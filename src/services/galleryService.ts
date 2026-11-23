import { GalleryCategory, GalleryItem } from "@/types";
import { galleryData } from "@/data/galleryData";

export const galleryService = {
  async getGalleryItems(category: GalleryCategory = "all"): Promise<GalleryItem[]> {
    if (category === "all") {
      return Promise.resolve(galleryData);
    }
    const filtered = galleryData.filter((item) => item.category === category);
    return Promise.resolve(filtered);
  },

  async getCuratedPreview(limit: number = 6): Promise<GalleryItem[]> {
    return Promise.resolve(galleryData.slice(0, limit));
  },
};
