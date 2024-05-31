import ProfileCard from "@/components/cards/profile-card";
import VenuesGrid from "@/components/feeds/venues-grid";
import CommandSearch from "@/components/widgets/search";
import ErrorToast from "@/components/widgets/error";
import {
  fetchProfileByName,
  fetchVenuesByProfile,
} from "@/lib/server/api/api.action";
import {
  capitalizeFirstLetter,
  transformVenuesToCommands,
} from "@/lib/utils/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParamsType } from "@/lib/validation/types";
import ResetButton from "@/components/buttons/reset-button";

type Props = {
  params: {
    slug: string;
  };
  searchParams: SearchParamsType;
};

export default async function ProfilePage({ params, searchParams }: Props) {
  const { slug } = params;
  let profileQuery = undefined;
  let username = undefined;
  let isLoggedIn = false;

  username = cookies().get("username");

  if (!username?.value) {
    redirect("/profile/auth");
  }

  if (!slug) {
    profileQuery = username.value;
  } else {
    profileQuery = slug;
    username = cookies().get("username");
  }

  if (!profileQuery) {
    return redirect("profile/auth");
  }

  const { data: profile, error: profileError } = await fetchProfileByName(
    profileQuery
  );
  const { data: venues, error: venuesError } = await fetchVenuesByProfile(
    profileQuery
  );

  const error = venuesError || profileError;
  const isOwner = profile?.name === username?.value;
  const commands = transformVenuesToCommands(venues || []);

  // Filter venues based on searchParams.search if it's defined
  let filteredVenues = venues || [];
  if (searchParams.search) {
    const searchQuery = searchParams.search.toLowerCase();
    filteredVenues = filteredVenues.filter((venue) =>
      venue.name.toLowerCase().includes(searchQuery)
    );
  }

  return (
    <section className="mx-auto w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl pb-4 border rounded-2xl">
      {error && <ErrorToast error={error} />}
      {profile ? (
        <>
          <div className="p-4 space-y-3 ">
            <ProfileCard user={profile} isOwner={isOwner} />
            <div className="flex flex-col md:flex-row">
              <h1 className="text-2xl font-bold">
                {isOwner
                  ? "Your Venues"
                  : `${capitalizeFirstLetter(profile.name)}'s Venues`}
              </h1>
              <CommandSearch
                className={"w-full md:ml-auto md:w-1/2"}
                commands={commands}
                searchParams={searchParams}
              />
            </div>
          </div>

          <VenuesGrid venues={filteredVenues} />
        </>
      ) : (
        <div className="w-full text-center">Profile not found</div>
      )}
    </section>
  );
}
