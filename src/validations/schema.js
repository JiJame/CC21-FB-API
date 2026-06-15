import { z } from "zod";

export const registerSchema = z
  .object({
    identity: z.string().min(2, "Email or Phone-number require"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    password: z.string().min(4, "Password at least 4 characters"),
    confirmPassword: z.string().min(4, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "ConfirmPassword must match password",
    path: ["confirmPassword"],
  });
