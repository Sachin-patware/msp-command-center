'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const invoices = [
  { id: 'INV-001', client: 'Innovate Co', amount: 150000, status: 'paid', dueDate: '2024-07-01' },
  { id: 'INV-002', client: 'HealthWell', amount: 75000, status: 'unpaid', dueDate: '2024-08-15' },
  { id: 'INV-003', client: 'RetailRight', amount: 95000, status: 'overdue', dueDate: '2024-06-30' },
];

const expenses = [
  { id: 'EXP-101', department: 'IT', category: 'Software', amount: 45000, date: '2024-07-10' },
  { id: 'EXP-102', department: 'Sales', category: 'Payroll', amount: 120000, date: '2024-07-05' },
  { id: 'EXP-103', department: 'Support', category: 'Hardware', amount: 25000, date: '2024-07-12' },
];

const spendData = [
  { department: "IT", budget: 50000, actual: 45000 },
  { department: "Sales", budget: 30000, actual: 32000 },
  { department: "Support", budget: 40000, actual: 38000 },
  { department: "Marketing", budget: 25000, actual: 28000 },
];

const AddInvoiceForm = () => (
    <div className="grid gap-4 py-4">
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
            <Label htmlFor="amount" className="text-right">Amount (₹)</Label>
            <Input id="amount" type="number" placeholder="100000" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due-date" className="text-right">Due Date</Label>
            <Input id="due-date" type="date" className="col-span-3" />
        </div>
    </div>
);

const AddExpenseForm = () => (
     <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <Select>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Input id="category" placeholder="e.g., Software" className="col-span-3" />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount (₹)</Label>
            <Input id="amount" type="number" placeholder="5000" className="col-span-3" />
        </div>
    </div>
);


export default function FinancialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Financials</h1>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Card className="shadow-md rounded-2xl"><CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">₹3,20,000</p></CardContent></Card>
        <Card className="shadow-md rounded-2xl"><CardHeader><CardTitle>Total Expenses</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">₹1,90,000</p></CardContent></Card>
        <Card className="shadow-md rounded-2xl"><CardHeader><CardTitle>Net Profit</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">₹1,30,000</p></CardContent></Card>
      </div>

      <Tabs defaultValue="invoices">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>
          
        </div>
        <TabsContent value="invoices">
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>Track all client invoices.</CardDescription>
                    </div>
                     <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" />New Invoice</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader><SheetTitle>Create New Invoice</SheetTitle><SheetDescription>Fill out the form to generate a new invoice.</SheetDescription></SheetHeader>
                            <AddInvoiceForm />
                            <SheetFooter><Button type="submit">Create Invoice</Button></SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead><TableHead>Client</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map(invoice => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>₹{invoice.amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell><Badge variant={invoice.status === 'paid' ? 'secondary' : invoice.status === 'overdue' ? 'destructive' : 'default'}>{invoice.status}</Badge></TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses">
          <Card className="shadow-md rounded-2xl">
             <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Expenses</CardTitle>
                        <CardDescription>Track all departmental expenses.</CardDescription>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" />Add Expense</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader><SheetTitle>Add New Expense</SheetTitle><SheetDescription>Log a new expense for your records.</SheetDescription></SheetHeader>
                            <AddExpenseForm />
                            <SheetFooter><Button type="submit">Save Expense</Button></SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expense ID</TableHead><TableHead>Department</TableHead><TableHead>Category</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map(expense => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.id}</TableCell>
                      <TableCell>{expense.department}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>₹{expense.amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="charts">
            <Card className="shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle>Departmental Spend</CardTitle>
                    <CardDescription>Budget vs. Actual spending by department.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="department" />
                            <YAxis tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="budget" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
