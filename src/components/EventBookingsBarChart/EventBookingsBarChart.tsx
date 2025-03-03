/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Define the data structure
export type BarChartDataItem = {
  name: string;
  value: number;
  color?: string; // Optional color override for specific bars
};

export type BarChartProps = {
  title: string;
  data: BarChartDataItem[];
  color?: string;
  className?: string;
};

const EventBookingsBarChart: React.FC<BarChartProps> = ({
  title,
  data,
  color = "#3b82f6", // Default blue color
  className = "",
}) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Value: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      className={`w-full p-3 bg-white dark:bg-gray-900 hover:drop-shadow-md border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold pb-5 text-gray-900 dark:text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 30,
                right: 20,
                left: 10,
                bottom: 10,
              }}
              barSize={100} // Thinner bars
            >
              {/* Grid removed for cleaner look */}
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                className="text-gray-500 dark:text-white"
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                className="text-gray-500 dark:text-white"
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(180, 180, 180, 0.1)" }}
              />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || color}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventBookingsBarChart;
