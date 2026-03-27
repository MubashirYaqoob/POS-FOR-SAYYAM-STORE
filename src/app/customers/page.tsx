import prisma from "@/lib/db";
import CustomersClient from "./CustomersClient";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    include: {
      sales: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { items: { include: { product: true } } }
      }
    }
  });

  return (
    <div className="space-y-6">
      <CustomersClient initialCustomers={customers} />
    </div>
  );
}
