import { useParams, Link, useNavigate } from "react-router-dom";

import { Button, toast } from "@/components/ui";
import { Loader } from "@/components/shared";
import { GridPostList, PostStats } from "@/components/shared";

import {
  useGetPostById,
  useGetUserPosts,
  useDeletePost,
} from "@/lib/react-query/queries";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { appwriteConfig, client, databases } from "@/lib/appwrite/config";
import { ID, Query } from "appwrite";
import { Trash2 } from "react-feather";

type Message = {
  user_id: string
  username: any
  $id: string;
  $createdAt: number;
  comment: string;
  imageUrl: string;
}

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();
  const [messageBody, setMessageBody] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    getMessages();
  
    const unsubscribe = client.subscribe(`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`, response => {
  
      if(response.events.includes("databases.*.collections.*.documents.*.create")){
        console.log('A MESSAGE WAS CREATED')
        setMessages(prevState => [(response.payload as Message), ...prevState])
      }
  
      if(response.events.includes("databases.*.collections.*.documents.*.delete")){
        console.log('A MESSAGE WAS DELETED!!!')
        setMessages(prevState => prevState.filter(message => message.$id !== (response.payload as Message).$id))
      }
    });
  
    console.log('unsubscribe:', unsubscribe)
  
    return () => {
      unsubscribe();
    };
  }, []);
  

  const getMessages = async () => {
    const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.commentsCollectionId,
        [
            Query.orderDesc('$createdAt'),
            Query.limit(100),
            Query.equal('post_id', id)
        ]
    )
    console.log(response.documents)
    setMessages(response.documents)
}


const handleSubmit = async (e: { preventDefault: () => void }) => {
  e.preventDefault()

  // Check if the messageBody is not empty
  if (messageBody.trim() === '') {
      alert('Comment cannot be empty');
      return;
  }

  let payload = {
      user_id: user.id,  
      username: user.name,
      comment: messageBody,
      imageUrl: user.imageUrl,
      post_id: id
  }

  let response = await databases.createDocument(
      appwriteConfig.databaseId, 
      appwriteConfig.commentsCollectionId, 
      ID.unique(), 
      payload
  )
  console.log('CREATED:', response)
  toast({ title: "Comment Posted", });

  setMessageBody('')
}

  
  const deleteMessage = async (id: string) => {
    await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.commentsCollectionId, id);
    toast({ title: "Comment Deleted", });
  } 
  
  if (!id) {
    return <p>Error: Post ID is missing.</p>;
  }
  
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
      toast({ title: "Deleted Post", });
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
            {/*COMMENT FEATURE HERE*/}
            <hr className="border w-full border-dark-4/80" />

            <p className="mb-2 text-lg font-bold">Comments</p> 
            <main className="container" style={{ width: '100%', maxWidth: '1000px' }}>
              <div className="room--container">
                  <form id="message--form" onSubmit={handleSubmit}>
                    <div>
                        <textarea 
                            required 
                            className="text-white"
                            placeholder="Say something about post..." 
                            onChange={(e) => {setMessageBody(e.target.value)}}
                            value={messageBody}
                            ></textarea>
                    </div>

                    <div className="send-btn--wrapper bg-dark-2">
                        <input className="btn btn--secondary" type="submit" value="post comment"/>
                    </div>
                  </form>
                  <div className="custom-scrollbar bg-dark-2" style={{  overflowY: 'auto', maxHeight: '700px', paddingTop: '5px'  }}>
                    {messages.map(message => (
                        <div key={message.$id} className="message--wrapper" style={{marginBottom: '25px', marginTop: '25px'}}>
                            <div className="message--header">
                              <div className="flex gap-3">
                                <img 
                                  src={message.imageUrl ||
                                    "/assets/icons/profile-placeholder.svg"} 
                                  alt={message.username} 
                                  className="user-image w-12 lg:h-12 rounded-full" 
                                />

                                <div>
                                  <p className="flex flex-row"> 
                                      {message?.username ? (
                                          <span> {message?.username}</span>
                                      ): (
                                          'Anonymous user'
                                      )}
                                      <p className="message-timestamp">{multiFormatDateString(message.$createdAt)}</p>
                                  </p>
                                </div>
                              </div>
                              {user.id === message.user_id && (
                                <Trash2 
                                    className="delete--btn"
                                    onClick={() => {deleteMessage(message.$id)}}
                                />
                              )}
                            </div>
                            <div className="message--body" style={{marginLeft: '55px', marginTop: '-20px'}}>
                                <span>{message.comment}</span>
                            </div>

                        </div>
                    ))}
                </div>
              
                </div>
            </main>
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
