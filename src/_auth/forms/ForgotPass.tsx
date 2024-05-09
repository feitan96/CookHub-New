import * as z from "zod";
import React from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@/components/shared/Loader";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSignInAccount } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { EmailDetection } from "@/lib/validation";


const ResetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).nonempty({ message: "Email is required" }),
});


type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

const ForgotPass = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signInAccount, isLoading } = useSignInAccount();


  const form = useForm<z.infer<typeof EmailDetection>>({
    resolver: zodResolver(EmailDetection),
    defaultValues: {
      email: "",
    },
  });
  

  const onSubmit = async (data: ResetPasswordFormData) => {
    
    try {
      const response = await fetch('http://localhost:3001/reset-pass', {  // Include the correct server URL and endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const message = await response.text();
        toast({ title: "Reset link sent successfully. Please check your email." });
        //navigate("/sign-in");  // Optionally redirect user to login after successful operation
      } else {
        throw new Error('Failed to send reset link');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({ title: "Error sending reset link. Please try again later." });
    }
  };

  //
  
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Password Recovery</h2>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Email</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
            </FormItem>
            
          )}/>
          
          <Button type="submit" className="bg-[rgb(18,55,42)]">
            {isLoading || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Reset Password"
            )}
            
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default ForgotPass;