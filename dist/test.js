// test.js
import { checkBudgetAlerts } from "./lib/inngest/functions.js"; // Updated path

console.log("Test log");
console.log("Function imported, attempting to call...");
await checkBudgetAlerts({
  step: {
    run: async (name, fn) => await fn()
  }
});
console.log("Function call attempted");
