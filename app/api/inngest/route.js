// app/api/inngest/route.js
import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client"; // Corrected from "inggest" to "ingest"
import {
  checkBudgetAlerts,
  generateMonthlyReports,
  processRecurringTransaction,
  triggerRecurringTransactions,
} from "@/lib/inngest/functions"; // Corrected from "function" to "functions"

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkBudgetAlerts,
    generateMonthlyReports,
    processRecurringTransaction,
    triggerRecurringTransactions,
  ],
});