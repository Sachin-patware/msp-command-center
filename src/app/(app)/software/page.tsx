'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const softwareData = [
  { name: 'Microsoft 365', vendor: 'Microsoft', licenses: 150, costPerLicense: 1200, renewalDate: '2025-01-15' },
  { name: 'Adobe Creative Cloud', vendor: 'Adobe', licenses: 25, costPerLicense: 4000, renewalDate: '2024-08-20' },
  { name: 'QuickBooks Online', vendor: 'Intuit', licenses: 10, costPerLicense: 2500, renewalDate: '2024-11-01' },
  { name: 'Zendesk Suite', vendor: 'Zendesk', licenses: 50, costPerLicense: 800, renewalDate: '2024-07-30' },
];

const pieData = [
  { name: 'Microsoft', value: 180000 },
  { name: 'Adobe', value: 100000 },
  { name: 'Intuit', value: 25000 },
  { name: 'Zendesk', value: 40000 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const isSoonToExpire = (dateString: string) => {
    const renewalDate = new Date(dateString);
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
}

const AddSoftwareForm = () => (
    <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Software Name</Label>
            <Input id="name" placeholder="e.g., Microsoft 365" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vendor" className="text-right">Vendor</Label>
            <Input id="vendor" placeholder="e.g., Microsoft" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="licenses" className="text-right">Licenses</Label>
            <Input id="licenses" type="number" placeholder="150" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cost" className="text-right">Cost/License (₹)</Label>
            <Input id="cost" type="number" placeholder="1200" className="col-span-3" />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="renewal" className="text-right">Renewal Date</Label>
            <Input id="renewal" type="date" className="col-span-3" />
        </div>
    </div>
);


export default function SoftwarePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Software Inventory</h1>
        <Sheet>
            <SheetTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Software
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add New Software</SheetTitle>
                    <SheetDescription>Track a new software subscription and its licenses.</SheetDescription>
                </SheetHeader>
                <AddSoftwareForm />
                <SheetFooter>
                    <Button type="submit">Save Software</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>License Management</CardTitle>
            <CardDescription>Track all software subscriptions and their costs.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Software Name</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Licenses</TableHead>
                  <TableHead>Cost/License</TableHead>
                  <TableHead>Renewal Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {softwareData.map((item) => (
                  <TableRow key={item.name} className={isSoonToExpire(item.renewalDate) ? 'bg-destructive/10' : ''}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>{item.licenses}</TableCell>
                    <TableCell>₹{item.costPerLicense.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                        {item.renewalDate}
                        {isSoonToExpire(item.renewalDate) && <Badge variant="destructive" className="ml-2">Expiring Soon</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="shadow-md rounded-2xl">
            <CardHeader>
                <CardTitle>Cost Share by Vendor</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
