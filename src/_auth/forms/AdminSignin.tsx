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
import { SigninValidation } from "@/lib/validation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Toaster, toast } from 'sonner'

const AdminSignin= () => {
  const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
            email:"",
            password:""
        },
    });

    async function onSubmit(values: z.infer<typeof SigninValidation>){
        try {
            const response = await fetch('http://localhost:5000/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
            });
        
            if (response.ok) {
              const data = await response.json();
              localStorage.setItem('token', data.token);
              setUser(data.user);
              // Store the JWT token and expiration time in localStorage
              //alert("logged in");
              navigate("/home");
            } else {
              const data = await response.json();
              setError(data.message);
            }
          } catch (error) {
            toast.error('Oops Our server is busy now');
          }
    }

    return (
        <>
        <div>
        <Form {...form}>
        
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
                <h1>Admin Login</h1>
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
                <Button type="submit" className="shad-button_primary">Login</Button>
               
                <p className="text-sm font-medium text-destructive">{error}</p>
              </form>
              
        </Form>
        
              </div>
              <Toaster />
            </>
    )
}

export default AdminSignin;