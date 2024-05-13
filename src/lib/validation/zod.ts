import { z } from "zod";

const emailDomainCheck = (email: string) => {
  return email.endsWith("@stud.noroff.no") || email.endsWith("@noroff.no");
};

// export const registerSchema = z.object({
//   email: z
//     .string()
//     .email({ message: "Invalid email address." })
//     .refine(emailDomainCheck, {
//       message: "Email must end with '@stud.noroff.no' or '@noroff.no'.",
//     }),
//   name: z
//     .string()
//     .min(3, { message: "Name should contain at least 3 characters" })
//     .max(55),
//   password: z.string().min(8).max(100),
//   comfirmPassword: z.string().min(8).max(100),
// });

// export const signinSchema = z.object({
//   email: z
//     .string()
//     .email({ message: "Invalid email address." })
//     .min(4, { message: "Email must be at least 4 characters." })
//     .refine((email) => email.includes("@noroff"), {
//       message: "Email must have valid a Noroff domain.",
//     }),
//   password: z.string().min(8, {
//     message: "Password must have at least 8 characters.",
//   }),
// });
// export const actionListingSchema = z.object({
//   title: z.string(),
//   description: z.string(),
//   topics: z.array(
//     z.object({
//       id: z.string(),
//       text: z.string(),
//     })
//   ),
// });
