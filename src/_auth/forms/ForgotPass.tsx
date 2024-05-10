import * as z from "zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast"

import { ResetPassValidation, SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";
import { account } from "@/lib/appwrite/config";

const ForgotPass = () => {
  const { toast } = useToast();
  const { isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof ResetPassValidation>>({
    resolver: zodResolver(ResetPassValidation),
    defaultValues: {
      password: "",
      confirmPassword: "",
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
  
    if (userId && secret) {
      await account.updateRecovery(
        userId,
        secret,
        password.newPassword,
        password.repeatedPassword
      )
      navigate("/sign-in");
    } else {
      // Handle the case where userId or secret is null
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
            name="password"
            render={({ field }) => (
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
            name="password"
            render={({ field }) => (
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