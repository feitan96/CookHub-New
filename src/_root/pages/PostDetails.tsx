import { useParams, Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";
import { Loader } from "@/components/shared";
import { GridPostList, PostStats } from "@/components/shared";

import {
  useGetPostById,
  useGetUserPosts,
  useDeletePost,
  useCommentsForPost,
} from "@/lib/react-query/queries";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import CommentForm from "@/components/forms/CommentForm";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();
  
  if (!id) {
    // Replace this with your preferred error handling
    return <p>Error: Post ID is missing.</p>;
  }
  
  const { data: comments, isLoading: isLoadingComments } = useCommentsForPost(id);
  const { data: post, isLoading } = useGetPostById(id);
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
    post?.creator.$id
  );
  const { mutate: deletePost } = useDeletePost();

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );

  const handleDeletePost = () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    if (isConfirmed) {
      deletePost({ postId: id, imageId: post?.imageId });
      navigate(-1);
    }
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img 
            src={post?.imageUrl} 
            alt="creator" 
            className="post_details-img cursor-pointer" 
            onClick={() => window.open(post?.imageUrl, '_blank')}
          />


          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}>
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}>
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p className="mb-2 text-lg font-bold">{post?.name}</p>
              <p className="small-regular text-justify">{post?.caption}</p>
              <ul className="flex flex-wrap gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border w-full border-dark-4/80" />
             
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p className="mb-2 text-lg font-bold">Ingredients</p>
              <ul className="flex flex-col gap-1 mt-2">
                {post?.ingredients.map((ingredient: string, index: number) => (
                  <li key={index} className="">
                    {/* Add bullet point before each ingredient */}
                    &#8226; {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p className="mb-2 text-lg font-bold">Instructions</p>
              <ul className="flex flex-col gap-1 mt-2">
                {post?.instructions.map((instruction: string, index: number) => (
                  <li
                    key={`${instruction}${index}`}
                    className="">
                    {`${index + 1}. ${instruction}`}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>

            <hr className="border w-full border-dark-4/80" />

            <CommentForm action={"Create"} postId={post?.$id} />
            <div className="post_details-comments">
              <h3 className="body-bold">Comments</h3>
              {isLoadingComments ? (
                <p>Loading comments...</p>
              ) : (
                comments?.documents.map((comment: any) => (
                  <div key={comment.$id}>
                    <p>{comment.comment}</p>
                    <p>Posted by: {comment.users}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More From This Cook
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
