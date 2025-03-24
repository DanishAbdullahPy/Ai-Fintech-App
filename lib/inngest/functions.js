import { inngest } from "./client";
import { db } from "@/lib/prisma";
import EmailTemplate from "@/emails/template";
import { sendEmail } from "@/actions/send-email";

// 1. Recurring Transaction Processing with Throttling
export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10, // Process 10 transactions
      period: "1m", // per minute
      key: "event.data.userId", // Throttle per user
    },
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: { account: true },
      });

      if (!transaction || !isTransactionDue(transaction)) return;

      await db.$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });

        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });

        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);

// Trigger recurring transactions with batching
export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions",
  },
  { cron: "0 0 * * *" }, // Daily at midnight
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              { nextRecurringDate: { lte: new Date() } },
            ],
          },
        });
      }
    );

    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: { transactionId: transaction.id, userId: transaction.userId },
      }));
      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  }
);

// 2. Monthly Report Generation
export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
  },
  { cron: "0 0 1 * *" }, // First day of each month
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({ include: { accounts: true } });
    });

    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user.id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", { month: "long" });

        await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          react: EmailTemplate({
            userName: user.name,
            type: "monthly-report",
            data: { stats, month: monthName, insights: [] },
          }),
        }).catch((error) => console.error(`Email failed for ${user.email}:`, error));
      });
    }

    return { processed: users.length };
  }
);

// 3. Budget Alerts with Event Batching
export const checkBudgetAlerts = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "* * * * *" }, // Every minute
  async ({ step }) => {
    console.log("Starting checkBudgetAlerts at:", new Date().toISOString());
    try {
      const budgets = await step.run("fetch-budgets", async () => {
        const fetchedBudgets = await db.budget.findMany({
          include: {
            user: {
              include: {
                accounts: { where: { isDefault: true } },
              },
            },
          },
        }).catch((error) => {
          console.error("Failed to fetch budgets:", error);
          throw error;
        });
        console.log("Fetched budgets:", fetchedBudgets);
        return fetchedBudgets;
      });

      for (const budget of budgets || []) {
        const defaultAccount = budget.user.accounts[0];
        if (!defaultAccount) {
          console.log(`No default account for budget ${budget.id}, skipping`);
          continue;
        }

        await step.run(`check-budget-${budget.id}`, async () => {
          try {
            console.log(`Checking budget ${budget.id}:`, budget);
            const startDate = new Date();
            startDate.setDate(1);

            const expenses = await db.transaction.aggregate({
              where: {
                userId: budget.userId,
                accountId: defaultAccount.id,
                type: "EXPENSE",
                date: { gte: startDate },
              },
              _sum: { amount: true },
            }).catch((error) => {
              console.error(`Failed to aggregate expenses for ${budget.id}:`, error);
              throw error;
            });

            const totalExpenses = expenses._sum.amount?.toNumber() || 0;
            const budgetAmount = budget.amount;
            const percentageUsed = (totalExpenses / budgetAmount) * 100 || 0;
            console.log(`Budget ${budget.id} - Total Expenses: ${totalExpenses}, Budget Amount: ${budgetAmount}, Percentage Used: ${percentageUsed}%`);

            // Removed isNewMonthAlert to allow emails every minute
            if (percentageUsed >= 80) {
              console.log(`Triggering email for budget ${budget.id} at ${percentageUsed}% usage`);
              await sendEmail({
                to: budget.user.email,
                subject: `Budget Alert for ${defaultAccount.name}`,
                react: EmailTemplate({
                  userName: budget.user.name,
                  type: "budget-alert",
                  data: {
                    percentageUsed,
                    budgetAmount: parseInt(budgetAmount).toFixed(1),
                    totalExpenses: parseInt(totalExpenses).toFixed(1),
                    accountName: defaultAccount.name,
                  },
                }),
              }).catch((error) => console.error(`Email failed for ${budget.id}:`, error));

              await db.budget.update({
                where: { id: budget.id },
                data: { lastAlertSent: new Date() },
              }).catch((error) => console.error(`Failed to update lastAlertSent for ${budget.id}:`, error));

              console.log(`Email sent and lastAlertSent updated for budget ${budget.id}`);
            } else {
              console.log(`No email sent for budget ${budget.id}: Percentage ${percentageUsed}%`);
            }
          } catch (error) {
            console.error(`Error processing budget ${budget.id}:`, error);
          }
        });
      }
    } catch (error) {
      console.error("Error in checkBudgetAlerts:", error);
    }
    console.log("CheckBudgetAlerts completed");
  }
);

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}

function isTransactionDue(transaction) {
  if (!transaction.lastProcessed) return true;
  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);
  return nextDue <= today;
}

function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

async function getMonthlyStats(userId, month) {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: { userId, date: { gte: startDate, lte: endDate } },
  }).catch((error) => {
    console.error(`Failed to fetch transactions for ${userId}:`, error);
    return [];
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    { totalExpenses: 0, totalIncome: 0, byCategory: {}, transactionCount: transactions.length }
  );
}