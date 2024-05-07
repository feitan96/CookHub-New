import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { CommentValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useCommentPost } from "@/lib/react-query/queries";
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Textarea, toast } from "../ui";
import { Loader } from "../shared";


type CommentFormProps = {
  post?: Models.Document;
    action: "Create";
    postId: string;
};

const CommentForm = ({ post, action, postId  }: CommentFormProps) => {
    const navigate = useNavigate();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: post ? post?.comment : "",
    },
  });

    const { mutateAsync: commentPost, isLoading: isLoadingComment } =
    useCommentPost();

    const handleSubmit = async (value: z.infer<typeof CommentValidation>) => {

    
        // ACTION = CREATE
        const newComment = await commentPost({
            ...value,
            userId: user.id,
            postId: postId
        });
    
        if (!newComment) {
          toast({
            title: `${action} comment failed. Please try again.`,
          });
        }
      };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Comment</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  placeholder="di pani mogana pero maka store na syas database nig post comment so ayaw i spam"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingComment}>
            {(isLoadingComment) && <Loader />}
            Post Comment
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CommentForm