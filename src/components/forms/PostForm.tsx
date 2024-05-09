import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { FileUploader, Loader } from "@/components/shared";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries";
import TagsMenu from "../shared/TagsMenu";
import { useEffect, useState } from "react";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const [tags, setTags] = useState<string[]>([]);
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      name: post ? post?.name : "",
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      ingredients: post ? post.ingredients.join(", ") : "",
      instructions: post ? post.instructions.join("/ ") : "",
      tags: post ? post.tags.join(", ") : "",
    },
  });

  useEffect(() => {
    form.register('tags');
  }, [form.register]);
  

  // Query
  const { mutateAsync: createPost, isLoading: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } =
    useUpdatePost();

  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    // ACTION = UPDATE
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });

      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }

      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      } else {
        toast({
          title: "Post Updated",
        });
      }

      return navigate(`/posts/${post.$id}`);
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      userId: user.id,
      caption: `${value.caption} Tags: ${value.tags}`, // Add tags to the caption
    });

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      });
    }

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      });
    } else {
      toast({
        title: "Post Created",
      });
    }
    
    navigate("/");
  };

  const handleTagClick = (tag: string) => {
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      form.setValue('tags', newTags.join(', ')); // Update the tags field value
    }
  };
  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Dish Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Disk Description</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ingredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Ingredients (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="1kg Chicken/ 2tbsps Honey/ 50mL Oil"
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Instructions (separated by forward slash " / ")
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Put your pan on medium heat./ Add chicken, honey, and oil./ Cook for 10 minutes."
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

      <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
            <FormLabel className="shad-form_label">
              Add Tags (separated by comma " , ")
            </FormLabel>
            <TagsMenu onTagClick={handleTagClick} />
            <FormControl>
              <Input
                placeholder="Budget-friendly, Vegan, High-calorie"
                type="text"
                className="shad-input"
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
            disabled={isLoadingCreate || isLoadingUpdate}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
