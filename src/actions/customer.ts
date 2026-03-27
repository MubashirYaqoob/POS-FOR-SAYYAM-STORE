"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCustomers() {
  return await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createCustomer(data: any) {
  try {
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address || "",
      },
    });
    revalidatePath("/customers");
    revalidatePath("/sales/new");
    return { success: true, customer };
  } catch (error) {
    return { success: false, error: "Failed to create customer" };
  }
}

export async function updateCustomer(id: string, data: any) {
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address || "",
      },
    });
    revalidatePath("/customers");
    return { success: true, customer };
  } catch (error) {
    return { success: false, error: "Failed to update customer" };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await prisma.customer.delete({ where: { id } });
    revalidatePath("/customers");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete customer" };
  }
}
