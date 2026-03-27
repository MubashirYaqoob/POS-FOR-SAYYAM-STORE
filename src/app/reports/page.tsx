import prisma from "@/lib/db";
import ReportsClient from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } }
  });

  const expenses = await prisma.expense.findMany({
    orderBy: { date: "desc" }
  });

  return (
    <div className="space-y-6">
      <ReportsClient initialSales={sales} initialExpenses={expenses} />
    </div>
  );
}
