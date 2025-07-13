'use server';

import { recommendFilm, RecommendFilmInput, RecommendFilmOutput } from "@/ai/flows/recommend-film";
import { z } from "zod";

const recommendFilmActionSchema = z.object({
    viewingHistory: z.string().min(10, "Please describe your viewing history in a bit more detail."),
    preferences: z.string().min(5, "Please describe your preferences."),
});

export async function getFilmRecommendation(
  prevState: any,
  formData: FormData
): Promise<{
  message: string;
  recommendation?: RecommendFilmOutput;
  error?: string;
}> {
  const validatedFields = recommendFilmActionSchema.safeParse({
    viewingHistory: formData.get('viewingHistory'),
    preferences: formData.get('preferences'),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed",
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await recommendFilm(validatedFields.data as RecommendFilmInput);
    return { message: "success", recommendation: result };
  } catch (e) {
    return { message: "error", error: "Something went wrong with the AI. Please try again." };
  }
}
