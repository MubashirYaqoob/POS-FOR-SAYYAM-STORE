import prisma from "@/lib/db";
import NewSaleClient from "./NewSaleClient";

export const dynamic = "force-dynamic";

export default async function NewSalePage() {
  const products = await prisma.product.findMany({
    where: { stockQuantity: { gt: 0 } },
    orderBy: { name: "asc" },
  });

  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-gray-800">New Sale</h2>
      <NewSaleClient products={products} customers={customers} />
    </div>
  );
}
