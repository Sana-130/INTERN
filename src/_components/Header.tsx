import { ModeToggle } from "@/components/ui/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  NavLink,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface User {
  first_name: string;
  last_name: string;
}

const Header = () => {
  const { user } = useAuth();
  
  const formSchema = z.object({
    first_name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    last_name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user?.first_name,
      last_name:user?.last_name
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { first_name, last_name } = values;
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("JWT token not found.");
    return;
  }

  fetch("http://localhost:5000/user/edit/names", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ first_name, last_name })
  })
    .then(response => {
      if (response.ok) {
        toast.info('profile updated');
      } else {
        console.error("Failed to update profile.");
      }
    })
    .catch(error => {
      console.error("Error updating profile:", error);
    });
  }

    const logout = async() => {
      
      localStorage.removeItem('token');
      try {
        // Make a POST request to the logout endpoint
        await fetch('/logout', {
          method: 'POST',
          credentials: 'same-origin' // Ensure cookies are included for same-origin requests
        });
      } catch (error) {
        // Handle network error or any other error
        console.error('Logout failed:', error);
      }

      window.location.href = '/login';
    }
    return (
      <>
     <nav className="navbar fixed top-0 left-0 right-0 z-10 px-4 py-2 h-16 pt-4 bg-background">
    <div className="flex items-center justify-between">
    {/* Content to be placed on the left side of the navbar */}
    <div><h3 className="scroll-m-20 text-2xl font-semibold text-primary">
      INTERN
    </h3></div>
    
    {/* Flex container for Avatar and ModeToggle components */}
    <div className="flex gap-6">
    <Button onClick={logout}><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 1C2.44771 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H10.5C10.7761 14 11 13.7761 11 13.5C11 13.2239 10.7761 13 10.5 13H3V2L10.5 2C10.7761 2 11 1.77614 11 1.5C11 1.22386 10.7761 1 10.5 1H3ZM12.6036 4.89645C12.4083 4.70118 12.0917 4.70118 11.8964 4.89645C11.7012 5.09171 11.7012 5.40829 11.8964 5.60355L13.2929 7H6.5C6.22386 7 6 7.22386 6 7.5C6 7.77614 6.22386 8 6.5 8H13.2929L11.8964 9.39645C11.7012 9.59171 11.7012 9.90829 11.8964 10.1036C12.0917 10.2988 12.4083 10.2988 12.6036 10.1036L14.8536 7.85355C15.0488 7.65829 15.0488 7.34171 14.8536 7.14645L12.6036 4.89645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></Button>
    <ModeToggle />
    {user?.role=='student' ?( <NavLink to={`/profile/${user?.id}`}>
    <div>
    <Avatar>
        <AvatarImage src={user?.imageLink} />
        <AvatarFallback>{user && user.first_name && user.last_name && (
    <>
      {user.first_name.charAt(0).toUpperCase()}
      {user.last_name.charAt(0).toUpperCase()}
    </>
  )}</AvatarFallback>
      </Avatar>
    </div>
    </NavLink>
    ): (
    <div>
       <Dialog>
      <DialogTrigger asChild>
        <Avatar>
            <AvatarImage src={user?.imageLink} />
            <AvatarFallback>{user && user.first_name && user.last_name && (
        <>
          {user.first_name.charAt(0).toUpperCase()}
          {user.last_name.charAt(0).toUpperCase()}
        </>
      )}</AvatarFallback>
          </Avatar>

      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
  
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="first name" {...field} />
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
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  
</DialogContent>

    </Dialog>
        </div>
    )}
    </div>
  </div>
  <Separator className="my-2" />
</nav>
<Toaster />
</>
    )
}

export default Header;