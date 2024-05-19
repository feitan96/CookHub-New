import * as z from "zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"

import { ResetPassValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";
import { account } from "@/lib/appwrite/config";

const ForgotPass = () => {
  const { toast } = useToast();
  useUserContext();

  const form = useForm<z.infer<typeof ResetPassValidation>>({
    resolver: zodResolver(ResetPassValidation),
    defaultValues: {
      newPassword: "",
      repeatedPassword: "",
    },
  });

  const navigate = useNavigate();

  const [password, setPassword] = useState({
    newPassword: '',
    repeatedPassword: '',
  })

  const changePassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret'); 


    // Check if the new password is between 8 and 265 characters long
    if (password.newPassword.length < 8 || password.newPassword.length > 265) {
      // If it's not, display a toast and return
      toast({ title: "Password must be between 8 and 265 characters long." });
      return;
    }

    // Check if the new password and the repeated password match
    if (password.newPassword !== password.repeatedPassword) {
      // If they don't match, display a toast and return
      toast({ title: "Passwords do not match. Please try again." });
      return;
    }
  
    if (userId && secret) {
      await account.updateRecovery(
        userId,
        secret,
        password.newPassword,
        password.repeatedPassword
      )
      toast({ title: "Password reset successful. You can now log in with your new password." });
      navigate("/sign-in");
    } else {
      // Handle the case where userId or secret is null
      toast({ title: "userId or secret is null" });
      console.error('userId or secret is null');
    }
  }
  

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
      <img src="/assets/images/cookhub.png" alt="logo" />
        
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Password Reset
        </h2>
        <p className="text-white small-medium md:base-regular mt-2">
          Input your new password and confirm.
        </p>

        <form
          className="flex flex-col gap-5 w-full mt-4">

          <FormField
            control={form.control}
            name="newPassword"
            render={({ }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input 
                  type="password" 
                  className="shad-input" 
                  onChange={(e) =>{
                    setPassword({
                      ...password,
                      newPassword : e.target.value
                    })
                  }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeatedPassword"
            render={({ }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                  type="password" 
                  className="shad-input" 
                  onChange={(e) =>{
                    setPassword({
                      ...password,
                      repeatedPassword : e.target.value
                    })
                  }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-[rgb(18,55,42)]" onClick={(e) => changePassword(e)}>
              Reset Password
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