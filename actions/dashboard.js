"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized: User not logged in");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  try {
    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    const serializedAccounts = accounts.map((account) => ({
      ...account,
      balance: account.balance.toNumber(),
      transactionCount: account._count.transactions,
    }));
    return serializedAccounts;
  } catch (error) {
    console.error("Error fetching accounts:", error.message);
    throw new Error("Failed to fetch accounts: " + error.message);
  }
}

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized: User not logged in");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat) || balanceFloat < 0) {
      throw new Error("Invalid balance amount");
    }
    if (!data.name || !["CURRENT", "SAVINGS"].includes(data.type)) {
      throw new Error("Invalid account data");
    }

    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        name: data.name,
        type: data.type,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: { ...account, balance: balanceFloat } };
  } catch (error) {
    throw new Error(error.message || "Failed to create account");
  }
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized: User not logged in");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  try {
    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      include: {
        account: {
          select: { name: true },
        },
      },
    });

    const serializedTransactions = transactions.map((transaction) => ({
      ...transaction,
      amount: transaction.amount.toNumber(),
      accountName: transaction.account.name,
    }));

    return serializedTransactions;
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    throw new Error("Failed to fetch transactions: " + error.message);
  }
}