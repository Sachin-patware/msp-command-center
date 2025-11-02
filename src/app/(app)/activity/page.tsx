'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

// Mock data, to be replaced with Firestore real-time listener
const activityLogs = [
    { id: '1', user: 'admin@msp.com', action: 'CREATE_CLIENT', target: 'Client B', timestamp: new Date() },
    { id: '2', user: 'sales@msp.com', action: 'UPDATE_LEAD_STATUS', target: 'Lead X to "Won"', timestamp: new Date(Date.now() - 3600000) },
    { id: '3', user: 'finance@msp.com', action: 'CREATE_INVOICE', target: 'Invoice #INV-003', timestamp: new Date(Date.now() - 7200000) },
    { id: '4', user: 'admin@msp.com', action: 'DELETE_USER', target: 'viewer@msp.com', timestamp: new Date(Date.now() - 86400000) },
];


export default function ActivityPage() {
   const [date, setDate] = useState<DateRange | undefined>();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
      <Card>
        <CardHeader>
            <CardTitle>System Activity Log</CardTitle>
            <CardDescription>An audit trail of all actions performed in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by user or action..." className="pl-10" />
                </div>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date range</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
            </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell><Badge variant="secondary">{log.action}</Badge></TableCell>
                  <TableCell>{log.target}</TableCell>
                  <TableCell>{format(log.timestamp, "PPP p")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
