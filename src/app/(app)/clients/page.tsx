'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCollection } from "@/firebase";
import { Loader2 } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AddClientForm = () => (
    <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" placeholder="Acme Inc." className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="industry" className="text-right">Industry</Label>
            <Input id="industry" placeholder="SaaS" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mrr" className="text-right">MRR (₹)</Label>
            <Input id="mrr" type="number" placeholder="150000" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact-name" className="text-right">Contact Name</Label>
            <Input id="contact-name" placeholder="John Doe" className="col-span-3" />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact-email" className="text-right">Contact Email</Label>
            <Input id="contact-email" type="email" placeholder="john@acme.com" className="col-span-3" />
        </div>
    </div>
)


export default function ClientsPage() {
    // Note: Using a hardcoded 'test-org' for now. This should be dynamic in a real app.
    const { data: clients, loading, error } = useCollection('organizations/test-org/clients');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Client
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add a New Client</SheetTitle>
                            <SheetDescription>Fill in the details below to add a new client to your roster.</SheetDescription>
                        </SheetHeader>
                        <AddClientForm />
                        <SheetFooter>
                            <Button type="submit">Save Client</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
            
            <Card className="shadow-md rounded-2xl">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Client Roster</CardTitle>
                            <CardDescription>Manage your clients and their contracts.</CardDescription>
                        </div>
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input placeholder="Search clients..." className="pl-10 w-64" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client Name</TableHead>
                                <TableHead className="hidden md:table-cell">Industry</TableHead>
                                <TableHead>MRR</TableHead>
                                <TableHead className="hidden lg:table-cell">Contract End</TableHead>
                                <TableHead>Primary Contact</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        <div className="flex justify-center items-center p-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {error && (
                                <TableRow><TableCell colSpan={6} className="text-center text-destructive">Error loading clients. Check Firestore security rules and collection path.</TableCell></TableRow>
                            )}
                            {!loading && clients && clients.map((client: any) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">{client.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{client.industry}</TableCell>
                                    <TableCell>₹{client.mrr?.toLocaleString('en-IN')}</TableCell>
                                    <TableCell className="hidden lg:table-cell">{client.contractEnd ? new Date(client.contractEnd).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>{client.primaryContact?.name}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!loading && (!clients || clients.length === 0) && !error && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        No clients found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
