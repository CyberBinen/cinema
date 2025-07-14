'use server';
/**
 * @fileOverview An AI agent for fetching song lyrics.
 *
 * - getLyrics - A function that fetches the lyrics for a given song.
 * - GetLyricsInput - The input type for the function.
 * - GetLyricsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetLyricsInputSchema = z.object({
  title: z.string().describe("The title of the song."),
  artist: z.string().describe("The artist of the song."),
});
export type GetLyricsInput = z.infer<typeof GetLyricsInputSchema>;

const GetLyricsOutputSchema = z.object({
  lyrics: z.string().describe("The full lyrics of the song as a single string with newline characters for line breaks."),
});
export type GetLyricsOutput = z.infer<typeof GetLyricsOutputSchema>;

export async function getLyrics(input: GetLyricsInput): Promise<GetLyricsOutput> {
  return getLyricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getLyricsPrompt',
  input: {schema: GetLyricsInputSchema},
  output: {schema: GetLyricsOutputSchema},
  prompt: `You are a music expert. Find the full lyrics for the song "{{title}}" by "{{artist}}".
Return the lyrics as a single block of text. Ensure formatting like choruses and verses are preserved with newlines.
If you cannot find the lyrics, respond with "Lyrics not found for this song."

Lyrics:`,
});

const getLyricsFlow = ai.defineFlow(
  {
    name: 'getLyricsFlow',
    inputSchema: GetLyricsInputSchema,
    outputSchema: GetLyricsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
