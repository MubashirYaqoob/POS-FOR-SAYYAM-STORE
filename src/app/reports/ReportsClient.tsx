"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Download, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

const COLORS = ['#0F6E56', '#BA7517', '#10B981', '#F59E0B', '#3B82F6', '#6366F1'];

export default function ReportsClient({ initialSales, initialExpenses }: { initialSales: any[], initialExpenses: any[] }) {
  const [dateRange, setDateRange] = useState("all");

  const filteredSales = useMemo(() => {
    const now = new Date();
    return initialSales.filter(s => {
      const saleDate = new Date(s.saleDate);
      if (dateRange === "today") return saleDate.toDateString() === now.toDateString();
      if (dateRange === "week") {
        const lastWeek = new Date(now.setDate(now.getDate() - 7));
        return saleDate >= lastWeek;
      }
      if (dateRange === "month") {
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [initialSales, dateRange]);

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalItems = 0;
    let categories: Record<string, number> = {};
    let products: Record<string, {name: string, qty: number, rev: number}> = {};

    filteredSales.forEach(s => {
      totalRevenue += s.totalAmount;
      s.items.forEach((i: any) => {
        totalItems += i.quantity;
        const cat = i.product.category;
        categories[cat] = (categories[cat] || 0) + i.subtotal;

        const pid = i.productId;
        if (!products[pid]) {
          products[pid] = { name: i.product.name, qty: 0, rev: 0 };
        }
        products[pid].qty += i.quantity;
        products[pid].rev += i.subtotal;
      });
    });

    const categoryData = Object.keys(categories).map(name => ({ name, value: categories[name] }));
    const topProducts = Object.values(products).sort((a, b) => b.qty - a.qty).slice(0, 5);

    return { totalRevenue, totalItems, categoryData, topProducts };
  }, [filteredSales]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 print:hidden">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Sales Reports</h2>
        <div className="flex space-x-3 items-center">
          <Select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              {value: "all", label: "All Time"},
              {value: "today", label: "Today"},
              {value: "week", label: "Last 7 Days"},
              {value: "month", label: "This Month"}
            ]}
          />
          <Button onClick={handlePrint}>
            <Download className="w-4 h-4 mr-2" /> PDF Report
          </Button>
        </div>
      </div>

      <div className="print:block hidden mb-8">
        <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Sayyam Store - Financial Report</h1>
        <p className="text-gray-500 pt-2">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary text-white border-transparent">
          <CardHeader className="pb-2 hidden sm:block">
            <CardTitle className="text-sm font-medium text-teal-100">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-0">
            <p className="text-sm font-medium text-teal-100 sm:hidden mb-1">Total Revenue</p>
            <div className="text-2xl font-bold tracking-tight">Rs {stats.totalRevenue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 hidden sm:block">
            <CardTitle className="text-sm font-medium text-gray-500">Sales count</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-0">
            <p className="text-sm font-medium text-gray-500 sm:hidden mb-1">Sales count</p>
            <div className="text-xl font-bold text-gray-800">{filteredSales.length} Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 hidden sm:block">
            <CardTitle className="text-sm font-medium text-gray-500">Items Sold</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-0">
            <p className="text-sm font-medium text-gray-500 sm:hidden mb-1">Items Sold</p>
            <div className="text-xl font-bold text-gray-800">{stats.totalItems} Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 hidden sm:block">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Sale Value</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-0">
            <p className="text-sm font-medium text-gray-500 sm:hidden mb-1">Avg Sale Value</p>
            <div className="text-xl font-bold text-gray-800">
              Rs {filteredSales.length ? Math.round(stats.totalRevenue / filteredSales.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 print:grid-cols-1 print:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category (Revenue)</CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex justify-center items-center">
            {stats.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `Rs ${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400">No data available for selected period.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.topProducts.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 text-center font-bold text-gray-400">#{idx + 1}</div>
                      <div>
                        <p className="font-semibold text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.qty} items sold</p>
                      </div>
                    </div>
                    <div className="font-bold text-primary">Rs {p.rev}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 pt-10 text-center">No sales data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
