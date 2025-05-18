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
  imageUrl: z.string().describe('A URL to the book cover image.'), 
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

When recommending a book, you must:
- Search for the book on the official Kyobo Bookstore (교보문고) website (https://www.kyobobook.co.kr) and use only books that actually exist there.
- Find and use the official and correct ISBN-13 number from Kyobo for the recommended book. Do not make up or guess the ISBN.
- Provide the bookTitle, author, isbn, reason, and imageUrl fields in your response.
- The imageUrl must be a direct link to the book cover image in the format: https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/[ISBN].jpg, where [ISBN] is the correct ISBN-13 of the book you found. Do not use any image URLs from aladin.co.kr. If the image does not exist, use https://placehold.co/300x200?text=No+Image.
- All explanations and reasons must be written in Korean.
- The reason must be short and concise, no more than 5 sentences.
- If you cannot find a valid book on Kyobo, respond with a message in Korean saying that you could not find a suitable book.

Return the result as JSON with the following fields:
- bookTitle: The title of the recommended book.
- author: The author of the recommended book.
- isbn: The correct ISBN-13 number of the recommended book.
- reason: The reason for the recommendation, written in Korean, short and concise (no more than 5 sentences).
- imageUrl: The direct URL to the book cover image as described above (e.g., https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788931469707.jpg).

{% if previousBooks %}The child has previously read the following books: {{previousBooks}}{% endif %}

Age: {{{age}}}
Interests: {{{interests}}}
Reading Level: {{{readingLevel}}}`,
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
