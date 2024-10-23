import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().email({ message: "Enter Valid Email." }),
  password: z
    .string()
    .min(2, { message: "Password must be atleast 2 characters long." }),
});

export const categorySchema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  slug: z.string().min(3, { message: "Slug is required" }),
  content: z.string().optional(),
  image: z
    .any()
    .optional()
    .refine((file) => {
      if (file) {
        if (!(file instanceof File)) {
          return false; // Not a file
        }
        if (file.size > 1024 * 1024 * 10) {
          return false; // Size exceeds limit
        }
        const validTypes = ["image/png", "image/jpg", "image/jpeg"];
        return validTypes.includes(file.type); // Check file type
      }
      return true;
    }, "File size must be less than 10 MB Image"),
});

export const postSchema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  slug: z.string().min(3, { message: "Slug is required" }),
  content: z.string().optional(),
  categoryIds: z.preprocess((val) => {
    console.log(typeof val);
    if (typeof val == "string") {
      return JSON.parse(val).map(Number);
    }
  }, z.array(z.number()).nonempty("Post must have at least one category ID")),
  image: z
    .any()
    .optional()
    .refine((file) => {
      if (file) {
        if (!(file instanceof File)) {
          return false; // Not a file
        }
        if (file.size > 1024 * 1024 * 10) {
          return false; // Size exceeds limit
        }
        const validTypes = ["image/png", "image/jpg", "image/jpeg"];
        return validTypes.includes(file.type); // Check file type
      }
      return true;
    }, "File size must be less than 10 MB Image"),
});
