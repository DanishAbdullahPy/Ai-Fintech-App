"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { updateDefaultAccount } from "@/actions/account";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault, transactionCount } = account;
  const [isLoading, setIsLoading] = useState(false);
  const [isDefaultState, setIsDefaultState] = useState(isDefault);

  const handleDefaultChange = async () => {
    if (isDefaultState) {
      toast.warning("You need at least 1 default account");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateDefaultAccount(id);
      if (result.success) {
        setIsDefaultState(true);
        toast.success("Default account updated successfully");
        // Force revalidation of the dashboard
        window.location.reload(); // Temporary fix to refresh UI
      } else {
        toast.error(result.error || "Failed to update default account");
      }
    } catch (error) {
      toast.error("Failed to update default account: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDefault !== isDefaultState) {
      setIsDefaultState(isDefault);
    }
  }, [isDefault]);

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Link href={`/account/${id}`}>
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
        </Link>
        <Switch
          checked={isDefaultState}
          onCheckedChange={handleDefaultChange}
          disabled={isLoading}
        />
      </CardHeader>
      <Link href={`/account/${id}`}>
        <CardContent>
          <div className="text-2xl font-bold">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Transactions: {transactionCount || 0}
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            View Details
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}