'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const onboardingSchema = z.object({
    organizationName: z.string().min(3, "Organization name must be at least 3 characters long"),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
    const { user, loading: userLoading } = useUser();
    const { db } = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<OnboardingFormData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            organizationName: '',
        }
    });

    async function onSubmit(data: OnboardingFormData) {
        if (!user || !db) {
            toast({ variant: "destructive", title: "Error", description: "You must be logged in to create an organization." });
            return;
        }
        setIsSubmitting(true);

        const orgId = data.organizationName.toLowerCase().replace(/\s+/g, '-').slice(0, 50);
        const orgRef = doc(db, "organizations", orgId);
        const userRef = doc(db, `organizations/${orgId}/users`, user.uid);

        try {
            await setDoc(orgRef, {
                name: data.organizationName,
                ownerId: user.uid,
                createdAt: new Date().toISOString(),
                currency: "INR",
                timezone: "Asia/Kolkata",
                plan: "free",
            });

            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                role: 'admin',
            });
            
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Error creating organization: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not create organization. See console for details.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (userLoading) {
         return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if(!user) {
        router.push('/login');
        return null;
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
                    <CardDescription>Let's set up your organization.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="organizationName"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="organizationName">Organization Name</Label>
                                        <FormControl>
                                            <Input id="organizationName" placeholder="e.g., Acme MSP" required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Organization
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
