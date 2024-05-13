import BookButtonGroup from "@/components/buttons/book-button-group";
import VenueCardXl from "@/components/cards/venue-card-xl";
import CheckoutForm from "@/components/forms/checkout-form";
import { fetchBookings, fetchVenueById } from "@/lib/server/api/api.action";
import { cookies } from "next/headers";

export default async function VenuePage({
  params,
}: {
  params: { id: string };
}) {
  let data = null;
  const { data: venue } = await fetchVenueById(params.id);
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  // console.log("accessToken", AccessToken?.value);

  if (accessToken) {
    data = await fetchBookings({
      includeCustomer: true,
      includeVenue: true,
      accessToken: accessToken?.value,
    });
    console.log("data", data);
  }

  if (!venue) {
    return <p>Could not find venue</p>;
  }

  return (
    <div>
      <VenueCardXl venue={venue} />
      {/* <BookButtonGroup /> */}
      <CheckoutForm venue={venue} />
    </div>
  );
}
