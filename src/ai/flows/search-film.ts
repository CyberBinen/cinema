'use server';

/**
 * @fileOverview AI film search agent.
 *
 * - searchFilm - A function that searches for a film by title.
 * - SearchFilmInput - The input type for the searchFilm function.
 * - SearchFilmOutput - The return type for the searchFilm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchFilmInputSchema = z.object({
  title: z.string().describe('The title of the film to search for.'),
});
export type SearchFilmInput = z.infer<typeof SearchFilmInputSchema>;

// Using the same output schema as recommendations for consistency
const SearchFilmOutputSchema = z.object({
  title: z.string().describe('The title of the film.'),
  genre: z.string().describe('The genre of the film.'),
  streamingService: z.string().describe('The streaming service where the film is available.'),
  shortDescription: z.string().describe('A short description of the film.'),
});
export type SearchFilmOutput = z.infer<typeof SearchFilmOutputSchema>;


export async function searchFilm(input: SearchFilmInput): Promise<SearchFilmOutput> {
  return searchFilmFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchFilmPrompt',
  input: {schema: SearchFilmInputSchema},
  output: {schema: SearchFilmOutputSchema},
  prompt: `You are a film expert. Given a movie title, find information about that specific movie.
If you cannot find the movie, just make your best guess based on the title.

Movie Title: {{{title}}}

Film Information:`,
});

const searchFilmFlow = ai.defineFlow(
  {
    name: 'searchFilmFlow',
    inputSchema: SearchFilmInputSchema,
    outputSchema: SearchFilmOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
