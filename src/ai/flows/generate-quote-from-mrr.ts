'use server';
/**
 * @fileOverview Generates a quote for a potential client based on their monthly recurring revenue (MRR).
 *
 * - generateQuoteFromMRR - A function that generates the quote.
 * - GenerateQuoteFromMRRInput - The input type for the generateQuoteFromMRR function.
 * - GenerateQuoteFromMRROutput - The return type for the generateQuoteFromMRR function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuoteFromMRRInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  mrr: z.number().describe('The monthly recurring revenue of the client.'),
  industry: z.string().describe('The industry of the client.'),
});
export type GenerateQuoteFromMRRInput = z.infer<typeof GenerateQuoteFromMRRInputSchema>;

const GenerateQuoteFromMRROutputSchema = z.object({
  quote: z.string().describe('The generated quote for the client.'),
});
export type GenerateQuoteFromMRROutput = z.infer<typeof GenerateQuoteFromMRROutputSchema>;

export async function generateQuoteFromMRR(input: GenerateQuoteFromMRRInput): Promise<GenerateQuoteFromMRROutput> {
  return generateQuoteFromMRRFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuoteFromMRRPrompt',
  input: {schema: GenerateQuoteFromMRRInputSchema},
  output: {schema: GenerateQuoteFromMRROutputSchema},
  prompt: `You are a sales expert for a Managed Service Provider. Generate a quote for a potential client based on their monthly recurring revenue (MRR), industry, and client name.

  Client Name: {{{clientName}}}
  MRR: {{{mrr}}}
  Industry: {{{industry}}}

  Provide a detailed and attractive quote that highlights the value proposition of our services. Make the quote around 200 words.
  `,
});

const generateQuoteFromMRRFlow = ai.defineFlow(
  {
    name: 'generateQuoteFromMRRFlow',
    inputSchema: GenerateQuoteFromMRRInputSchema,
    outputSchema: GenerateQuoteFromMRROutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
