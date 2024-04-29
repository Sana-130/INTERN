import * as z from "zod";

export const SignupValidation = z.object({
  first_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  last_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .refine((value) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(value), {
        message: "need one uppercase, one lowercase and a digit",
      }),
  confirm: z.string().min(8, { message: "Confirm password must be at least 8 characters." }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
});

export const SigninValidation = z.object({
  email:z.string().email(),
  password: z.string()
})

export const CompanyValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  link: z.string().url({ message: "Invalid URL format" }),
  
});

export const InternshipSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string(),
  company_id: z.string().optional(),
  last_date: z.date().optional(),
  min_salary: z.number().gte(0).optional(),
  max_salary: z.number().gte(0).optional(),
  
}).refine((data) => data.min_salary !== undefined && data.max_salary!=undefined && data.min_salary < data.max_salary , {
  message: "min salary should not be greater than max",
  path: ["min_salary"], // path of error
});


// Infer the type of the InternshipSchema
