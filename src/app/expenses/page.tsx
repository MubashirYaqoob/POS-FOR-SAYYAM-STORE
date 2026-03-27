import prisma from "@/lib/db";
import ExpensesClient from "./ExpensesClient";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: { date: "desc" }
  });

  return (
    <div className="space-y-6">
      <ExpensesClient initialExpenses={expenses} />
    </div>
  );
}
