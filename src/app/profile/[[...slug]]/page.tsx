import ProfileCard from "@/components/cards/profile-card";
import VenuesGrid from "@/components/feeds/venues-grid";
import CommandSearch from "@/components/widgets/search";
import ErrorToast from "@/components/widgets/error";
import {
  fetchProfileByName,
  fetchVenuesByProfile,
} from "@/lib/server/api/api.action";
import { fallbackError, transformVenuesToCommands } from "@/lib/utils/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { VenueType } from "@/lib/validation/types";

type Props = {
  params: {
    slug: string;
  };
};

export default async function ProfilePage({ params }: Props) {
  const { slug } = params;
  let profileQuery = undefined;
  let username = undefined;

  if (!slug) {
    username = cookies().get("username");
    if (!username?.value) {
      redirect("/profile/auth");
    }
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

  // console.log("commands----", commands);

  return (
    <section className="mx-auto w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl pb-4 border rounded-2xl">
      {error && <ErrorToast error={error} />}
      {profile ? (
        <>
          <div className="p-4 space-y-3">
            <ProfileCard user={profile} isOwner={isOwner} />
            <CommandSearch commands={commands} />
          </div>
          <VenuesGrid venues={venues || []} />
        </>
      ) : (
        <div className="w-full text-center">Profile not found</div>
      )}
    </section>
  );
}
