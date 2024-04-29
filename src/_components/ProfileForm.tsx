"use client"
import { useEffect , useState} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  about: z.string().optional(),
  institution_name: z.string().optional(),
  graduation_year: z.string().optional(),
  course_name: z.string().optional(),
  site_link: z.string().url().optional(),
  location: z.string().optional(),
  contact_mail: z.string().email().optional(),
  linkedin_profile_link: z.string().url().optional(),
})


const ProfileForm = () => {
  const navigate = useNavigate();
 const form =  useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/user/profile/getInfo",{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data  = await response.json();
      if(data){
        return {
          user_id: data.user_id,
          about : data.about,
          institution_name: data.institution_name,
        graduation_year: data.graduation_year,
        course_name: data.course_name,
        site_link: data.site_link,
        location: data.location,
        contact_mail : data.contact_mail,
        linkedin_profile_link : data.linkedin_profile_link
        }
      }else{
        return {
        user_id:"",
        about : "",
        institution_name: "",
        graduation_year:2024,
        course_name:"",
        site_link:"",
        location:"",
        contact_mail : "",
        linkedin_profile_link : "",
        }
      }
     
    }
  })

    async function onSubmit (values: z.infer<typeof formSchema>) {
      try{
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/user/profile/edit', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });
        if(response.ok){
          navigate('/profile');
        }
        }catch(err){
        console.log(err);
        }
    }

    
    return (
        <>
        <div className="flex justify-center mr-40 ml-60">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About me</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
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
          name="institution_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution name</FormLabel>
              <FormControl>
                <Input placeholder="institution" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="course_name"
          render={({ field }) => (
            <FormItem>
               <FormLabel>Course</FormLabel>
              <FormControl>
                <Input placeholder="course" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="graduation_year"
          render={({ field }) => (
            <FormItem>
               <FormLabel>Graduation year</FormLabel>
              <FormControl>
                <Input placeholder="year" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_mail"
          render={({ field }) => (
            <FormItem>
               <FormLabel>Contact mail</FormLabel>
              <FormControl>
                <Input placeholder="contact mail" {...field} />
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
               <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="site_link"
          render={({ field }) => (
            <FormItem>
               <FormLabel>portfolio link</FormLabel>
              <FormControl>
                <Input placeholder="portfolio link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          <FormField
          control={form.control}
          name="linkedin_profile_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>linkedin link</FormLabel>
              <FormControl>
                <Input placeholder="linkedin link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         
        <Button type="submit">Edit </Button>
      </form>
    </Form>
    </div>
    </>
    )
}

export default ProfileForm;