import * as z from "zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { PassRecoveryValidation } from "@/lib/validation";
import { useState } from "react";
import { account } from "@/lib/appwrite/config";


const ForgotPass = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof PassRecoveryValidation>>({
    resolver: zodResolver(PassRecoveryValidation),
    defaultValues: {
      email: "",
    },
  });

  const [userEmail, setUserEmail] = useState('');

  const forgetPassword =  async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  
    await account.createRecovery(userEmail, 'http://localhost:5173/forgot-pass');
    console.log('Email has been sent')
    toast({ title: "Email has been sent" });
  }
  
  

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
      <img src="/assets/images/cookhub.png" alt="logo" />
        
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Password Recovery
        </h2>
        <p className="text-white small-medium md:base-regular mt-2">
          Send the verified email of yor account.
        </p>

        <form
          className="flex flex-col gap-5 w-full mt-4">

          <FormField
            control={form.control}
            name="email"
            render={({ }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input
                  onChange={(e) => {
                    setUserEmail(e.target.value)
                  }} 
                  type="text" 
                  className="shad-input" 
                  />
                </FormControl>
                {/* Display error message if email format is incorrect */}
                {form.formState.errors.email && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.email.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="bg-[rgb(18,55,42)]"
            onClick={(e) => forgetPassword(e)}
            >
            Send Email
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