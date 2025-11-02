'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Search, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth, useCollection, useFirestore, useUser } from "@/firebase";
import { addDoc, collection, doc, writeBatch } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";


const clientSchema = z.object({
    name: z.string().min(1, "Client name is required"),
    industry: z.string().min(1, "Industry is required"),
    mrr: z.coerce.number().positive("MRR must be a positive number"),
    contactName: z.string().optional(),
    contactEmail: z.string().email("Invalid email address").optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;


const AddClientForm = ({ onSave }: { onSave: () => void }) => {
    const { db } = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Hardcode orgId for now.
    const orgId = "test-org"; 

    const form = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: '',
            industry: '',
            mrr: 0,
            contactName: '',
            contactEmail: '',
        }
    });

    async function onSubmit(data: ClientFormData) {
        if (!db || !user) {
            toast({ variant: "destructive", title: "Error", description: "Database not available or user not logged in."});
            return;
        };
        setIsSubmitting(true);

        const newClient = {
            name: data.name,
            industry: data.industry,
            mrr: data.mrr,
            primaryContact: {
                name: data.contactName,
                email: data.contactEmail,
            },
            contractStart: new Date().toISOString(),
        };

        const batch = writeBatch(db);

        // 1. Create the organization document
        const orgRef = doc(db, 'organizations', orgId);
        const orgData = { name: 'Test Organization', ownerId: user.uid, createdAt: new Date().toISOString(), currency: 'INR', plan: 'pro' };
        batch.set(orgRef, orgData, { merge: true });

        // 2. Create the user document within the organization
        const userRef = doc(db, `organizations/${orgId}/users`, user.uid);
        const userData = { email: user.email, displayName: user.displayName, role: 'admin', uid: user.uid };
        batch.set(userRef, userData, { merge: true });

        // 3. Create the new client document
        const clientRef = doc(collection(db, `organizations/${orgId}/clients`));
        batch.set(clientRef, newClient);
        
        batch.commit()
            .then(() => {
                toast({
                    title: "Client Added",
                    description: `${data.name} has been successfully added.`,
                });
                form.reset();
                onSave();
            })
            .catch(async (serverError) => {
                console.error("Error adding client: ", serverError);
                 const permissionError = new FirestorePermissionError({
                    path: `organizations/${orgId}/clients`,
                    operation: 'create',
                    requestResourceData: newClient,
                });
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Acme Inc." className="col-span-3" {...field} />
                        </FormControl>
                        <FormMessage className="col-span-4 text-right" />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="industry" render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Industry</FormLabel>
                        <FormControl>
                            <Input placeholder="SaaS" className="col-span-3" {...field} />
                        </FormControl>
                         <FormMessage className="col-span-4 text-right" />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="mrr" render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">MRR (₹)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="150000" className="col-span-3" {...field} />
                        </FormControl>
                         <FormMessage className="col-span-4 text-right" />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="contactName" render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Contact Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" className="col-span-3" {...field} />
                        </FormControl>
                         <FormMessage className="col-span-4 text-right" />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="contactEmail" render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Contact Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="john@acme.com" className="col-span-3" {...field} />
                        </FormControl>
                         <FormMessage className="col-span-4 text-right" />
                    </FormItem>
                )} />
                <SheetFooter className="mt-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Client
                    </Button>
                </SheetFooter>
            </form>
        </Form>
    )
}


export default function ClientsPage() {
    const orgId = "test-org";
    const { data: clients, loading, error } = useCollection(orgId ? `organizations/${orgId}/clients` : undefined);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                        <AddClientForm onSave={() => setIsSheetOpen(false)} />
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
