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
    { time: "2024-03-01", value: 30 },
    { time: "2024-04-01", value: 40 },
    { time: "2024-05-01", value: 50 },
    { time: "2024-06-01", value: 60 },
    { time: "2024-07-01", value: 70 },
    { time: "2024-08-01", value: 80 },
    { time: "2024-09-01", value: 90 },
    { time: "2024-10-01", value: 100 },
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
              ? "This is an example chart with demo data. Recive bookings to "
              : "Earnings from venue bookings over time"}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button size={"sm"} variant={"outline"}>
            Day
          </Button>
          <Button size={"sm"} variant={"outline"}>
            Week
          </Button>
        </div>
      </CardHeader>
      <CardContent className="border-t ">
        <Chart data={finalChartData} />
      </CardContent>
    </Card>
  );
}
