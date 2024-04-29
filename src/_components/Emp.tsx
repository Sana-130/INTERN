import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
  import { Button  } from "@/components/ui/button";
  import { CompanyValidation } from "@/lib/validation";
  import { Textarea } from "@/components/ui/textarea"
import Header from "./Header";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";


const Emp = () => {

    const form = useForm<z.infer<typeof CompanyValidation>>({
        resolver: zodResolver(CompanyValidation),
        defaultValues: {
            name:"",
            bio:"",
            location:"",
            link:""
        },
    });

    async function onSubmit(values: z.infer<typeof CompanyValidation>){

            try {
              const jwtToken = localStorage.getItem('token');
        
              const response = await fetch('http://localhost:5000/employer/create', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
              }); 
        
        
              if (response.ok) {
                // If the request was successful, handle the response data
                const pageData = await response.json();
                toast.info("You have successfully created a page")
                console.log('Profile data:', pageData);
              } else {
                // If the request failed, handle the error
                console.error('Failed to fetch profile:', response.statusText);
              }
            } catch (error) {
              // If an error occurred during the fetch request, log it
              console.error('Error fetching profile:', error);
            }
    }

    return (
        <>
        <div className="flex flex-row mt-32">
        <div className="w-48">
          <h1>Add Company Page</h1>
        </div>
          <div className="flex-1 m-6">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                <Textarea
                  placeholder="Tell us a bit about your company"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="url" placeholder="reference link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="shad-button_primary">Submit</Button>
          </form>
        </Form>
        </div>
        
        </div>
        <Toaster />
        </>

    )
}

export default Emp;