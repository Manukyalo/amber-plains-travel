import { SafariPackage } from "@/types";
import { safariPackages } from "@/data/packagesData";

export interface PackageFilterParams {
  destination?: string;
  duration?: "all" | "short" | "medium" | "extended"; // short: 1-4, medium: 5-7, extended: 8+
  experienceType?: string;
  searchQuery?: string;
}

export const packageService = {
  /**
   * Retrieves all available safari packages.
   * In Phase 2, this will query the platform REST / GraphQL backend.
   */
  async getAllPackages(): Promise<SafariPackage[]> {
    return Promise.resolve(safariPackages);
  },

  /**
   * Retrieves featured packages for homepage discovery.
   */
  async getFeaturedPackages(): Promise<SafariPackage[]> {
    const featured = safariPackages.filter((pkg) => pkg.isFeatured);
    return Promise.resolve(featured);
  },

  /**
   * Retrieves a single package by its URL slug.
   */
  async getPackageBySlug(slug: string): Promise<SafariPackage | null> {
    const found = safariPackages.find((pkg) => pkg.slug === slug);
    return Promise.resolve(found || null);
  },

  /**
   * Filters packages based on user criteria.
   */
  async filterPackages(params: PackageFilterParams): Promise<SafariPackage[]> {
    let filtered = [...safariPackages];

    if (params.destination && params.destination !== "all") {
      filtered = filtered.filter((pkg) =>
        pkg.destinations.some((d) => d.toLowerCase().includes(params.destination!.toLowerCase()))
      );
    }

    if (params.duration && params.duration !== "all") {
      if (params.duration === "short") {
        filtered = filtered.filter((pkg) => pkg.durationDays <= 4);
      } else if (params.duration === "medium") {
        filtered = filtered.filter((pkg) => pkg.durationDays >= 5 && pkg.durationDays <= 7);
      } else if (params.duration === "extended") {
        filtered = filtered.filter((pkg) => pkg.durationDays >= 8);
      }
    }

    if (params.experienceType && params.experienceType !== "all") {
      filtered = filtered.filter((pkg) =>
        pkg.experienceTypes.some((e) => e.toLowerCase() === params.experienceType!.toLowerCase())
      );
    }

    if (params.searchQuery) {
      const q = params.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(q) ||
          pkg.subtitle.toLowerCase().includes(q) ||
          pkg.overview.toLowerCase().includes(q)
      );
    }

    return Promise.resolve(filtered);
  },
};
