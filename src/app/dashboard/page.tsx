import VenueCard from "@/components/cards/venue-card-sm";
import ChartWapper from "@/components/feeds/chart-wapper";
import VenuesGrid from "@/components/feeds/venues-grid";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingList from "@/components/widgets/booking-list";
import ErrorToast from "@/components/widgets/error";
import {
  fetchProfileByName,
  fetchVenuesByProfile,
} from "@/lib/server/api/api.action";
import {
  fallbackError,
  formatDate,
  groupByWeek,
  calculatePercentageChange,
  getLatestPurchasePrice,
  formatTimeFrame,
} from "@/lib/utils/utils";
import {
  BookingType,
  StatisticsCardProps,
  VenueType,
} from "@/lib/validation/types";
import { CalendarCheck, CirclePlus, DollarSign, Home } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import StatisticsCard from "@/components/cards/statistics-card";
import ProfileAvatar from "@/components/widgets/profile-avatar";

export default async function DashboardPage() {
  const username = cookies().get("username");
  if (!username) {
    redirect("/profile/auth");
  }
  const { data: profile, error: profileError } = await fetchProfileByName(
    username.value
  );
  const { data: venues, error: venueError } = await fetchVenuesByProfile(
    username.value
  );
  if (venueError || profileError) {
    return ErrorToast({ error: venueError || profileError || fallbackError });
  }
  if (!profile) {
    redirect("/profile/auth");
  }
  const { venueManager } = profile;

  const count = profile._count;

  console.log("count------", count);

  // Create chart data and aggregate values for duplicate dates
  const chartData = (venues || []).reduce<{ time: string; value: number }[]>(
    (acc, venue) => {
      if (Array.isArray(venue.bookings)) {
        venue.bookings.forEach((booking) => {
          const formattedDate = formatDate(booking.dateFrom, "yyyy-MM-dd");
          const existingEntry = acc.find(
            (entry) => entry.time === formattedDate
          );
          if (existingEntry) {
            existingEntry.value += venue.price;
          } else {
            acc.push({
              time: formattedDate,
              value: venue.price,
            });
          }
        });
      }
      return acc;
    },
    []
  );

  // Sort the chart data by time
  const sortedChartData = chartData.sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  console.log("sorted chart data-----", sortedChartData);

  const totalRevenue = sortedChartData.reduce(
    (total, entry) => total + entry.value,
    0
  );
  console.log("totla revenue---", totalRevenue);

  // Group data by week
  const weeklyRevenue = groupByWeek(sortedChartData);

  // Get the current week and last week's revenues
  const weeks = Object.keys(weeklyRevenue).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  const currentWeekRevenue = weeklyRevenue[weeks[weeks.length - 1]] || 0;
  const lastWeekRevenue = weeklyRevenue[weeks[weeks.length - 2]] || 0;

  // Calculate the percentage change
  const percentageChange = calculatePercentageChange(
    currentWeekRevenue,
    lastWeekRevenue
  );

  // Calculate the number of sales/bookings for the current and last week
  const currentWeekStart = new Date(weeks[weeks.length - 1]);
  const lastWeekStart = new Date(weeks[weeks.length - 2]);
  const currentWeekBookings = sortedChartData.filter(
    (entry) => new Date(entry.time) >= currentWeekStart
  ).length;
  const lastWeekBookings = sortedChartData.filter(
    (entry) =>
      new Date(entry.time) >= lastWeekStart &&
      new Date(entry.time) < currentWeekStart
  ).length;

  const latestPurchasePrice = getLatestPurchasePrice(sortedChartData);

  const allBookings = (venues || []).flatMap((venue) => venue.bookings || []);

  console.log("Latest Purchase Price:", latestPurchasePrice);
  console.log("current week revenue---", currentWeekRevenue);
  console.log("last week revenue---", lastWeekRevenue);
  console.log("percentage change---", percentageChange);
  console.log("current week bookings---", currentWeekBookings);
  console.log("last week bookings---", lastWeekBookings);
  console.log("allBookings-------", allBookings);

  const STATS_DATA = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue}`,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      description: latestPurchasePrice
        ? `+${latestPurchasePrice} latest sale`
        : undefined,
    },
    {
      title: "Weekly Revenue",
      value: `$${currentWeekRevenue}`,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      percentageChange,
    },
    {
      title: "Total Sales",
      value: sortedChartData.length,
      icon: <CalendarCheck className="h-4 w-4 text-muted-foreground" />,
      description: `+${currentWeekBookings} last week`,
    },
    {
      title: "Venues",
      value: count.venues,
      icon: <Home className="h-4 w-4 text-muted-foreground" />,
      description: "Venues for sale",
    },
  ];

  return (
    <section className="mx-auto w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl px-4 pb-4 border rounded-2xl">
      <div className="py-4 flex justify-between">
        <h1 className="text-2xl">Dashboard</h1>
        {venueManager ? (
          <Button size={"default"} asChild>
            <Link href={"/venue/create"} className="flex gap-4">
              <CirclePlus className="w-4 h-4" />
              <span>Create </span>
            </Link>
          </Button>
        ) : (
          <Button>Upgrade</Button>
        )}
      </div>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className=" justify-between px-6">
          <div className="flex ">
            <TabsTrigger className="text-xs sm:text-sm" value="account">
              Account
            </TabsTrigger>
            <TabsTrigger className="text-xs sm:text-sm" value="venues">
              Venues
            </TabsTrigger>
            <TabsTrigger className="text-xs sm:text-sm" value="bookings">
              Bookings
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="account" className="flex flex-col gap-2">
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {STATS_DATA.map((stat: StatisticsCardProps, index) => (
              <StatisticsCard key={index} {...stat} />
            ))}
          </div>
          <ChartWapper sortedChartData={sortedChartData || []} />
        </TabsContent>
        <TabsContent value="venues" className="">
          <VenuesGrid venues={venues || []} />
        </TabsContent>
        <TabsContent value="bookings" className="">
          {allBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-2 text-sm space-y-2 my-2 rounded-none"
            >
              <div className="flex items-center">
                {booking.customer && (
                  <ProfileAvatar profile={booking.customer} />
                )}
                <p className="text-nowrap">
                  {booking.guests} Guest{booking.guests > 1 && "s"}
                </p>
              </div>
              <div className="text-xs flex items-center justify-between">
                <p>{formatDate(booking.dateFrom)}</p>
                <p className=" ">
                  {formatTimeFrame(booking.dateFrom, booking.dateTo)} booked
                </p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
}
