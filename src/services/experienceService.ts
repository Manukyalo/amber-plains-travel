import { Experience } from "@/types";
import { experiencesData } from "@/data/experiencesData";

export const experienceService = {
  async getAllExperiences(): Promise<Experience[]> {
    return Promise.resolve(experiencesData);
  },

  async getExperienceBySlug(slug: string): Promise<Experience | null> {
    const item = experiencesData.find((e) => e.slug === slug);
    return Promise.resolve(item || null);
  },
};
