import { Card, CardContent } from "@/components/ui/card";

export default function SoftwarePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Software Inventory</h1>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Software page content goes here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
