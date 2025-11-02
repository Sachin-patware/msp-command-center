'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Search, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, doc, setDoc, addDoc, writeBatch } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const clientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  industry: z.string().min(1, "Industry is required"),
  mrr: z.coerce.number().positive("MRR must be a positive number"),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

const AddClientForm = ({ onSave }: { onSave: () => void }) => {
  const { db } = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const orgId = "test-org"; // Hardcoded for now

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: '', industry: '', mrr: 0, contactName: '', contactEmail: '' },
  });

  async function onSubmit(data: ClientFormData) {
    if (!db || !user) {
      toast({ variant: "destructive", title: "Error", description: "Database not available or user not logged in." });
      return;
    }

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

    const orgRef = doc(db, "organizations", orgId);
    const userRoleRef = doc(db, `organizations/${orgId}/users`, user.uid);
    const clientRef = doc(collection(db, `organizations/${orgId}/clients`));

    const orgData = { name: "Test Organization", ownerId: user.uid, createdAt: new Date().toISOString(), currency: "INR", plan: "pro" };
    const userData = { email: user.email, displayName: user.displayName, role: "admin", uid: user.uid };
    
    const batch = writeBatch(db);
    batch.set(orgRef, orgData, { merge: true });
    batch.set(userRoleRef, userData, { merge: true });
    batch.set(clientRef, newClient);

    batch.commit()
      .then(() => {
        toast({ title: "Client Added", description: `${data.name} has been successfully added.` });
        form.reset();
        onSave();
      })
      .catch((serverError) => {
        const isPermissionError = serverError.code === 'permission-denied';

        if (isPermissionError) {
            const permissionError = new FirestorePermissionError({
                path: `organizations/${orgId}`,
                operation: 'create',
                requestResourceData: { org: orgData, user: userData, client: newClient },
            });
            errorEmitter.emit('permission-error', permissionError);
        } else {
             toast({
                variant: "destructive",
                title: "Error",
                description: serverError.message || "Failed to add client.",
            });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {["name", "industry", "mrr", "contactName", "contactEmail"].map((fieldName, index) => {
          const labelMap: any = {
            name: "Name",
            industry: "Industry",
            mrr: "MRR (₹)",
            contactName: "Contact Name",
            contactEmail: "Contact Email",
          };
          return (
            <FormField key={index} control={form.control} name={fieldName as any} render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">{labelMap[fieldName]}</FormLabel>
                <FormControl>
                  <Input
                    type={fieldName === "mrr" ? "number" : fieldName === "contactEmail" ? "email" : "text"}
                    placeholder={labelMap[fieldName]}
                    className="col-span-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-4 text-right" />
              </FormItem>
            )} />
          );
        })}
        <SheetFooter className="mt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Client
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
};

export default function ClientsPage() {
  const { user } = useUser();
  const orgId = 'test-org'; // Hardcoded for now
  const { data: clients, loading, error } = useCollection(
    user ? `organizations/${orgId}/clients` : undefined
  );
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
                <TableHead>Industry</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Primary Contact</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <div className="flex justify-center items-center p-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow><TableCell colSpan={5} className="text-center text-destructive">Error loading clients. Check Firestore security rules and collection path.</TableCell></TableRow>
              )}
              {!loading && clients && clients.map((client: any) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.industry}</TableCell>
                  <TableCell>₹{client.mrr?.toLocaleString('en-IN')}</TableCell>
                  <TableCell>{client.primaryContact?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && (!clients || clients.length === 0) && !error && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No clients found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
