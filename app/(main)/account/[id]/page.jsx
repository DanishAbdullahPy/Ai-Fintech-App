import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";

// Yeh ek server component hai jo account details aur transactions dikhata hai
export default async function AccountPage({ params }) {
  // Account ID ko URL params se fetch karte hain
  const accountData = await getAccountWithTransactions(params.id);

  // Agar account nahi milta, to 404 page dikhate hain
  if (!accountData) {
    notFound();
  }

  // accountData se transactions aur baki account details alag karte hain
  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5">
      {/* Account Header Section */}
      <div className="flex gap-4 items-end justify-between">
        <div>
          {/* Account ka naam ek bade, gradient title ke roop mein dikhate hain */}
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          {/* Account type (jaise Current ya Savings) ko lowercase mein dikhate hain */}
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        {/* Balance aur transaction count ko right side pe dikhate hain */}
        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* Chart Section */}
      {/* Suspense ka use karke loading state handle karte hain jab tak chart load nahi hota */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        {/* AccountChart component jo transactions ke basis pe ek chart dikhata hai */}
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transactions Table */}
      {/* Suspense ka use karke loading state handle karte hain jab tak table load nahi hota */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        {/* TransactionTable component jo transactions ko table ke roop mein dikhata hai */}
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}