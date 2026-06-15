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
  })
  .transform((data) => {
    const key = emailRegex.test(data.identity) ? "email" : "mobile";
    const newValue = { ...data, [key]: data.identity };
    delete newValue.identity;
    delete newValue.confirmPassword;
    return newValue;
  });

export const loginSchema = z
  .object({
    identity: z
      .string()
      .min(2, "Email or phone-number require")
      .refine((value) => emailRegex.test(value) || mobileRegex.test(value), {
        message: "identity must be a valid email or mobile number",
      }),
    password: z.string().min(4, "password at least 4 characters"),
  })
  .transform((data) => {
    const key = emailRegex.test(data.identity) ? "email" : "mobile";
    const newValue = { ...data, [key]: data.identity };
    return newValue;
  });
