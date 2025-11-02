'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { AreaChart as RechartsAreaChart, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Area, Bar, Legend } from 'recharts';
import { DollarSign, Users, TrendingUp, TrendingDown } from "lucide-react";

const kpiData = [
  { title: "MRR (This Month)", value: "₹1,20,00,000", change: "+2.5%", icon: DollarSign, changeType: "increase" },
  { title: "ARR (12M)", value: "₹14,40,00,000", change: "+15.2%", icon: TrendingUp, changeType: "increase" },
  { title: "Churn (Last 30d)", value: "1.2%", change: "-0.3%", icon: TrendingDown, changeType: "decrease" },
  { title: "Gross Margin", value: "62%", change: "+1.8%", icon: TrendingUp, changeType: "increase" },
];

const revenueData = [
  { month: "Jan", revenue: 10000000 },
  { month: "Feb", revenue: 11000000 },
  { month: "Mar", revenue: 10500000 },
  { month: "Apr", revenue: 12000000 },
  { month: "May", revenue: 13000000 },
  { month: "Jun", revenue: 12500000 },
];

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const spendData = [
  { department: "IT", budget: 50000, actual: 45000 },
  { department: "Sales", budget: 30000, actual: 32000 },
  { department: "Support", budget: 40000, actual: 38000 },
  { department: "Marketing", budget: 25000, actual: 28000 },
];

const spendChartConfig = {
    budget: { label: "Budget", color: "hsl(var(--muted))" },
    actual: { label: "Actual", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

function KpiCard({ title, value, change, icon: Icon, changeType }: { title: string, value: string, change: string, icon: React.ElementType, changeType: 'increase' | 'decrease' }) {
  return (
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className={`text-xs ${changeType === 'increase' ? 'text-success' : 'text-destructive'}`}>
                  {change} from last month
              </p>
          </CardContent>
      </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly Recurring Revenue over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
              <RechartsAreaChart data={revenueData} margin={{ left: -20, right: 12, top: 10 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                 <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${Number(value) / 100000}L`} />
                <RechartsTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                <Area dataKey="revenue" type="monotone" fill="var(--color-revenue)" fillOpacity={0.4} stroke="var(--color-revenue)" />
              </RechartsAreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Departmental Spend</CardTitle>
            <CardDescription>Budget vs Actual spending by department.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={spendChartConfig} className="h-[250px] w-full">
              <RechartsBarChart data={spendData} layout="vertical" margin={{ left: 10, right: 10, top: 10 }}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="department" type="category" tickLine={false} axisLine={false} tickMargin={8} width={80} />
                <XAxis type="number" hide />
                <RechartsTooltip cursor={false} content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="budget" fill="var(--color-budget)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="actual" fill="var(--color-actual)" radius={[0, 4, 4, 0]} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
