'use server'

import { generateQuoteFromMRR } from '@/ai/flows/generate-quote-from-mrr';
import { z } from 'zod';

const schema = z.object({
  clientName: z.string().min(1, 'Client name is required.'),
  mrr: z.coerce.number().min(1, 'MRR must be a positive number.'),
  industry: z.string().min(1, 'Industry is required.'),
});

export type FormState = {
  message: string;
  quote?: string;
  fields?: Record<string, string>;
  issues?: string[];
}

export async function getQuote(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Error: Invalid form data.',
      issues: validatedFields.error.flatten().fieldErrors.mrr,
    }
  }
  
  try {
    const result = await generateQuoteFromMRR(validatedFields.data);
    return { message: 'success', quote: result.quote };
  } catch (e) {
    return { message: 'Error: Could not generate quote.' };
  }
}
