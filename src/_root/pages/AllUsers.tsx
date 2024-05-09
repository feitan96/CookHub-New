import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader, UserCard } from "@/components/shared";
import { useGetUsers, useSearchUsers } from "@/lib/react-query/queries";
import { Input } from "@/components/ui";
import ChatRoom from "./ChatRoom";

const AllUsers = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();
  const { data: searchedUsers, isFetching: isSearchFetching } = useSearchUsers(searchValue);

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    return null;
  }

  const handleClearSearch = () => {
    setSearchValue(""); // Clear the search value
  };

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
              src="/assets/icons/search.svg"
              width={24}
              height={24}
              alt="search"
              />
          <Input
              type="text"
              placeholder="Search cooks/users using their name."
              className="explore-search"
              value={searchValue}
              onChange={(e) => {
                const { value } = e.target;
                setSearchValue(value);
              }}
              />
            {searchValue && (
              <img
                src="/assets/icons/clear.svg"
                width={10}
                height={10}
                alt="clear"
                onClick={handleClearSearch}
                className="cursor-pointer"
                />
              )}
          </div>

          <ChatRoom/>

        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {searchValue && isSearchFetching ? (
              <Loader />
            ) : searchValue && searchedUsers?.documents && searchedUsers?.documents.length === 0 ? (
              <p>No results found</p>
            ) : (
              (searchValue ? searchedUsers?.documents : creators?.documents)?.map((creator) => (
                <li key={creator?.$id} className="flex-1 min-w-[200px] w-full">
                  <UserCard user={creator} />
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
