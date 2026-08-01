import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .max(320, "Email address is too long.")
  .email("Enter a valid email address.")
  .transform((value) => value.toLowerCase());

const password = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be 128 characters or fewer.");

export const signInSchema = z.object({
  email,
  password: z
    .string()
    .min(1, "Enter your password.")
    .max(128, "Password must be 128 characters or fewer."),
});

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Enter your full name.")
      .max(200, "Full name must be 200 characters or fewer."),
    email,
    password,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .superRefine(({ confirmPassword, password: passwordValue }, context) => {
    if (confirmPassword !== passwordValue) {
      context.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
