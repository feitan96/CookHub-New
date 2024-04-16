import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useRatePost,
  useGetCurrentUser
} from "@/lib/react-query/queries";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavePost } = useDeleteSavedPost();
  const { mutate: ratePostMutation } = useRatePost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
    // Calculate average rating when post data changes
    calculateAverageRating();
  }, [currentUser, post]);

  useEffect(() => {
    // Retrieve rated posts from local storage
    const ratedPosts = JSON.parse(localStorage.getItem('ratedPosts') || '{}');
    // Check if the current user has rated the post
    setIsRated(Array.isArray(ratedPosts[post.$id]) && ratedPosts[post.$id].includes(userId));
  }, [post, userId]);

  const calculateAverageRating = () => {
    // Calculate average rating logic here
    const totalRatings = post.ratings.length;
    const sumRatings = post.ratings.reduce((acc: number, rating: { rating: number }) => acc + rating.rating, 0);
    const average = totalRatings > 0 ? sumRatings / totalRatings : 0;
    setAverageRating(average);
  };
  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost(savedPostRecord.$id);
    }

    savePost({ userId: userId, postId: post.$id });
    setIsSaved(true);
  };

  const handleRatePost = () => {
    const ratingPrompt = prompt("Please rate this post from 0.0 to 5.0");
    if (ratingPrompt === null) return; // If prompt is cancelled, exit the function
    const ratingInput = parseFloat(ratingPrompt);
    if (ratingInput >= 0 && ratingInput <= 5) {
      // Update rated state and store in local storage
      setIsRated(true);
      const ratedPosts = JSON.parse(localStorage.getItem('ratedPosts') || '{}');
      const userRatings = Array.isArray(ratedPosts[post.$id]) ? ratedPosts[post.$id] : [];
      // Add current user to the list of rated users for this post
      ratedPosts[post.$id] = [...userRatings, userId];
      localStorage.setItem('ratedPosts', JSON.stringify(ratedPosts));
      ratePostMutation({ postId: post.$id, userId, rating: ratingInput });
    } else {
      alert("Please enter a valid rating between 0.0 and 5.0");
    }
  };
  
  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
        {/* Show different icons based on whether the post is rated or not */}
        {isRated ? (
          <img
            src="/assets/icons/rated2.svg"
            alt="rated"
            width={20}
            height={20}
            className="cursor-pointer"
          />
        ) : (
          <img
            src="/assets/icons/rate2.svg"
            alt="rate"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleRatePost}
          />
        )}
        {/* Display the average rating */}
        <p>{averageRating.toFixed(1)}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div>
    </div>
  );
};

export default PostStats;
