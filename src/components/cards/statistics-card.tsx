import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatisticsCardProps } from "@/lib/validation/types";
import { ReactNode } from "react";

export default function StatisticsCard({
  title,
  value,
  icon,
  description,
  percentageChange,
}: StatisticsCardProps) {
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-nowrap flex items-center gap-1">
          <span>{title}</span>
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {percentageChange !== undefined && (
          <p className="text-xs text-muted-foreground">
            {percentageChange > 0 ? "+" : ""}
            {percentageChange.toFixed(1)}% from last week
          </p>
        )}
      </CardContent>
    </Card>
  );
}
