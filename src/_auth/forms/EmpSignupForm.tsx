import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button  } from "@/components/ui/button";
import { SignupValidation } from "@/lib/validation";
import { useNavigate } from "react-router-dom";


const EmpSignupForm = () => {

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    console.log(values)
    try{
        const response = await fetch('http://localhost:5000/signup/employer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        if (response.ok) {
          // If the request was successful, you can proceed with further actions
          navigate("/confirm");
        } else {
          // If the request failed, handle the error accordingly
          const errorMessage = await response.text(); // Get the error message from the response body
         alert(`Signup failed: ${response.statusText}. ${errorMessage}`);
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
  }

    const navigate = useNavigate();
    
    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
          first_name: "",
          last_name:"",
          email:"",
          password:"",
          confirm:""
        
        },
      });

      return (
        <>
        <h1 className="mb-6">Employer SignUp</h1>
        <Form {...form}>
    
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="first name" {...field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="last name" {...field} />
                  </FormControl>  
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="email" {...field} />
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
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="confirm password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="shad-button_primary">Submit</Button>
            <p>or</p>
            <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account ? 
            <Link
              to="/login"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
           
          </p>
          </form>
    </Form>
    </>
      )
}

export default EmpSignupForm;