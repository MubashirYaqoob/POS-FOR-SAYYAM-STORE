"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getLowStockProducts() {
  return await prisma.product.findMany({
    where: { stockQuantity: { lt: 10 } },
    orderBy: { stockQuantity: "asc" },
  });
}

export async function createProduct(data: any) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        buyingPrice: parseFloat(data.buyingPrice),
        sellingPrice: parseFloat(data.sellingPrice),
        stockQuantity: parseInt(data.stockQuantity),
        sizes: JSON.stringify(data.sizes || []),
        colors: JSON.stringify(data.colors || []),
        barcode: data.barcode || "",
      },
    });
    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true, product };
  } catch (error) {
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        buyingPrice: parseFloat(data.buyingPrice),
        sellingPrice: parseFloat(data.sellingPrice),
        stockQuantity: parseInt(data.stockQuantity),
        sizes: JSON.stringify(data.sizes || []),
        colors: JSON.stringify(data.colors || []),
        barcode: data.barcode || "",
      },
    });
    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true, product };
  } catch (error) {
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete product" };
  }
}
