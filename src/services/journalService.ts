import { JournalArticle } from "@/types";
import { journalArticles } from "@/data/journalData";

export const journalService = {
  async getAllArticles(): Promise<JournalArticle[]> {
    return Promise.resolve(journalArticles);
  },

  async getRecentArticles(limit: number = 3): Promise<JournalArticle[]> {
    return Promise.resolve(journalArticles.slice(0, limit));
  },

  async getArticleBySlug(slug: string): Promise<JournalArticle | null> {
    const found = journalArticles.find((art) => art.slug === slug);
    return Promise.resolve(found || null);
  },
};
