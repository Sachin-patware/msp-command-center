import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const clients = [
    { id: 1, name: "Client A", industry: "Manufacturing", mrr: "₹1,20,000", contract: "2024-04-01 to 2025-04-01", tags: ["priority"] },
    { id: 2, name: "Client B", industry: "Healthcare", mrr: "₹80,000", contract: "2023-08-01 to 2026-08-01", tags: ["onboarding"] },
    { id: 3, name: "Tech Solutions Inc.", industry: "SaaS", mrr: "₹2,50,000", contract: "2024-01-15 to 2025-01-15", tags: [] },
    { id: 4, name: "Innovate Co", industry: "E-commerce", mrr: "₹1,50,000", contract: "2023-11-01 to 2024-11-01", tags: ["high-touch"] },
    { id: 5, name: "Global Exports", industry: "Logistics", mrr: "₹95,000", contract: "2024-06-01 to 2025-06-01", tags: [] },
    { id: 6, name: "HealthFirst Clinic", industry: "Healthcare", mrr: "₹1,10,000", contract: "2022-05-20 to 2025-05-20", tags: ["priority"] },
];

export default function ClientsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Client
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Client Roster</CardTitle>
                    <CardDescription>Manage your clients and their contracts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client Name</TableHead>
                                <TableHead className="hidden md:table-cell">Industry</TableHead>
                                <TableHead>MRR</TableHead>
                                <TableHead className="hidden lg:table-cell">Contract Period</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map(client => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">{client.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{client.industry}</TableCell>
                                    <TableCell>{client.mrr}</TableCell>
                                    <TableCell className="hidden lg:table-cell">{client.contract}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {client.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                        </div>
                                    </TableCell>
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
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
