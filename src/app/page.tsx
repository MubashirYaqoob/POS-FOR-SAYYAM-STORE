import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import prisma from "@/lib/db";
import { DollarSign, Package, Users, AlertTriangle } from "lucide-react";
import DashboardChart from "@/components/DashboardChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    todaySales,
    todaySalesCount,
    todayCustomers,
    lowStockItems,
    weeklySalesRaw
  ] = await Promise.all([
    prisma.sale.aggregate({
      where: { saleDate: { gte: todayStart } },
      _sum: { totalAmount: true },
    }),
    prisma.sale.count({
      where: { saleDate: { gte: todayStart } },
    }),
    prisma.sale.groupBy({
      by: ['customerId'],
      where: { 
        saleDate: { gte: todayStart },
        customerId: { not: null }
      },
    }),
    prisma.product.findMany({
      where: { stockQuantity: { lt: 10 } },
      take: 5,
    }),
    prisma.$queryRaw`
      SELECT 
        date(saleDate) as date, 
        SUM(totalAmount) as total 
      FROM Sale 
      WHERE saleDate >= datetime('now', '-7 days')
      GROUP BY date(saleDate)
      ORDER BY date(saleDate) ASC
    ` as Promise<any[]>
  ]);

  const recentTransactions = await prisma.sale.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  const weeklySales = weeklySalesRaw.map(v => ({
    name: new Date(v.date).toLocaleDateString("en-US", { weekday: "short" }),
    total: Number(v.total)
  }));

  const formatter = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-gray-800">Overview</h2>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
            <CardTitle className="text-sm font-medium text-gray-500">Aaj ki Sales</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">
              {formatter.format(todaySales._sum.totalAmount || 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
            <CardTitle className="text-sm font-medium text-gray-500">Aaj bechey items</CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{todaySalesCount} Sales</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
            <CardTitle className="text-sm font-medium text-gray-500">Aaj ke Customers</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{todayCustomers.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
            <CardTitle className="text-sm font-medium text-accent">Low Stock Alert</CardTitle>
            <AlertTriangle className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{lowStockItems.length} items</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Weekly Sales Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <DashboardChart data={weeklySales} />
          </CardContent>
        </Card>
        
        <div className="col-span-3 space-y-4">
          {/* Low Stock Items List */}
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.length > 0 ? lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <div className="font-medium text-accent">{item.stockQuantity} left</div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500">All items are sufficiently stocked.</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map(tx => (
                  <div key={tx.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none text-gray-800">
                        {tx.customer?.name || "Walk-in Customer"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.saleDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-gray-800">
                      +{formatter.format(tx.totalAmount)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
