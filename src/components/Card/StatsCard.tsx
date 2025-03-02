import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HelpCircle,
  ArrowUp,
  ArrowDown,
  MinusCircle,
  Calendar,
  DollarSign,
  Users,
  UserPlus,
  Ticket,
  CalendarDays,
  BarChart,
  ShoppingCart,
  Clock,
  TrendingUp,
  Star,
  Globe,
  Mail,
  Activity,
  CheckCircle,
  AlertCircle,
  LucideIcon,
} from "lucide-react";
import clsx from "clsx";

// Icon mapping by type
const ICON_MAP: Record<string, LucideIcon> = {
  // Financial
  revenue: DollarSign,
  sales: ShoppingCart,
  profit: TrendingUp,

  // Users
  users: Users,
  signups: UserPlus,
  visitors: Globe,

  // Events
  events: CalendarDays,
  bookings: Ticket,
  organisers: Users,

  // Performance
  performance: BarChart,
  engagement: Activity,
  ratings: Star,

  // Time
  time: Clock,

  // Communication
  messages: Mail,

  // Status
  success: CheckCircle,
  warning: AlertCircle,

  // Default
  default: BarChart,
};

// Type Definition
export type StatData = {
  id: string;
  title: string;
  value: string | number;
  type: string; // Instead of direct icon reference
  growth?: {
    value: number;
    label: string;
    trend: "up" | "down" | "neutral";
  };
  date?: string;
  currency?: string;
  tooltipContent?: string;
};

type StatCardProps = StatData & {
  className?: string;
};

export const StatsCard = ({
  title,
  value,
  type,
  growth,
  date,
  currency,
  tooltipContent,
  className,
}: StatCardProps) => {
  // Get icon from map or use default
  const Icon = ICON_MAP[type] || ICON_MAP.default;

  return (
    <Card
      className={clsx(
        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
        "rounded-lg shadow-sm p-6 w-auto h-[165px] flex flex-col justify-between",
        className
      )}
    >
      <CardContent className="flex flex-col gap-3 p-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Icon */}
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
              {title}
            </h3>
          </div>

          {/* Tooltip */}
          {tooltipContent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span>{tooltipContent}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Value (Now includes currency) */}
        <div className="text-4xl font-bold text-gray-900 dark:text-white flex items-center">
          {currency && <span className="text-2xl mr-1">{currency}</span>}
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>

        {/* Growth Indicator */}
        {growth && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <div
              className={clsx("flex items-center gap-1", {
                "text-green-500 dark:text-green-400": growth.trend === "up",
                "text-red-500 dark:text-red-400": growth.trend === "down",
                "text-gray-500 dark:text-gray-400": growth.trend === "neutral",
              })}
            >
              {growth.trend === "up" && <ArrowUp className="w-4 h-4" />}
              {growth.trend === "down" && <ArrowDown className="w-4 h-4" />}
              {growth.trend === "neutral" && (
                <MinusCircle className="w-4 h-4" />
              )}
              <span>{Math.abs(growth.value)}%</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              {growth.label}
            </span>
          </div>
        )}

        {/* Date */}
        {date && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            {date}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
