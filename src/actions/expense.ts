"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getExpenses() {
  return await prisma.expense.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createExpense(data: any) {
  try {
    const expense = await prisma.expense.create({
      data: {
        title: data.title,
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        category: data.category,
      },
    });
    revalidatePath("/expenses");
    revalidatePath("/reports");
    return { success: true, expense };
  } catch (error) {
    return { success: false, error: "Failed to create expense" };
  }
}

export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({ where: { id } });
    revalidatePath("/expenses");
    revalidatePath("/reports");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete expense" };
  }
}
