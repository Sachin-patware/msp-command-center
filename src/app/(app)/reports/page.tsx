'use client';

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, FileText } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const generatedReports = [
    { name: 'Financial-Report-Q2-2024.pdf', date: '2024-07-15', size: '1.2MB' },
    { name: 'Client-Activity-July-2024.csv', date: '2024-08-01', size: '450KB' },
];

export default function ReportsPage() {
    const [date, setDate] = useState<DateRange | undefined>();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
            <CardTitle>Generate a New Report</CardTitle>
            <CardDescription>Select a report type and date range to generate and export data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <Select>
                    <SelectTrigger className="w-full sm:w-[280px]">
                        <SelectValue placeholder="Select a report type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="financial">Financial Report</SelectItem>
                        <SelectItem value="client">Client Report</SelectItem>
                        <SelectItem value="software">Software Report</SelectItem>
                    </SelectContent>
                </Select>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-full sm:w-[300px] justify-start text-left font-normal",
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
                    <PopoverContent className="w-auto p-0" align="start">
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
                 <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                </Button>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-md rounded-2xl">
        <CardHeader>
            <CardTitle>Generated Files</CardTitle>
            <CardDescription>Download previously generated reports.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Date Generated</TableHead>
                        <TableHead>File Size</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {generatedReports.map(report => (
                        <TableRow key={report.name}>
                            <TableCell className="font-medium flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                {report.name}
                            </TableCell>
                            <TableCell>{report.date}</TableCell>
                            <TableCell>{report.size}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
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
