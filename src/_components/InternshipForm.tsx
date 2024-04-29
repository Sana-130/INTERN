import * as z from "zod"
import React from "react";
import { InternshipSchema } from '@/lib/validation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState , useEffect} from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LangInt } from "./LangInt";
import { InSkill } from "./InSkills";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface InternshipEditProps {
    id: number;
    title: string;
    description: string;
    company_name: string;
    user_id: number;
    last_date: string;
    min_salary: string;
    max_salary: string;
    is_active: boolean;
    createdat: string;
}
interface Company {
    id: number;
    name: string;
}

const InternshipForm: React.FC<InternshipEditProps> = ({
  id,
  title,
  company_name,
  description,
  last_date,
  min_salary,
  max_salary,
  is_active }) => {
const [date, setDate] = React.useState<Date | undefined>(
        last_date ? new Date(last_date) : undefined
);
const [companies, setCompanies] = useState<Company[]>([]);
const [edit, setEdit] = useState(false);

const form = useForm<z.infer<typeof InternshipSchema>>({
        resolver: zodResolver(InternshipSchema),
        defaultValues: {
            title: title,
            description: description,
            company_id: (companies.find(company => company.name === company_name)?.id)?.toString(),
            last_date: new Date(last_date),
            min_salary:parseInt(min_salary),
            max_salary:parseInt(max_salary)
        },
    });

    const fetchPages = async () => {
        const jwtToken = localStorage.getItem('token');
        console.log("making get request");
        try {
            const response = await fetch('http://localhost:5000/employer/pageId', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                }
            });

            if (response.ok) {
                // If the request was successful, handle the response data
                const pageData = await response.json();
                console.log('page data......', pageData);
                setCompanies(pageData);
            } else {
                // If the request failed, handle the error
                console.error('Failed to fetch profile:', response.statusText);
            }
        } catch (error) {
            // If an error occurred during the fetch request, log it
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const onSubmit = async(values: z.infer<typeof InternshipSchema>) => {
        try{
            console.log(values);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/internship/edit', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({id:id, ...values}),
            });
            if(response.ok){
              toast.info("saved changes successfullt !!");
            }
            }catch(err){
            console.log(err);
            }
    }

  return (
    <>
    {!edit? (
        <div className="flex">
    
   
    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="flex flex-row gap-48">
                            <h1 className="m-2">Edit Internship</h1>
                            <Button variant="outline" onClick={()=> setEdit(true)}>Edit Skills</Button>
                            </div>
                           
                            <FormField
                                control={form.control}
                                name="company_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                <SelectValue placeholder="Select Your Company" />
                                                        
                                                    
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {companies.map(company => (
                                                    <SelectItem value={company.id.toString()}>
                                                        {company.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="text" placeholder="title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea  placeholder="description"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-row">
                                <FormField
                                    control={form.control}
                                    name="min_salary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="number" placeholder="min range of salary" {...field} onChange={event => field.onChange(+event.target.value)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /><p className="mt-2 pl-2 pr-2 text-muted-foreground">-</p>
                                <FormField
                                    control={form.control}
                                    name="max_salary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="number" placeholder="max range of salary" {...field} onChange={event => field.onChange(+event.target.value)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <p className="mt-2 pl-2 text-muted-foreground"> / per month </p>
                            </div>
                            <div className="flex flex-row">
                                <p className="mt-2 pl-2 text-muted-foreground mr-2">Last date to apply : </p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            disabled={(date) =>
                                                date < new Date()
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <Button type="submit" className="shad-button_primary">Update</Button>
                        </form>
                    </Form>
                    </div>
    ):(
    
    <div>
         <Tabs defaultValue="lang" className="w-[800px] m-6">
                        <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="delete">Delete Skills</TabsTrigger>
                            <TabsTrigger value="lang">Add Language</TabsTrigger>
                            <TabsTrigger value="other">Add Lib/Framework/db</TabsTrigger>
                        </TabsList>
                        <TabsContent value="lang">
                        <LangInt id={id}  isLang={true} /> 
                        </TabsContent>
                        <TabsContent value="other">
                        <LangInt id={id}  isLang={false}/>   
                        </TabsContent>
                        <TabsContent value="delete">
                         <InSkill id={id} />
                        </TabsContent>
                        </Tabs>
    </div>
    
    )}
    <Toaster />
    </>
  );
};

export default InternshipForm;
