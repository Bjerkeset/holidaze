import { cookies } from "next/headers";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

type Props = {};

export default function FavoriteButton({}: Props) {
  const id = "1";
  const isFavorite = false;
  const addFavorite = () => {
    cookies().set({
      name: "favorite",
      value: id,
    });
  };
  const removeFavorite = () => {};
  return (
    <>
      {isFavorite ? (
        <IoMdHeart className="text-2xl text-red-500" onClick={addFavorite} />
      ) : (
        <IoMdHeartEmpty
          onClick={removeFavorite}
          className="text-2xl hover:text-red-500 transition-colors "
        />
      )}
    </>
  );
}
