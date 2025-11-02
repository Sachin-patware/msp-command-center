'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from 'recharts';

const leadsData = [
  { name: 'QuantumLeap Corp', source: 'Website', value: 500000, status: 'New', owner: 'sales@msp.com' },
  { name: 'Stellar Solutions', source: 'Referral', value: 300000, status: 'Contacted', owner: 'admin@msp.com' },
  { name: 'Apex Innovations', source: 'Cold Call', value: 750000, status: 'Won', owner: 'sales@msp.com' },
  { name: 'Zenith Tech', source: 'Website', value: 200000, status: 'Lost', owner: 'sales@msp.com' },
];

const funnelData = [
  { name: 'New', value: 120, fill: '#8884d8' },
  { name: 'Contacted', value: 80, fill: '#83a6ed' },
  { name: 'Proposal', value: 50, fill: '#8dd1e1' },
  { name: 'Won', value: 20, fill: '#82ca9d' },
];

const AddLeadForm = () => (
    <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Lead Name</Label>
            <Input id="name" placeholder="e.g., Stellar Solutions" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="source" className="text-right">Source</Label>
            <Input id="source" placeholder="e.g., Referral" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">Value (₹)</Label>
            <Input id="value" type="number" placeholder="300000" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </div>
);


export default function LeadsPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            <Sheet>
                <SheetTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Lead
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Add a New Lead</SheetTitle>
                        <SheetDescription>Enter the details for the new sales lead.</SheetDescription>
                    </SheetHeader>
                    <AddLeadForm />
                    <SheetFooter>
                        <Button type="submit">Save Lead</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-md rounded-2xl">
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Lead Funnel</CardTitle>
                            <CardDescription>Track leads and manage your sales pipeline.</CardDescription>
                        </div>
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input placeholder="Search leads..." className="pl-10 w-64" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Lead Name</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Owner</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leadsData.map((lead) => (
                                <TableRow key={lead.name}>
                                    <TableCell className="font-medium">{lead.name}</TableCell>
                                    <TableCell>{lead.source}</TableCell>
                                    <TableCell>₹{lead.value.toLocaleString('en-IN')}</TableCell>
                                    <TableCell>
                                        <Badge variant={lead.status === 'Won' ? 'secondary' : lead.status === 'Lost' ? 'destructive' : 'default'}>{lead.status}</Badge>
                                    </TableCell>
                                    <TableCell>{lead.owner}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <div className="space-y-6">
                 <Card className="shadow-md rounded-2xl">
                    <CardHeader><CardTitle>Conversion Funnel</CardTitle></CardHeader>
                    <CardContent className="h-[250px]">
                       <ResponsiveContainer width="100%" height="100%">
                            <FunnelChart>
                                <Tooltip />
                                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                                    <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="shadow-md rounded-2xl"><CardHeader><CardTitle>Total Leads</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">120</p></CardContent></Card>
                <Card className="shadow-md rounded-2xl"><CardHeader><CardTitle>Conversion %</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-success">16.7%</p></CardContent></Card>
            </div>
        </div>
    </div>
  );
}
