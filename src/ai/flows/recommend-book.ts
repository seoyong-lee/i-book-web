//recommend-book.ts
'use server';
/**
 * @fileOverview Recommends books for children based on their age, interests, and reading level.
 *
 * - recommendBook - A function that recommends books.
 * - RecommendBookInput - The input type for the recommendBook function.
 * - RecommendBookOutput - The return type for the recommendBook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendBookInputSchema = z.object({
  age: z.number().describe('The age of the child.'),
  interests: z.string().describe('The interests of the child.'),
  readingLevel: z.string().describe('The reading level of the child.'),
  previousBooks: z.string().optional().describe('Previously read books by the child.'),
});
export type RecommendBookInput = z.infer<typeof RecommendBookInputSchema>;

const RecommendBookOutputSchema = z.object({
  bookTitle: z.string().describe('The title of the recommended book.'),
  author: z.string().describe('The author of the recommended book.'),
  reason: z.string().describe('Why this book is recommended for the child.'),
});
export type RecommendBookOutput = z.infer<typeof RecommendBookOutputSchema>;

export async function recommendBook(input: RecommendBookInput): Promise<RecommendBookOutput> {
  return recommendBookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendBookPrompt',
  input: {schema: RecommendBookInputSchema},
  output: {schema: RecommendBookOutputSchema},
  prompt: `You are a helpful chatbot that recommends books for children. The user will provide the child's age, interests, and reading level.

  {% if previousBooks %}The child has previously read the following books: {{previousBooks}}{% endif %}

  Recommend a book that would be suitable for the child, in Korean.

  Age: {{{age}}}
  Interests: {{{interests}}}
  Reading Level: {{{readingLevel}}}
  \n`,
});

const recommendBookFlow = ai.defineFlow(
  {
    name: 'recommendBookFlow',
    inputSchema: RecommendBookInputSchema,
    outputSchema: RecommendBookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
