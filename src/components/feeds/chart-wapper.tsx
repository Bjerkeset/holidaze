import { formatDate } from "@/lib/utils/utils";
import { BookingType, VenueType, priceDataType } from "@/lib/validation/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import Chart from "../widgets/chart";
import { Button } from "../ui/button";

type Props = {
  sortedChartData: priceDataType[];
};

export default function ChartWapper({ sortedChartData }: Props) {
  // Create a fallback dataset for demo purposes
  const demoChartData = [
    { time: "2024-01-01", value: 10 },
    { time: "2024-02-01", value: 20 },
    { time: "2024-03-01", value: 43 },
    { time: "2024-04-01", value: 40 },
    { time: "2024-05-01", value: 23 },
    { time: "2024-06-01", value: 100 },
    { time: "2024-07-01", value: 70 },
    { time: "2024-08-01", value: 155 },
    { time: "2024-09-01", value: 90 },
    { time: "2024-10-01", value: 234 },
  ];

  const finalChartData =
    sortedChartData.length > 0 ? sortedChartData : demoChartData;

  const isDemoData = sortedChartData.length === 0;

  return (
    <Card className="">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="">
          <CardTitle>{isDemoData ? "Demo Chart" : "Sales over time"}</CardTitle>
          <CardDescription>
            {isDemoData
              ? "This is an example chart with demo data. Sell bookings to populate the dataset."
              : "Earnings from venue bookings over time"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="border-t ">
        <Chart data={finalChartData} />
      </CardContent>
    </Card>
  );
}
