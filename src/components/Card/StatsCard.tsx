import React from "react";
import { Card, CardContent } from "../ui/card";
import { type LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  icon: LucideIcon;
  currency?: string;
  amount: number;
};

const StatsCard = ({ title, icon: Icon, currency, amount }: StatsCardProps) => {
  return (
    <Card className="w-full rounded-lg shadow-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-md">
          <Icon className="text-gray-800 dark:text-gray-300" size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {currency}
            {amount.toLocaleString()} {/* Formats the number with commas */}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
