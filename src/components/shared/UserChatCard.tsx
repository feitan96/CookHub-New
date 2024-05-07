import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext"; 

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  useUserContext(); // Get the logged-in user

  return (
    <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
    <img
      src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
      alt="profile"
      className="h-12 w-12 rounded-full"
    />
    <div className="flex flex-col">
      <p className="body-bold">{user.name}</p>
      <p className="small-regular text-light-3">@{user.username}</p>
    </div>
  </Link>
  );
};

export default UserCard;
