'use client'

import { useFormState, useFormStatus } from 'react-dom';
import { getQuote, type FormState } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
      Generate Quote
    </Button>
  );
}

export function QuoteGeneratorForm() {
  const [state, formAction] = useFormState(getQuote, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === 'success') {
      toast({
          title: 'Quote Generated',
          description: 'Your AI-powered quote is ready.',
      });
    } else if (state.message.startsWith('Error:')) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: state.issues ? state.issues.join(', ') : state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
          <CardDescription>Enter the details for the quote generation.</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" name="clientName" placeholder="e.g., Acme Corp" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mrr">Monthly Recurring Revenue (MRR)</Label>
              <Input id="mrr" name="mrr" type="number" placeholder="e.g., 50000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" name="industry" placeholder="e.g., SaaS" required />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Quote</CardTitle>
          <CardDescription>The AI-powered quote will appear below.</CardDescription>
        </CardHeader>
        <CardContent>
          {state.quote ? (
            <Textarea readOnly value={state.quote} className="min-h-[260px] text-sm bg-muted/50" rows={15} />
          ) : (
            <div className="flex items-center justify-center h-[260px] rounded-md border border-dashed bg-muted/50">
              <p className="text-muted-foreground">Your quote will be generated here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
