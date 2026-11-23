import { Testimonial } from "@/types";
import { testimonialsData } from "@/data/testimonialsData";

export const testimonialService = {
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Promise.resolve(testimonialsData);
  },
};
