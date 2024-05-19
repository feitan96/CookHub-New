import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useToast } from "../ui"
import { useGetUsers, useSearchUsers } from "@/lib/react-query/queries"
import { useState } from "react"
import Loader from "./Loader"
import UserChatCard from "./UserChatCard"

const ChatSheet = () => {
    const { toast } = useToast();
    const [searchValue, setSearchValue] = useState("");
    const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();
    const { data: searchedUsers, isFetching: isSearchFetching } = useSearchUsers(searchValue);
  
    if (isErrorCreators) {
      toast({ title: "Something went wrong." });
      return null;
    }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"
        style={{
            backgroundColor: 'rgb(18,55,42)',
        }}
        >Chat With Others</Button>
      </SheetTrigger>
      <SheetContent className="bg-black">
        <div className="common-container py-3 px-2 md:px-3 lg:p-6">
            <div className="user-container">
                <h2 className="h3-bold md:h2-bold text-left w-full">Search Cooks</h2>
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
                {isLoading && !creators ? (
                <Loader />
                ) : (
                <ul className="flex flex-col items-center gap-8">
                    {searchValue && isSearchFetching ? (
                    <Loader />
                    ) : searchValue && searchedUsers?.documents && searchedUsers?.documents.length === 0 ? (
                    <p>No results found</p>
                    ) : (
                    (searchValue ? searchedUsers?.documents : creators?.documents)?.map((creator) => (
                        <li key={creator?.$id} className="w-full">
                        <UserChatCard user={creator} />
                        </li>
                    ))
                    )}
                </ul>
                )}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ChatSheet;