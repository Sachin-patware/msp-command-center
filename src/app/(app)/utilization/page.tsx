'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const timeData = [
  { engineer: 'Alice', client: 'Innovate Co', billable: 40, nonBillable: 8, utilization: 83 },
  { engineer: 'Bob', client: 'HealthWell', billable: 35, nonBillable: 12, utilization: 74 },
  { engineer: 'Charlie', client: 'RetailRight', billable: 45, nonBillable: 5, utilization: 90 },
];

const trendData = [
  { month: 'Jan', utilization: 78 },
  { month: 'Feb', utilization: 81 },
  { month: 'Mar', utilization: 80 },
  { month: 'Apr', utilization: 85 },
  { month: 'May', utilization: 88 },
  { month: 'Jun', utilization: 84 },
];

const AddTimeForm = () => (
     <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="engineer" className="text-right">Engineer</Label>
            <Select>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an engineer" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="eng1">Alice</SelectItem>
                    <SelectItem value="eng2">Bob</SelectItem>
                </SelectContent>
            </Select>
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">Client</Label>
            <Select>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="client1">Innovate Co</SelectItem>
                    <SelectItem value="client2">HealthWell</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hours" className="text-right">Hours</Label>
            <Input id="hours" type="number" placeholder="8" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" className="col-span-3" />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="billable" className="text-right">Billable</Label>
            <Switch id="billable" className="col-span-3" />
        </div>
    </div>
);


export default function UtilizationPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Time & Utilization</h1>
            <Sheet>
                <SheetTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Log Time
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Log Time Entry</SheetTitle>
                        <SheetDescription>Log billable or non-billable hours for an engineer.</SheetDescription>
                    </SheetHeader>
                    <AddTimeForm />
                    <SheetFooter>
                        <Button type="submit">Save Entry</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-3 shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle>Time Tracking</CardTitle>
                    <CardDescription>Track billable vs. non-billable hours per engineer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Engineer</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Billable Hours</TableHead>
                                <TableHead>Non-billable Hours</TableHead>
                                <TableHead>Utilization %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {timeData.map((entry) => (
                                <TableRow key={entry.engineer}>
                                    <TableCell className="font-medium">{entry.engineer}</TableCell>
                                    <TableCell>{entry.client}</TableCell>
                                    <TableCell className="text-success">{entry.billable}</TableCell>
                                    <TableCell className="text-destructive">{entry.nonBillable}</TableCell>
                                    <TableCell className="font-bold">{entry.utilization}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2 shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle>Department Utilization Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis unit="%" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="utilization" stroke="hsl(var(--primary))" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <div className="space-y-6">
                 <Card className="shadow-md rounded-2xl"><CardHeader><CardTitle>Avg. Utilization</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">82.3%</p></CardContent></Card>
                <Card className="shadow-md rounded-2xl"><CardHeader><CardTitle>Billable Ratio</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">81.5%</p></CardContent></Card>
             </div>
        </div>
    </div>
  );
}
