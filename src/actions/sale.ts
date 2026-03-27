"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createSale(data: any) {
  try {
    // Start transaction
    const sale = await prisma.$transaction(async (tx) => {
      // 1. Create Sale
      const newSale = await tx.sale.create({
        data: {
          customerId: data.customerId || null,
          totalAmount: data.totalAmount,
          discount: data.discount,
          paidAmount: data.paidAmount,
          paymentMethod: data.paymentMethod,
        },
      });

      // 2. Create Sale Items and Decrement Stock
      for (const item of data.items) {
        await tx.saleItem.create({
          data: {
            saleId: newSale.id,
            productId: item.productId,
            size: item.size || null,
            color: item.color || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          },
        });

        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productName}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      // 3. Update Customer Total Purchases
      if (data.customerId) {
        await tx.customer.update({
          where: { id: data.customerId },
          data: {
            totalPurchases: { increment: data.totalAmount },
            lastVisit: new Date(),
          },
        });
      }

      return newSale;
    });

    revalidatePath("/");
    revalidatePath("/inventory");
    revalidatePath("/customers");
    revalidatePath("/reports");
    
    return { success: true, sale };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to complete sale" };
  }
}

export async function getRecentSales() {
  return await prisma.sale.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { customer: true, items: { include: { product: true } } },
  });
}
