import { z } from "zod";

export const userSignupSchema = z.object({
    fullname: z.string().min(1, "FullName is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters."),
    contact: z.string().min(10, "contact should be 10 digit.")
})

export type SignupInputState=z.infer<typeof userSignupSchema>;

export const userLoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters.")
})

export type LoginInputState=z.infer<typeof userLoginSchema>;