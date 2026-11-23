import { SiteSettings } from "@/types";
import { siteSettingsData } from "@/data/siteSettingsData";

export const siteSettingsService = {
  async getSettings(): Promise<SiteSettings> {
    return Promise.resolve(siteSettingsData);
  },
};
