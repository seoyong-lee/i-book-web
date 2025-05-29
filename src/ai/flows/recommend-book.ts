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
import { responseMock } from '@/app/mocks/response.mock';

const RecommendBookInputSchema = z.object({
  age: z.number().describe('The age of the child.'),
  interests: z.string().describe('The interests of the child.'),
  readingLevel: z.string().describe('The reading level of the child.'),
  previousBooks: z.string().optional().describe('Previously read books by the child.'),
});
export type RecommendBookInput = z.infer<typeof RecommendBookInputSchema>;

const BookSchema = z.object({
  title: z.string().describe('The title of the recommended book.'),
  author: z.string().describe('The author of the recommended book.'),
  reason: z.string().describe('Why this book is recommended for the child.'),
  cover: z.string().optional().describe('The cover image URL of the book.'),
  publisher: z.string().optional().describe('The publisher of the book.'),
  pubDate: z.string().optional().describe('The publication date of the book.'),
  isbn13: z.string().optional().describe('The ISBN13 of the book.'),
  priceSales: z.number().optional().describe('The sales price of the book.'),
  link: z.string().optional().describe('The link to the book details.'),
});

const RecommendBookOutputSchema = z.object({
  books: z.array(BookSchema).describe('Array of recommended books.'),
  totalCount: z.number().describe('Total number of recommended books.'),
});
export type RecommendBookOutput = z.infer<typeof RecommendBookOutputSchema>;
export type Book = z.infer<typeof BookSchema>;

export async function recommendBook(input: RecommendBookInput): Promise<RecommendBookOutput> {
  // Mock 데이터를 사용하여 책 추천 시뮬레이션
  const mockBooks = responseMock.map((book, index) => ({
    title: `${input.interests}와 관련된 책 ${index + 1}`,
    author: `작가 ${index + 1}`,
    reason: `${input.age}세 아이에게 ${input.interests}에 대한 흥미를 키워줄 수 있는 ${input.readingLevel} 수준의 책입니다. 아이의 상상력과 창의력을 기를 수 있는 내용으로 구성되어 있습니다.`,
    cover: book.cover,
    publisher: book.publisher,
    pubDate: book.pubDate,
    isbn13: book.isbn13,
    priceSales: book.priceSales,
    link: book.link,
  }));

  return {
    books: mockBooks,
    totalCount: mockBooks.length,
  };
}
