import { QuoteGeneratorForm } from "./form";

export default function QuoteGeneratorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">AI Quote Generator</h1>
      <p className="text-muted-foreground">
        Generate a personalized quote for a potential client based on their MRR and industry.
      </p>
      <QuoteGeneratorForm />
    </div>
  );
}
