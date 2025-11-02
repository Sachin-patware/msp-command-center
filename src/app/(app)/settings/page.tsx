'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


const users = [
    { id: '1', name: 'Admin User', email: 'owner@msp.com', role: 'admin' },
    { id: '2', name: 'Finance Team', email: 'finance@msp.com', role: 'finance' },
    { id: '3', name: 'Sales Agent', email: 'sales@msp.com', role: 'sales' },
];

const AddUserForm = () => (
    <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" placeholder="user@example.com" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Role</Label>
            <Select>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </div>
);


export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <Tabs defaultValue="organization" className="w-full">
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="prefs">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="organization">
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>Manage your company's details and branding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue="Acme MSP" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="INR" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="https://placehold.co/100x100/1976d2/white?text=M" />
                        <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                    <Input id="logo" type="file" className="max-w-xs"/>
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
                 <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Add, edit, or remove users from your organization.</CardDescription>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" />Add User</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader><SheetTitle>Add a New User</SheetTitle><SheetDescription>Invite a new user to your organization.</SheetDescription></SheetHeader>
                            <AddUserForm />
                            <SheetFooter><Button type="submit">Send Invite</Button></SheetFooter>
                        </SheetContent>
                    </Sheet>
                 </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div>{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="prefs">
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your personal settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle the dark theme for the application.</p>
                </div>
                <Switch id="dark-mode" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email alerts for important events.</p>
                </div>
                <Switch id="notifications" defaultChecked/>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
