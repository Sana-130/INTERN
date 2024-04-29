import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { InternshipSchema } from "@/lib/validation";
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
import { LangInt } from "./LangInt";


interface Company {
    id: number;
    name: string;
}

const AddInternship = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [date, setDate] = React.useState<Date>()
    const [id, setId] = useState<number | null>(null);

    const fetchPages = async () => {
        const jwtToken = localStorage.getItem('token');
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
                console.log('Profile data:', pageData);
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

    const form = useForm<z.infer<typeof InternshipSchema>>({
        resolver: zodResolver(InternshipSchema),

    });

    async function onSubmit(values: z.infer<typeof InternshipSchema>) {
        try {
            const { title, description, company_id, min_salary, max_salary } = values;
            const jwtToken = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/internship/add', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    min_salary,
                    max_salary,
                    company_id,
                    last_date: date,
                })
            });
            if (response.ok) {
                const data = await response.json();
                setId(data[0].id);
            } else {
                console.log(response.statusText);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className="main-content flex">
                {id === null ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ml-4">
                        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Add Internship</h3>
                            <FormField
                                control={form.control}
                                name="company_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Your Company " />
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
                                            <Input type="text" placeholder="description" {...field} />
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

                            <Button type="submit" className="shad-button_primary">Next</Button>

                        </form>
                    </Form>
                ) : (
                    <>
                      
                      <Tabs defaultValue="lang" className="w-[800px] m-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="lang">Add Language</TabsTrigger>
                            <TabsTrigger value="other">Add Lib/Framework/db</TabsTrigger>
                        </TabsList>
                        <TabsContent value="lang">
                        <LangInt id={id}  isLang={true} /> 
                        </TabsContent>
                        <TabsContent value="other">
                        <LangInt id={id}  isLang={false}/>   
                        </TabsContent>
                        </Tabs>
                    </>
                  

                )}

            </div>
            <Toaster />
        </>
    )
}

export default AddInternship;
