import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext"; // Import useUserContext

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { user: loggedInUser } = useUserContext(); // Get the logged-in user

  return (
    <Link to={`/profile/${user.$id}`} className="user-card" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      {loggedInUser.id !== user.$id && ( // Only show the Follow button for other users
        <Button type="button" size="sm" className="shad-button_primary px-5 bg-[rgb(18,55,42)]">
          Follow
        </Button>
      )}
    </Link>
  );
};

export default UserCard;
