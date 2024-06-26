import VenueCard from "@/components/cards/venue-card-sm";
import ChartWapper from "@/components/feeds/chart-wapper";
import VenuesGrid from "@/components/feeds/venues-grid";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingList from "@/components/widgets/booking-list";
import ErrorToast from "@/components/widgets/error";
import {
  fetchBookingsByProfile,
  fetchProfileByName,
  fetchVenuesByProfile,
} from "@/lib/server/api/api.action";
import {
  fallbackError,
  formatDate,
  groupByWeek,
  calculatePercentageChange,
  getLatestPurchasePrice,
  cn,
} from "@/lib/utils/utils";
import {
  BookingType,
  CustomerType,
  SearchParamsType,
  StatisticsCardProps,
  VenueType,
} from "@/lib/validation/types";
import { CalendarCheck, CirclePlus, DollarSign, Home } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import StatisticsCard from "@/components/cards/statistics-card";
import Table from "@/components/table/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  IoInformationCircle,
  IoInformationCircleOutline,
} from "react-icons/io5";
import ViewBookingsButtonGroup from "@/components/buttons/view-bookings-button-group";

type Props = {
  searchParams: SearchParamsType;
};

export default async function DashboardPage({ searchParams }: Props) {
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
  const { data: bookingsByProfile, error: bookingByProfileError } =
    await fetchBookingsByProfile({
      profileName: profile!.name,
    });
  if (venueError || profileError || bookingByProfileError) {
    return ErrorToast({ error: venueError || profileError || fallbackError });
  }
  if (!profile) {
    redirect("/profile/auth");
  }
  const { venueManager } = profile;

  const count = profile._count;

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

  const totalRevenue = sortedChartData.reduce(
    (total, entry) => total + entry.value,
    0
  );

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

  const allBookings = (venues || []).flatMap((venue) =>
    (venue.bookings || []).map((booking) => ({
      ...booking,
      venueTitle: venue.name,
      venueId: venue.id,
      venuePrice: venue.price,
    }))
  );

  // Map profile bookings to the same format as venue bookings
  const profileBookings = (bookingsByProfile || []).map((booking) => ({
    ...booking,
    venueTitle: booking.venue?.name || "Unknown Venue",
    venueId: booking.venue?.id || "Unknown ID",
    venuePrice: booking.venue?.price || 0,
  }));

  let bookings = profileBookings;
  if (searchParams.search === "incoming") {
    bookings = allBookings;
  }

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
    <section className="mx-auto w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl px-4 pb-4 md:border rounded-2xl">
      <div className="py-4 flex justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {venueManager ? (
          <div className="flex gap-2 items-center">
            <Link
              className={cn(buttonVariants({ variant: "outline" }))}
              href={"/profile"}
            >
              Profile
            </Link>
            <Button asChild>
              <Link href={"/venue/create"} className="flex gap-4">
                <CirclePlus className="w-4 h-4" />
                <span>Create </span>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex ">
            <Link
              className={cn(buttonVariants({ variant: "default" }))}
              href={"/profile/edit"}
            >
              Upgrade
            </Link>
            <h2 className="text-xs"></h2>
            <Popover>
              <PopoverTrigger className="mt-auto">
                <IoInformationCircle className=" h-6 w-auto text-primary" />
              </PopoverTrigger>
              <PopoverContent>
                <p>Become a venue manger to create venues </p>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className=" justify-between md:px-6 ">
          <div className="flex ">
            <TabsTrigger className="text-xs sm:text-sm " value="overview">
              Overview
            </TabsTrigger>
            <TabsTrigger className="text-xs sm:text-sm" value="venues">
              Venues
            </TabsTrigger>
            <TabsTrigger className="text-xs sm:text-sm" value="bookings">
              Bookings
            </TabsTrigger>
            <TabsTrigger className="text-xs sm:text-sm" value="list">
              List
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="overview" className="flex flex-col gap-2">
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
        <TabsContent value={"list"}>
          <Table data={venues} />
        </TabsContent>
        <TabsContent value="bookings">
          <ViewBookingsButtonGroup isVenueManager={venueManager} />
          {allBookings.length > 0 ? (
            <BookingList bookings={bookings} username={username.value} />
          ) : (
            <div>No Bookings here</div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
