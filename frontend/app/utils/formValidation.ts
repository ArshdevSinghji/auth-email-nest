import { z } from "zod";
export const SignUpSchema = z.object({
  username: z.string().nonempty("username is required - zod"),
  email: z.string().nonempty("email is required - zod").email(),
  password: z
    .string()
    .nonempty("password is required - zod")
    .min(5, "password must be at least 5 characters"),
});

export const SignInSchema = z.object({
  email: z.string().nonempty("email is required - zod").email(),
  password: z
    .string()
    .nonempty("password is required - zod")
    .min(5, "password must be at least 5 characters"),
});

export type TSignInSchema = z.infer<typeof SignInSchema>;
export type TSignUpSchema = z.infer<typeof SignUpSchema>;
