import * as z from "zod";

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  name: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  ingredients: z.string(),
  instructions: z.string(),
  tags: z.string(),
});

// ============================================================
// COMMENT
// ============================================================
export const CommentValidation = z.object({
  comment: z.string().min(4, { message: "Minimum 4 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
});


export const PassRecoveryValidation = z.object({
  email: z.string().email(),
});
export const ResetPassValidation = z.object({
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  repeatedPassword: z.string().min(8, { message: "Passwords must match." }),
});